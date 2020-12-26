<script lang="ts">
    import { sortGameState, isCorrectlySorted } from "../store/sortGameState";
    import type { BookData } from "../services/bookApi";
    import { getCoteFromBook } from "../services/bookApi";
    import { tweened } from "svelte/motion";
    import { cubicOut } from "svelte/easing";
    import { get } from "svelte/store";

    export let isDragging = false;

    /**
     * Data from book api.
     */
    export let data: BookData;
    /**
     * Extract cote from book data.
     */
    $: cote = getCoteFromBook(data);

    $: isAfterConsiderPos =
        $sortGameState.considerPosition <= data.shelfPosition;
    $: computedShelfPos = data.shelfPosition + (isAfterConsiderPos ? 1 : 0);
    $: data.shelfPosition !== undefined
        ? pos.set({ x: 10 + 160 * computedShelfPos, y: 110 })
        : {};

    /**
     * The initial position of the book. This is not updated when book moves. Use `pos` instead.
     */
    export let initialPos = { x: 0, y: 0 };

    /**
     * The current position of the book (fixed position).
     */
    export let pos = tweened(initialPos, {
        duration: 400 /* ms */,
        easing: cubicOut,
    });
    $: transform = `translate3d(${$pos.x}px, ${$pos.y}px, 0)`;

    /**
     * Ref to book div.
     */
    let bookEl: HTMLDivElement;
    /**
     * Record position on pointerdown event so mouse doesn't need to be in center of book.
     */
    let diffPos: { x: number; y: number };
    /**
     * increment when dragging to make book appear over other books.
     */
    let zIndex = 0;

    /**
     * Moves book to a location (without animation).
     */
    const moveTo = ({ x, y }) => {
        pos.set(
            {
                x: x - diffPos.x,
                y: y - diffPos.y,
            },
            {
                duration: 0, // disable animation when dragging
            }
        );
    };

    const handleMove = (event) => {
        let { x, y } = event;
        moveTo({ x, y });

        sortGameState.considerBookAtPos($pos, data.DOCUMENT_ID);
    };

    const handleDown = (
        event: PointerEvent & { currentTarget: HTMLElement }
    ) => {
        // do not allow dragging when books are already sorted.
        if ($isCorrectlySorted) return;

        let currentPos = event.currentTarget.getBoundingClientRect();
        diffPos = { x: event.x - currentPos.x, y: event.y - currentPos.y };

        zIndex = $sortGameState.highestZIndex;
        sortGameState.incrementZIndex();

        isDragging = true;

        // remove book before drag start
        if (data.shelfPosition !== undefined) {
            sortGameState.removeBookFromShelf(data.DOCUMENT_ID);
            // prevent other books from filling space before dragging
            sortGameState.considerBookAtPos($pos, data.DOCUMENT_ID);
        }
        window.addEventListener("pointermove", handleMove);
    };

    const handleUp = () => {
        // make sure handler is only triggered on book that is being dragged because event is attached on window.
        // isDragging is set in handleDown.
        if (isDragging) {
            isDragging = false;

            sortGameState.dropBookAtPos(get(pos), data.DOCUMENT_ID);
            window.removeEventListener("pointermove", handleMove);
        }
    };
</script>

<style>
    .book {
        position: fixed;
        top: 0;
        left: 0;

        width: 150px;
        height: 180px;

        border-radius: 4px;

        display: inline-block;
        background-color: rgb(163, 163, 163);
        margin: 0;

        user-select: none;
        text-align: center;

        transition-duration: 200ms;
        transition-property: box-shadow;

        will-change: transform;
    }

    .dragging.book {
        box-shadow: black 0px 0px 7px;
    }

    .correct.book {
        background-color: rgb(101, 184, 98);
    }

    .book:hover {
        cursor: pointer;
    }

    .book-cover {
        position: relative;
        top: 5px;

        border-radius: 4px;
        width: 140px;
        height: 145px;
        margin: 0 auto;
    }

    span {
        font: 20pt "Berlin Sans FB", sans-serif;
    }
</style>

<div
    bind:this={bookEl}
    class="book"
    class:dragging={isDragging}
    class:correct={$isCorrectlySorted}
    on:pointerdown={handleDown}
    on:dragstart={(event) => event.preventDefault()}
    style="transform: {transform}; z-index: {zIndex}"
>
    <img class="book-cover" src={data.imageUrl} alt="book cover" />

    <span>{cote}</span>
</div>

<svelte:window on:pointerup={handleUp} />
