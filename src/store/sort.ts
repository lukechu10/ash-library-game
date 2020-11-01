import { writable } from "svelte/store";
import { reduxify } from "svelte-reduxify";

export interface SortGameState {
    /**
     * Increment this every time a book is brought to front. This will make sure the last dragged book always has the highest z-index.
     */
    highestZIndex: number;
    /**
     * A list of books that are currently on the shelf. Ghost books should also be on the list for positioning.
     */
    booksOnShelf: { isGhost: boolean; id: string }[];
    /**
     * Current score in game.
     */
    score: number;
}

function createSortGameState() {
    const { set, subscribe, update } = writable({
        highestZIndex: 1, // start at 1 so that the first dragged book appears over rest of books (which have z-index: 0)
        booksOnShelf: [],
        score: 0,
    } as SortGameState);

    return {
        set,
        subscribe,
        update,
        /**
         * Increments highestZIndex
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
    };
}

export const sortGameState = reduxify(createSortGameState());
