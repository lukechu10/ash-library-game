<script context="module" lang="ts">
    import { protectedPage } from "$lib/protectedPage";
    import type { LoadInput, LoadOutput } from "@sveltejs/kit/types/page";

    export function load(input: LoadInput): LoadOutput {
        return protectedPage(input);
    }
</script>

<h1>Account</h1>
