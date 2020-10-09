<script lang="ts">
    import { flip } from "svelte/animate";
    import { dndzone } from "svelte-dnd-action";

    let booksList: { id: number; name: string }[] = [];
    const flipDurationMs = 300;

    for (let i = 0; i < 10; i++) {
        booksList.push({ id: i, name: `book ${i}` });
    }

    function handleSort(e) {
        booksList = e.detail.items;
    }
</script>

<style>
    section {
		width: 50%;
		padding: 0.3em;
		border: 1px solid black;
        /* this will allow the dragged element to scroll the list */
		overflow: scroll;
		height: 200px;
	}

    .book {
        padding: 5px;
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
