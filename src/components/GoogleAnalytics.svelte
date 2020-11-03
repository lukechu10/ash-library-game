<script lang="ts">
    import { analytics } from "../services/firebase";
    import { stores } from "@sapper/app";
    const { page } = stores();

    $: {
        analytics.setCurrentScreen($page.path);
        analytics.logEvent("screen_view");
    }
</script>
