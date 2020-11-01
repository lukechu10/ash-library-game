<script lang="ts">
    import Book from "./Book.svelte";
    import BookShelf from "./BookShelf.svelte";

    const booksList = [
        { id: 0, cote: "ABC" },
        { id: 1, cote: "DEF" },
        { id: 2, cote: "GEH" },
        { id: 3, cote: "IJK" },
        { id: 4, cote: "LMN" },
    ];
</script>

<style>
    span {
        font-family: Berlin Sans FB;
        font-size: 30pt;
    }
</style>

<span>Time: ...</span>
<span>Score: ...</span>

<!-- All the books are in .books-container in DOM -->
<div class="books-container">
    {#each booksList as book (book.id)}
        <Book cote={book.cote} />
    {/each}
</div>

<BookShelf />

<!-- prevent scrolling on touchscreen because it interferes with drag and drop -->
<svelte:window on:touchmove|nonpassive={(event) => event.preventDefault()} />
