<script lang="ts">
    import { goto } from "@sapper/app";
    import { Card, Overlay, Radio } from "svelte-materialify";
    import Error from "../routes/_error.svelte";
    import { getBooks } from "../services/bookApi";
    import { db } from "../services/firebase";
    import { isCorrectlySorted, sortGameState } from "../store/sortGameState";
    import Book from "./Book.svelte";

    const numberOfRounds = 3;
    let roundNumber = 0;

    let startDimmerActive = true;
    let continueDimmerActive = false;
    let finishDimmerActive = false;
    let numOfBooks = 4;
    let bookType: "alpha" | "dewey" = "alpha";

    /**
     * Instant when timer is started. Should be set to `Date.now()` in `startTimer()`.
     */
    let timerStart: number;
    /**
     * Used for `clearTimer` in `endTimer()`
     */
    let intervalId: number | undefined = undefined;
    /**
     * Starts the timer.
     */
    const startTimer = () => {
        if (intervalId !== undefined) throw new Error("timer already started");
        timerStart = Date.now();
        intervalId = setInterval(() => {
            // update timer
            const duration = Date.now() - timerStart;
            time = Math.round(duration / 100) / 10;
        }, 100);
    };
    /**
     * Ends the timer.
     */
    const endTimer = () => {
        if (intervalId === undefined) throw new Error("timer not started yet"); // FIXME
        clearInterval(intervalId);
        intervalId = undefined; // erase intervalId
    };

    /**
     * Handler for start game button.
     */
    const startGame = async () => {
        let books = await getBooks({ amount: numOfBooks, bookType });
        sortGameState.loadBooksFromAPI(books);
        startTimer();
        startDimmerActive = false;
    };

    /**
     * Handler for continue game button.
     */
    const continueGame = async () => {
        let books = await getBooks({ amount: numOfBooks, bookType });
        sortGameState.loadBooksFromAPI(books);
        startTimer();
        continueDimmerActive = false;
    };

    /**
     * Handler for finish game button.
     */
    const finishGame = async () => {
        // save score to firestore
        await db.collection("scores").add({
            score,
            name: "AAA",
        });

        goto("/"); // go to home page
    };

    $: if ($isCorrectlySorted) {
        (window as any).confetti.start(1000);
        endTimer();

        // https://www.desmos.com/calculator/yecrb3rkbb
        score += Math.round(2000 / time + 10);
        roundNumber++;
        if (roundNumber >= numberOfRounds) {
            // finish
            console.log("finish");
            finishDimmerActive = true;
        } else {
            // show continue button
            setTimeout(() => (continueDimmerActive = true), 1000);
        }
    }

    let time = 0;
    let score = 0;
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

<span>Time: {time}s</span>
<span class="float-right">Score: {score}</span>

<div class="bg-img" />

<!-- All the books are in .books-container in DOM -->
<div class="books-container">
    {#each $sortGameState.bookList as book, i (book.DOCUMENT_ID)}
        <Book data={book} initialPos={{ x: 10 + 160 * i, y: 450 }} />
    {/each}
</div>

<Overlay active={startDimmerActive}>
    <Card outlined style="min-width:500px;min-height:200px">
        <h5 class="text-h5 ml-3">Choisir les paramètres du jeu</h5>
        <div
            class="d-flex justify-space-around difficulty-radios ml-10 mr-10 mb-5"
        >
            <Radio bind:group={numOfBooks} value={3}>3 livres</Radio>
            <Radio bind:group={numOfBooks} value={4}>4 livres</Radio>
            <Radio bind:group={numOfBooks} value={6}>6 livres</Radio>
        </div>
        <div
            class="d-flex justify-space-around difficulty-radios ml-10 mr-10 mb-5"
        >
            <Radio bind:group={bookType} value={'alpha'}>
                Ordre alphabetique
            </Radio>
            <Radio bind:group={bookType} value={'dewey'}>Ordre numerique</Radio>
        </div>
        <div class="d-flex justify-center">
            <button class="btn bg-red-500 hover:bg-red-600" on:click={startGame}>
                Commencer
            </button>
        </div>
    </Card>
</Overlay>

<!-- Continue button -->
<Overlay style="z-index: 100000" active={continueDimmerActive}>
    <button class="btn bg-red-500 hover:bg-red-600" on:click={continueGame}>Continuer</button>
</Overlay>

<!-- Finish button -->
<Overlay style="z-index: 100000" active={finishDimmerActive}>
    <h3 class="white-text">Ton score: {score}</h3>
    <button class="btn bg-red-500 hover:bg-red-600" on:click={finishGame}>Continuer</button>
</Overlay>

<!-- prevent scrolling on touchscreen because it interferes with drag and drop -->
<svelte:window on:touchmove|nonpassive={(event) => event.preventDefault()} />
