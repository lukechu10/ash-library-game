<script lang="ts">
    import { tick } from "svelte";
    import { get } from "svelte/store";
    import { sortGameState } from "../store/sort";

    export let cote: string;

    let bookEl: HTMLDivElement;
    let initialPos: { x: number; y: number };
    let diffPos: { x: number; y: number };
    let pos = { x: 0, y: 0 };
    // increment when dragging to make book appear over other books.
    let zIndex = 0;

    $: transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;

    (async () => {
        await tick();
        initialPos = bookEl.getBoundingClientRect();
    })();

    const handleMove = (event) => {
        let { x, y } = event;
        pos.x = x - initialPos.x - diffPos.x;
        pos.y = y - initialPos.y - diffPos.y;
    };

    const handleDown = (
        event: PointerEvent & { currentTarget: HTMLElement }
    ) => {
        let currentPos = event.currentTarget.getBoundingClientRect();
        diffPos = { x: event.x - currentPos.x, y: event.y - currentPos.y };
        zIndex = (get(sortGameState) as any).highestZIndex;
        sortGameState.incrementZIndex();

        window.addEventListener("pointermove", handleMove);
    };

    const handleUp = () => {
        window.removeEventListener("pointermove", handleMove);
    };
</script>

<style>
    .book {
        position: absolute;

        width: 150px;
        height: 180px;

        border-radius: 4px;

        display: inline-block;
        background-color: rgb(163, 163, 163);
        margin: 4px;

        user-select: none;
        text-align: center;
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
    on:pointerdown={handleDown}
    on:dragstart={(event) => event.preventDefault()}
    style="transform: {transform}; z-index: {zIndex};"
>
    <img
        class="book-cover"
        src="https://via.placeholder.com/140x145"
        alt="book cover"
    />
    <span>{cote}</span>
</div>

<svelte:window on:pointerup={handleUp} />
