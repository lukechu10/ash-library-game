<script lang="ts">
    import { onMount } from "svelte";
    import { getBooks } from "../services/bookApi";
    import Book from "./Book.svelte";
    import { sortGameState } from "../store/sortGameState";

    onMount(async () => {
        sortGameState.loadBooksFromAPI(await getBooks());
    });
</script>

<style>
    span {
        font-family: Berlin Sans FB;
        font-size: 30pt;
    }

    .bg-img {
        background-image: url("/images/sort/woodBg.png");
        width: 100%;
        height: 205px;
        background-repeat: repeat-x;

        position: fixed;
        top: 96px;

        z-index: -1; /* background */
    }
</style>

<span>Time: ...</span>
<span>Score: ...</span>

<div class="bg-img" />

<!-- All the books are in .books-container in DOM -->
<div class="books-container">
    {#each $sortGameState.bookList as book, i (book.DOCUMENT_ID)}
        <Book data={book} initialPos={{ x: 10 + (160 * i), y: 450 }} />
    {/each}
</div>

<!-- prevent scrolling on touchscreen because it interferes with drag and drop -->
<svelte:window on:touchmove|nonpassive={(event) => event.preventDefault()} />
