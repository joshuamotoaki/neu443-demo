<script>
    import Top from "$lib/components/Top.svelte";

    let round = 0;
</script>

<div class="h-screen flex flex-col">
    <Top />
    <main class="flex-1">
        <div class="text-5xl text-center">
            <h2>Select a button</h2>
        </div>
        <div class="h-1/2 w-full flex gap-16 p-16">
            <button class="green b"> 🦆</button>
            <button class="blue b">🦈</button>
        </div>
    </main>
    <footer class="w-full h-16 bg-base-300"></footer>
</div>

<style lang="postcss">
    .b {
        @apply rounded-md flex-1 text-8xl duration-150;
    }

    .blue {
        @apply bg-blue-500 hover:bg-blue-600;
    }

    .green {
        @apply bg-green-500 hover:bg-green-600;
    }

    .red {
        @apply bg-red-500 hover:bg-red-600;
    }

    .yellow {
        @apply bg-yellow-500 hover:bg-yellow-600;
    }
</style>
