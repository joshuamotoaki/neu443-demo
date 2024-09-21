<script>
    import BlueButton from "$lib/components/buttons/BlueButton.svelte";
    import GreenButton from "$lib/components/buttons/GreenButton.svelte";
    import OrangeButton from "$lib/components/buttons/OrangeButton.svelte";
    import PurpleButton from "$lib/components/buttons/PurpleButton.svelte";
    import Top from "$lib/components/Top.svelte";
    import { surveyResults } from "$lib/state";

    let round = 0;
    let subRound = 0;
    let state = "survey";
</script>

<div class="h-screen flex flex-col">
    <Top />
    <main class="flex-1">
        {#if state === "game"}
            <div class="text-5xl text-center">
                <h2>Select a button</h2>
            </div>
            <div class="h-1/2 w-full flex px-16 py-8 p-16">
                <BlueButton />
                <OrangeButton />
                <PurpleButton />
                <GreenButton />
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
                    }}
                    class="b neutral">
                    😞
                </button>
                <button
                    on:click={() => {
                        $surveyResults.push(2);
                    }}
                    class="b neutral">
                    🙁
                </button>
                <button
                    on:click={() => {
                        $surveyResults.push(3);
                    }}
                    class="b neutral">
                    😐
                </button>
                <button
                    on:click={() => {
                        $surveyResults.push(4);
                    }}
                    class="b neutral">
                    🙂
                </button>
                <button
                    on:click={() => {
                        $surveyResults.push(5);
                    }}
                    class="b neutral">
                    😀
                </button>
            </div>
        {/if}
    </main>
    <footer class="w-full h-16 bg-base-300"></footer>
</div>
