<script lang="ts">
    import Book from "./Book.svelte";

    const booksList = [
        { id: 0, cote: "ABC" },
        { id: 1, cote: "DEF" },
        { id: 2, cote: "GEH" },
        { id: 3, cote: "IJK" },
        { id: 4, cote: "LMN" },
    ];
</script>

<style>
    section {
        width: 100%;
        padding: 0.3em;
        border: 1px solid black;

        width: 100%;
        height: 192px;
    }
</style>

<section class="book-shelf">
    {#each booksList as book (book.id)}
        <Book cote={book.cote} />
    {/each}
</section>

<!-- prevent scrolling on touchscreen because it interfers with drag and drop -->
<svelte:window on:touchmove|nonpassive={(event) => event.preventDefault()} />
