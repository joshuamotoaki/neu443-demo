<script>
    import ColorButton from "$lib/components/ColorButton.svelte";

    import Top from "$lib/components/Top.svelte";
    import { score, surveyResults } from "$lib/state";

    let round = 1;
    let subRound = 0;
    let state = "game";

    $: console.log($surveyResults);
    $: console.log($score);
</script>

<div class="h-screen flex flex-col">
    <Top />
    <main class="flex-1">
        {#if state === "game"}
            <div class="text-5xl text-center">
                <h2>Select a button</h2>
            </div>
            <div class="h-1/2 w-full flex px-16 py-8 p-16 gap-8">
                {#if round === 1}
                    <ColorButton color="purple" emoji="🦄" />
                    <ColorButton color="green" emoji="🦆" />
                {:else if round === 2}
                    <ColorButton color="blue" emoji="🦈" />
                    <ColorButton color="orange" emoji="🦊" />
                {:else if round === 3}
                    <ColorButton color="red" emoji="🦀" />
                    <ColorButton color="yellow" emoji="🐤" />
                {:else}
                    Hi
                {/if}
            </div>
        {/if}

        {#if state === "survey"}
            <div class="text-5xl text-center">
                <h2>How do you feel?</h2>
            </div>
            <div class="h-1/3 w-full flex px-16 py-8 gap-4">
                <button
                    on:click={() => {
                        $surveyResults.push(1);
                        $surveyResults = $surveyResults;
                    }}
                    class="b neutral">
                    😞
                </button>
                <button
                    on:click={() => {
                        $surveyResults.push(2);
                        $surveyResults = $surveyResults;
                    }}
                    class="b neutral">
                    🙁
                </button>
                <button
                    on:click={() => {
                        $surveyResults.push(3);
                        $surveyResults = $surveyResults;
                    }}
                    class="b neutral">
                    😐
                </button>
                <button
                    on:click={() => {
                        $surveyResults.push(4);
                        $surveyResults = $surveyResults;
                    }}
                    class="b neutral">
                    🙂
                </button>
                <button
                    on:click={() => {
                        $surveyResults.push(5);
                        $surveyResults = $surveyResults;
                    }}
                    class="b neutral">
                    😀
                </button>
            </div>
        {/if}
    </main>
    <footer class="w-full h-16 bg-base-300"></footer>
</div>
