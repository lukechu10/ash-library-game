<script lang="ts">
    import { getAnalytics, setCurrentScreen, logEvent } from "firebase/analytics";
    import { page } from "$app/stores";
    import { browser } from "$app/env";

    $: {
        if (browser) {
            const analytics = getAnalytics();

            setCurrentScreen(analytics, $page.path);
            logEvent(analytics, "screen_view");
        }
    }
</script>
