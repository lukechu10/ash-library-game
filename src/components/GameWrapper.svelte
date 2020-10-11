<script lang="ts">
    import { flip } from "svelte/animate";
    import { dndzone } from "svelte-dnd-action";

    let booksList: { id: number; name: string }[] = [];
    const flipDurationMs = 150;

    for (let i = 0; i < 10; i++) {
        booksList.push({ id: i, name: `book ${i}` });
    }

    function handleSort(e) {
        booksList = e.detail.items;
    }

    let booksListSecond: { id: number; name: string }[] = [];

    for (let i = 0; i < 10; i++) {
        booksListSecond.push({ id: i, name: `book second ${i}` });
    }

    function handleSortSecond(e) {
        booksListSecond = e.detail.items;
    }
</script>

<style>
    section {
		width: 100%;
		padding: 0.3em;
		border: 1px solid black;
        /* this will allow the dragged element to scroll the list */
		overflow: hidden;
		height: 150px;
	}

    div {
        display: inline-block; /* horizontal list */
        padding: 10px;
        margin: 0 2px;
    }

    .book {
        height: 100px;
        border: 2px solid black;
        border-radius: 2px;
    }
</style>

<section
    use:dndzone={{ items: booksList, flipDurationMs }}
    on:consider={handleSort}
    on:finalize={handleSort}
>
    {#each booksList as book (book.id)}
        <div class="book" animate:flip={{ duration: flipDurationMs }}>{book.name}</div>
    {/each}
</section>

<section
    use:dndzone={{ items: booksListSecond, flipDurationMs }}
    on:consider={handleSortSecond}
    on:finalize={handleSortSecond}
>
    {#each booksListSecond as book (book.id)}
        <div class="book-second" animate:flip={{ duration: flipDurationMs }}>{book.name}</div>
    {/each}
</section>

