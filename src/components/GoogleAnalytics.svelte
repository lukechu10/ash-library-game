<script lang="ts">
    import { analytics } from "../services/firebase";
    import { page } from "$app/stores";

    $: {
        analytics.setCurrentScreen($page.path);
        // @ts-expect-error google analytics typing issue
        analytics.logEvent("screen_view");
    }
</script>
