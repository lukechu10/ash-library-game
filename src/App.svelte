<script lang="ts">
</script>

<style>
    main {
        text-align: center;
        padding: 1em;
        max-width: 240px;
        margin: 0 auto;
    }

    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 4em;
        font-weight: 100;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }

    button {
        transition-duration: 200ms;
        padding: 10px;
    }

    .start-btn {
        color: white;
        background-color: #535ea8;
    }

    .start-btn:active {
        background-color: #818de0;
    }
</style>

<main>
    <h1>Ashbury Library Game</h1>
    <button>Leaderboards</button>
    <button class="start-btn">Commencer</button>
</main>
