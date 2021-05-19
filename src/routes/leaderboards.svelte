<script lang="ts">
    import { getFirestore, collection, getDocs, query, orderBy, limit } from "firebase/firestore";

    const db = getFirestore();
    let scores = getDocs(
        query(collection(db, "scores"), orderBy("score", "desc"), limit(20))
    ).then((scores) => scores.docs.map((d) => d.data()));
</script>

<h1 class="text-lg font-bold">Leaderboards</h1>
<a class="btn" href="./">Back</a>

<ul>
    {#await scores}
        Loading...
    {:then scores}
        {#each scores as score}
            <li>
                {score.name} - {score.score}
            </li>
        {/each}
    {/await}
</ul>
