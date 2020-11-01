<script lang="ts">
    import { sortGameState } from "../store/sort";
    import type { Book } from "../services/bookApi";
    import { getCoteFromBook } from "../services/bookApi";

    /**
     * Set to `true` to make book appear faded out. Ghost books should be used when the player is considering dropping a book onto the book shelf.
     */
    export let isGhost = false;
    export let isDragging = false;

    /**
     * Data from book api.
    */
    export let data: Book;
    /**
     * Extract cote from book data.
    */
    $: cote = getCoteFromBook(data);

    /**
     * The current position of the book (fixed position).
     */
    export let pos = { x: 0, y: 0 };
    $: transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
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
        pos.x = x - diffPos.x;
        pos.y = y - diffPos.y;
    };

    const handleMove = (event) => {
        let { x, y } = event;
        moveTo({ x, y });
    };

    const handleDown = (
        event: PointerEvent & { currentTarget: HTMLElement }
    ) => {
        let currentPos = event.currentTarget.getBoundingClientRect();
        diffPos = { x: event.x - currentPos.x, y: event.y - currentPos.y };

        zIndex = $sortGameState.highestZIndex;
        sortGameState.incrementZIndex();

        isDragging = true;

        window.addEventListener("pointermove", handleMove);
    };

    const handleUp = () => {
        isDragging = false;

        window.removeEventListener("pointermove", handleMove);
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
    }

    .ghost.book {
        opacity: 50%;
    }

    .dragging.book {
        box-shadow: black 0px 0px 7px;
    }

    .book:hover {
        cursor: pointer;
    }

    .book-cover {
        position: relative;
        top: 5px;

        border-radius: 4px;
    }

    span {
        font: 20pt "Berlin Sans FB", sans-serif;
    }
</style>

<div
    bind:this={bookEl}
    class="book"
    class:ghost={isGhost}
    class:dragging={isDragging}
    on:pointerdown={handleDown}
    on:dragstart={(event) => event.preventDefault()}
    style="transform: {transform}; z-index: {zIndex}"
>
    <img
        class="book-cover"
        src={data.imageUrl}
        alt="book cover"
        width="140px"
        height="145px"
    />

    <span>{cote}</span>
</div>

<svelte:window on:pointerup={handleUp} />
