<script lang="ts">
    import { Button, Card, Overlay, Radio } from "svelte-materialify";
    import { getBooks } from "../services/bookApi";
    import { isCorrectlySorted, sortGameState } from "../store/sortGameState";
    import Book from "./Book.svelte";

    let dimmerActive = true;
    let numOfBooks = 4;

    async function startGame() {
        let books = await getBooks({ amount: numOfBooks, bookType: "dewey" });
        sortGameState.loadBooksFromAPI(books);
        dimmerActive = false;
    }

    $: $isCorrectlySorted ? (window as any).confetti.start(1000) : {};
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
<p>Correctly sorted: {$isCorrectlySorted}</p>

<!-- All the books are in .books-container in DOM -->
<div class="books-container">
    {#each $sortGameState.bookList as book, i (book.DOCUMENT_ID)}
        <Book data={book} initialPos={{ x: 10 + (160 * i), y: 450 }} />
    {/each}
</div>

<Overlay active={dimmerActive}>
    <Card outlined style="min-width:500px;min-height:200px">
        <h5 class="text-h5 ml-3">Choisir une difficulté</h5>
        <div
            class="d-flex justify-space-around difficulty-radios ml-10 mr-10 mb-5"
        >
            <Radio bind:group={numOfBooks} value={3}>3 livres</Radio>
            <Radio bind:group={numOfBooks} value={4}>4 livres</Radio>
            <Radio bind:group={numOfBooks} value={6}>6 livres</Radio>
        </div>
        <div class="d-flex justify-center">
            <Button class="red white-text mb-3" on:click={startGame}>
                Commencer
            </Button>
        </div>
    </Card>
</Overlay>

<!-- prevent scrolling on touchscreen because it interferes with drag and drop -->
<svelte:window on:touchmove|nonpassive={(event) => event.preventDefault()} />
