<script lang="ts">
    import ColorButton from "$lib/components/ColorButton.svelte";

    import Top from "$lib/components/Top.svelte";
    import { score, surveyResults } from "$lib/state";

    let round = 0;
    let subRound = 0;
    let state = "survey";

    const COLOR_THRESH_MAP: Record<string, number> = {
        purple: 0.5,
        green: 0.5,
        blue: 0.5,
        yellow: 0.5
    };

    const checkRound = () => {
        switch (round) {
            case 0:
                state = "survey";
                break;
            case 1:
                state = "game";
                break;
            case 2:
                state = "survey";
                break;
            case 3:
                state = "wheel";
                break;
            case 4:
                state = "survey";
                break;
            case 5:
                state = "game";
                break;
            case 6:
                state = "survey";
                break;
            case 7:
                state = "game";
                break;
            case 8:
                state = "survey";
                break;
            default:
                state = "done";
        }
    };

    const recordSurvey = (score: number) => {
        $surveyResults.push(score);
        $surveyResults = $surveyResults;
        round++;
        checkRound();
    };

    const playSlotMachine = (color: string) => {
        if (!COLOR_THRESH_MAP[color]) {
            throw new Error(`Invalid color: ${color}`);
        }

        const threshold = COLOR_THRESH_MAP[color];
        const result = Math.random();

        if (result > threshold) {
            $score += 1;
        } else {
            // $score -= 1;
        }

        subRound++;
        if (subRound === 10) {
            round++;
            subRound = 0;
        }
        checkRound();
    };

    const submitResults = async () => {
        console.log("Submitting results...");
    };

    $: console.log($surveyResults);
    $: console.log($score);
</script>

<div class="h-screen flex flex-col">
    <Top />
    <main class="flex-1">
        {#if state === "game"}
            <div class="text-5xl text-center">
                <h2>Select a slot machine</h2>
            </div>
            <div class="h-1/2 w-full flex px-16 pb-12 pt-8 p-16 gap-8">
                {#if round === 1}
                    <ColorButton
                        on:click={() => playSlotMachine("purple")}
                        color="purple"
                        emoji="🦄" />
                    <ColorButton
                        on:click={() => playSlotMachine("green")}
                        color="green"
                        emoji="🦆" />
                {:else if round === 5}
                    <ColorButton
                        on:click={() => playSlotMachine("blue")}
                        color="blue"
                        emoji="🦈" />
                    <ColorButton
                        on:click={() => playSlotMachine("yellow")}
                        color="yellow"
                        emoji="🐤" />
                {:else}
                    Hi
                {/if}
            </div>
            <div class="text-3xl text-center">
                <h3>
                    {10 - subRound} rolls remaining
                </h3>
            </div>
        {/if}

        {#if state === "survey"}
            <div class="text-5xl text-center">
                <h2>How do you feel?</h2>
            </div>
            <div class="h-1/3 w-full flex px-16 py-8 gap-4">
                <button
                    on:click={() => {
                        recordSurvey(1);
                    }}
                    class="b neutral">
                    😞
                </button>
                <button
                    on:click={() => {
                        recordSurvey(2);
                    }}
                    class="b neutral">
                    🙁
                </button>
                <button
                    on:click={() => {
                        recordSurvey(3);
                    }}
                    class="b neutral">
                    😐
                </button>
                <button
                    on:click={() => {
                        recordSurvey(4);
                    }}
                    class="b neutral">
                    🙂
                </button>
                <button
                    on:click={() => {
                        recordSurvey(5);
                    }}
                    class="b neutral">
                    😀
                </button>
            </div>
        {/if}

        {#if state === "wheel"}
            Wheel
            <button
                on:click={() => {
                    round++;
                    checkRound();
                }}
                class="b neutral">
                Spin
            </button>
        {/if}

        {#if state === "done"}
            <div class="text-5xl text-center">
                <h2>Thank you for playing!</h2>
            </div>
        {/if}
    </main>
</div>
