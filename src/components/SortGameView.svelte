<script lang="ts">
    import { onMount } from "svelte";
    import { getBooks } from "../services/bookApi";
    import Book from "./Book.svelte";

    /**
     * List of all books (excluding ghost books).
     */
    let bookList = [];
    onMount(async () => {
        bookList = await getBooks();
    });

    $: console.log("Book list changed", bookList);
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
    {#each bookList as book (book.DOCUMENT_ID)}
        <Book data={book} />
    {/each}
</div>

<!-- prevent scrolling on touchscreen because it interferes with drag and drop -->
<svelte:window on:touchmove|nonpassive={(event) => event.preventDefault()} />
