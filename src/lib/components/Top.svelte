<script>
    import { isStarted, score } from "$lib/state";
</script>

<div class="navbar bg-base-300 w-full mb-12">
    <div class="w-full text-center flex items-center justify-center">
        {#if $isStarted}
            <h2 class="text-xl">
                Balance: ${$score}
            </h2>
        {:else}
            <h2 class="text-xl">NEU443 Demo Game</h2>
        {/if}
    </div>
</div>
