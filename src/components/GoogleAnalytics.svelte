<script lang="ts">
    import { analytics } from "../services/firebase";
    import { stores } from "@sapper/app";
    const { page } = stores();

    $: {
        analytics.setCurrentScreen($page.path);
        // @ts-expect-error google analytics typing issue
        analytics.logEvent("screen_view");
    }
</script>
