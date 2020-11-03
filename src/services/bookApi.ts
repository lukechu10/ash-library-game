export interface BookData extends RawBook {
    imageUrl: string;
    /**
     * Position of book on shelf. If not on shelf, value should be `undefined`. Starts as `undefined`.
     */
    shelfPosition?: number;
}

export interface RawBook {
    DOCUMENT_ID: string;
    TITRE: string;
    SUPPORT: string;
    /**
     * Sticker
     */
    COTE: string;
    IMAGE: string;
}

export async function getBooks(): Promise<BookData[]> {
    const apiRes = await fetch(
        `/api/getBooks?amount=5&bookType=alpha`
    );
    const books: BookData[] = await apiRes.json();

    return books;
}

export function getCoteFromBook(book: BookData) {
    // cote text
    const deweyPos = book.COTE.search(/[0-9]{3}/);
    if (deweyPos !== -1) {
        return book.COTE.substr(deweyPos, 3);
    } else {
        const alphaPos = book.COTE.search(/ [a-zA-Z]{1,}/);
        if (alphaPos !== -1) {
            return book.COTE.substr(alphaPos);
        } else {
            throw new Error("Invalid COTE");
        }
    }
}
