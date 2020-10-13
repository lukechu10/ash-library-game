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
        /* this will allow the dragged element to scroll the list */
        /* overflow: hidden; */
        height: 192px;
    }
</style>

<section class="book-shelf">
    {#each booksList as book (book.id)}
        <Book cote={book.cote} />
    {/each}
</section>
