<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let color: String;
    export let emoji: String;
</script>

<button
    on:click={() => {
        dispatch("click", { color: color });
    }}
    class="{color} b">
    {emoji}
</button>
