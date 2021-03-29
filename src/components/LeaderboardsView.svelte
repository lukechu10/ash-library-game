<script>
    import { db } from "../services/firebase";
    import { collectionData } from "rxfire/firestore";

    let scores = collectionData(
        db.collection("scores").orderBy("score", "desc").limit(15)
    );
</script>

<style>
    h1,
    p {
        text-align: center;
        margin: 0 auto;
    }

    h1 {
        font-size: 2.8em;
        text-transform: uppercase;
        font-weight: 700;
        margin: 0 0 0.5em 0;
    }
</style>

<h1>Leaderboards</h1>
<a href="./">Back</a>

<div>
    {#if $scores === undefined}
        <p>Loading...</p>
    {:else}
        {#each $scores as score}
            <p>{score.name} - {score.score}</p>
        {/each}
    {/if}
</div>
