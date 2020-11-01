import { writable } from "svelte/store";

export interface SortGameState {
    /**
     * Increment this every time a book is brought to front. This will make sure the last dragged book always has the highest z-index.
     */
    highestZIndex: number;
}

function createSortGameState() {
    const { set, subscribe, update } = writable({
        highestZIndex: 1, // start at 1 so that the first dragged book appears over rest of books (which have z-index: 0)
    } as SortGameState);

    return {
        set,
        subscribe,
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

export const sortGameState = createSortGameState();
