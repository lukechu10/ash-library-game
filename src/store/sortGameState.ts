import { get, writable } from "svelte/store";
import type { BookData } from "../services/bookApi";
import { reduxify } from "svelte-reduxify";

export interface SortGameState {
    /**
     * Increment this every time a book is brought to front. This will make sure the last dragged book always has the highest z-index.
     */
    highestZIndex: number;
    /**
     * A list of all books.
     */
    bookList: BookData[];
    /**
     * Current consider position. When computing location for books, if `shelfPosition >= considerPosition`, temporarily increment `shelfPosition`.
     * If no book being considered, should be `bookList.length`.
     */
    considerPosition: number;
    /**
     * Current score in game.
     */
    score: number;
}

function createSortGameState() {
    const { set, subscribe, update } = writable({
        highestZIndex: 1, // start at 1 so that the first dragged book appears over rest of books (which have z-index: 0)
        bookList: [],
        considerPosition: 0,
        score: 0,
    } as SortGameState);

    /**
     * Modifies book with `id` with new `shelfPosition` and moves other books on shelf to make space.
     */
    const insertBookToShelfAt = (index: number, id: string) => {
        update((state) => {
            let bookList = state.bookList.slice(0);

            if (process.env.NODE_ENV === "development") {
                // make sure book is not already on shelf
                if (
                    bookList.findIndex(
                        (book) =>
                            book.DOCUMENT_ID === id &&
                            book.shelfPosition !== undefined
                    ) !== -1
                )
                    throw new Error("book is already on shelf.");
            }

            // make sure book cannot be placed without a book behind
            let lastBookIndex = 0;
            bookList.forEach((book) =>
                book.shelfPosition !== undefined && book.DOCUMENT_ID !== id
                    ? lastBookIndex++
                    : {}
            );
            index = Math.min(index, lastBookIndex);

            // update index of books already on shelf
            bookList.forEach((book) => {
                if (book.shelfPosition >= index && book.DOCUMENT_ID !== id)
                    book.shelfPosition += 1;
            });

            // update index of book with id
            bookList.find(
                (book) => book.DOCUMENT_ID === id
            ).shelfPosition = index;

            return {
                bookList,
                ...state,
                considerPosition: bookList.length, // reset considerPosition
            };
        });
    };

    /**
     * Removes a book from the shelf and moves other books to fill in space. If book is not already on shelf, does nothing.
     */
    const removeBookFromShelf = (id: string) => {
        update((state) => {
            let bookList = state.bookList.slice(0);
            let bookIndex = bookList.findIndex(
                (book) =>
                    book.DOCUMENT_ID === id && book.shelfPosition !== undefined
            );

            if (bookIndex !== -1) {
                let pos = bookList[bookIndex].shelfPosition;

                // set bookIndex shelfPosition to undefined to remove from shelf
                bookList[bookIndex].shelfPosition = undefined;

                // move other books
                bookList.forEach((book) =>
                    book.shelfPosition > pos ? book.shelfPosition-- : {}
                );
            }

            return { ...state, bookList };
        });
    };

    return {
        set,
        subscribe,
        update,
        /**
         * Increments highestZIndex. Should be called on `pointerdown` event.
         */
        incrementZIndex: () => {
            update((state) => {
                let newZIndex = state.highestZIndex + 1;
                return {
                    ...state,
                    highestZIndex: newZIndex,
                };
            });
        },
        /**
         * Updates `bookList` with data.
         */
        loadBooksFromAPI: (bookList: BookData[]) => {
            update((state) => {
                return {
                    ...state,
                    considerPosition: bookList.length, // see jsdoc on considerPosition
                    bookList,
                };
            });
        },
        /**
         * If book is within drop zone, change considerPosition, else reset considerPosition.
         */
        considerBookAtPos: ({ x, y }: { x: number; y: number }, id: string) => {
            let index: number;
            let state = get({ subscribe }) as SortGameState;

            if (y < 400) {
                index = Math.max(Math.round((x - 10) / 160), 0);
            } else {
                index = state.bookList.length; // see jsdoc on considerPosition
            }
            if (state.considerPosition !== index) {
                // update
                update((state) => ({ ...state, considerPosition: index }));
            }
        },
        /**
         * Should be called on pointerup event with current position.
         * If book is within drop zone, update book shelf position.
         */
        dropBookAtPos: ({ x, y }: { x: number; y: number }, id: string) => {
            if (y < 400) {
                const index = Math.max(Math.round((x - 10) / 160), 0);
                insertBookToShelfAt(index, id);
            }
        },
        /**
         * Removes a book from the shelf and moves other books to fill in space. If book is not already on shelf, does nothing.
         */
        removeBookFromShelf,
    };
}

export const sortGameState: ReturnType<typeof createSortGameState> = (() => {
    if (process.env.NODE_ENV === "development") {
        return reduxify(createSortGameState());
    } else return createSortGameState();
})();
