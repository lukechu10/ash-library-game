import type { BookData, RawBook } from "$lib/bookApi";
import type { RequestHandler } from "@sveltejs/kit";
import bookData from "../../../static/books.json";
import Ajv, { JSONSchemaType } from "ajv";
const ajv = new Ajv();

/**
 * Used for filtering books.
 */
enum BookType {
    /**
     * Fiction books. Uses alphabetical order for sorting
     */
    Alpha = "alpha",
    /**
     * Non fiction books. Uses numerical order for sorting.
     */
    DeweyDecimal = "dewey"
}

function getBookType(book: RawBook): BookType {
    const cote = book.COTE;

    if (cote.search(/[0-9]{3}/) === -1) {
        return BookType.Alpha;
    } else {
        return BookType.DeweyDecimal;
    }
}

function getImageUrl(book: RawBook): BookData {
    const BASE_URL = "https://www.hiboutheque.fr/noyau/upload/vignette_document/";

    const imageData = book.IMAGE;
    let imageUrl: string;

    if (imageData.match(/[0-9]{14,15}\.[a-z]*/)) {
        // e.g. 200804011130508.jpg
        imageUrl = `${BASE_URL}A_${imageData.slice(0, 4)}/M_${imageData.slice(4, 6)}/${imageData}`;
    } else if (imageData.match(/[a-zA-Z]{3}[0-9]{3,}\.[a-z]*/)) {
        // e.g tob165.jpg
        imageUrl = `${BASE_URL}${imageData}`;
    } else if (imageData.match(/[0-9]{1,8}\.[a-z]*/)) {
        // e.g. 80116005.jpg
        imageUrl = `${BASE_URL}F_${imageData.slice(0, 2)}/${imageData}`;
    } else if (imageData.match(/[0-9]*_[0-9]{4}-[0-9]{2}.*/)) {
        // e.g. 2_2012-06-18_10-46-37_.gif
        const firstUnderscorePos = imageData.indexOf("_");
        const year = imageData.slice(firstUnderscorePos + 1, firstUnderscorePos + 5);
        const month = imageData.slice(firstUnderscorePos + 6, firstUnderscorePos + 8);
        imageUrl = `${BASE_URL}A_${year}/M_${month}/${imageData}`;
    } else {
        throw new Error(`Could not get image url for ${imageData}`); // should be unreachable
    }

    return { ...book, imageUrl };
}

/**
 * Triages the BookList into fiction and non fiction (alphabetical sorting and numerical sorting).
 * @param data the `BookList` to triage.
 */
async function triage(data: RawBook[]): Promise<{ alpha: RawBook[]; deweyDecimal: RawBook[] }> {
    const alpha: RawBook[] = [];
    const deweyDecimal: RawBook[] = [];

    data.forEach((book) => {
        const bookType = getBookType(book);
        if (bookType == BookType.Alpha) {
            alpha.push(book);
        } else {
            deweyDecimal.push(book);
        }
    });

    return { alpha, deweyDecimal };
}

/**
 * Shuffles `arr` in place.
 * @param arr items to shuffle.
 */
function shuffle<T>(arr: Array<T>): Array<T> {
    let j, x, i;
    for (i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = arr[i];
        arr[i] = arr[j];
        arr[j] = x;
    }
    return arr;
}

/**
 * Gets a list of random books.
 * @param type the type of book to get.
 * @param amount the amount of books to get.
 */
async function getRandomBooks(type: BookType, amount: number): Promise<RawBook[]> {
    let books: RawBook[];

    // Use .slice(0) to create a clone of array
    if (type == BookType.Alpha) {
        books = (await triage(bookData)).alpha.slice(0);
    } else {
        books = (await triage(bookData)).deweyDecimal.slice(0);
    }

    if (amount > books.length) {
        throw new Error("there are not enough books to satisfy amount");
    }

    const result = shuffle(books).slice(0, amount);

    return result;
}

export const get: RequestHandler = async ({ query }) => {
    const queryObj = {
        amount: parseInt(query.get("amount")!),
        bookType: query.get("bookType")!
    };

    interface GetBooksOpts {
        amount: number;
        bookType: "alpha" | "dewey";
    }
    const schema: JSONSchemaType<GetBooksOpts> = {
        type: "object",
        properties: {
            amount: { type: "integer" },
            bookType: { type: "string", pattern: "(alpha|dewey)" }
        },
        required: ["amount", "bookType"],
        additionalProperties: false
    };
    if (!ajv.validate(schema, queryObj))
        return { status: 400, body: { type: "Input does not match schema" } };

    try {
        const randBooks = (
            await getRandomBooks(queryObj.bookType as BookType, queryObj.amount)
        ).map(getImageUrl);
        return { body: JSON.stringify(randBooks) };
    } catch (err) {
        if (err.message === "there are not enough books to satisfy amount") {
            return {
                status: 400,
                body: JSON.stringify("amount query exceeds maximum number of books")
            };
        } else {
            console.error(err);
            return {
                status: 400,
                body: JSON.stringify({ type: "Unexpected error" })
            };
        }
    }
};
