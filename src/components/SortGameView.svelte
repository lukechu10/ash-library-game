<script lang="ts">
    import Book from "$components/Book.svelte";
    import Overlay from "$components/Overlay.svelte";
    import { getBooks } from "$services/bookApi";
    import { addNewScore } from "$services/firebase";
    import { isCorrectlySorted, sortGameState } from "$store/sortGameState";
    import { goto } from "@sapper/app";
    import { onDestroy } from "svelte";

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
        if (intervalId !== undefined) throw "timer already started";
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
        if (intervalId === undefined) throw "timer not started yet";
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
        await addNewScore({ name: "AAA", score });
        sortGameState.reset();

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

    onDestroy(() => {
        sortGameState.reset(); // reset state for next game
    });
</script>

<style>
    .sort-game-view {
        position: fixed;
        left: 0;
    }

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

    fieldset label {
        font-weight: initial;
    }
</style>

<div class="w-full sort-game-view">
    <div class="flex flex-row w-full">
        <span class="flex-1">Time: {time}s</span>
        <span class="flex-1">Score: {score}</span>
    </div>

    <div class="bg-img" />

    <!-- All the books are in .books-container in DOM -->
    <div class="books-container">
        {#each $sortGameState.bookList as book, i (book.DOCUMENT_ID)}
            <Book data={book} initialPos={{ x: 10 + 160 * i, y: 450 }} />
        {/each}
    </div>

    <Overlay active={startDimmerActive}>
        <div class="max-w-md card">
            <h3 class="self-center text-lg font-bold">
                Choisir les paramètres du jeu
            </h3>
            <div
                class="mr-10 mb-5 ml-10 d-flex justify-space-around difficulty-radios"
            >
                <fieldset class="flex flex-col">
                    <div class="self-center">
                        <legend class="font-semibold">Nombre de livres</legend>
                    </div>
                    <div class="flex flex-col">
                        <label class="flex items-center">
                            <input
                                type="radio"
                                class="radio"
                                bind:group={numOfBooks}
                                value={3}
                            />
                            3 livres
                        </label>
                        <label class="flex items-center">
                            <input
                                type="radio"
                                class="radio"
                                bind:group={numOfBooks}
                                value={4}
                            />
                            4 livres
                        </label>
                        <label class="flex items-center">
                            <input
                                type="radio"
                                class="radio"
                                bind:group={numOfBooks}
                                value={6}
                            />
                            6 livres
                        </label>
                    </div>
                </fieldset>
                <fieldset class="flex flex-col">
                    <div class="self-center">
                        <legend class="font-semibold">Type de livre</legend>
                    </div>
                    <div class="flex flex-col">
                        <label>
                            <input
                                type="radio"
                                class="radio"
                                bind:group={bookType}
                                value={"alpha"}
                            />Ordre alphabétique</label
                        >
                        <label>
                            <input
                                type="radio"
                                class="radio"
                                bind:group={bookType}
                                value={"dewey"}
                            />Ordre numérique</label
                        >
                    </div>
                </fieldset>
            </div>
            <div class="flex justify-center">
                <button
                    class="bg-red-500 btn hover:bg-red-600"
                    on:click={startGame}
                >
                    Commencer
                </button>
            </div>
        </div>
    </Overlay>

    <!-- Continue button -->
    <Overlay active={continueDimmerActive}>
        <button class="bg-red-500 btn hover:bg-red-600" on:click={continueGame}
            >Continuer</button
        >
    </Overlay>

    <!-- Finish button -->
    <Overlay active={finishDimmerActive}>
        <div class="flex flex-col items-center">
            <p class="mb-3 text-lg font-semibold text-white">
                Ton score:
                {score}
            </p>
            <button
                class="bg-red-500 btn hover:bg-red-600"
                on:click={finishGame}>Continuer</button
            >
        </div>
    </Overlay>
</div>

<!-- prevent scrolling on touchscreen because it interferes with drag and drop -->
<svelte:window on:touchmove|nonpassive={(event) => event.preventDefault()} />
