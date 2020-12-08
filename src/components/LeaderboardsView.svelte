<script>
    import { db } from "../services/firebase";

    let scores = db
        .collection("scores")
        .orderBy("score", "desc")
        .limit(10)
        .get()
        .then((querySnapshot) => {
            const data = [];
            querySnapshot.forEach((doc) => {
                data.push(doc);
            });
            return data;
        });
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
    {#await scores}
        <p>Loading...</p>
    {:then scores}
        {#each scores as score}
            <p>{score.data().name} - {score.data().score}</p>
        {/each}
    {/await}
</div>
