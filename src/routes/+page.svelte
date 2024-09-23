<script lang="ts">
    import ColorButton from "$lib/components/ColorButton.svelte";

    import Top from "$lib/components/Top.svelte";
    import { answerLog, isStarted, score, surveyResults } from "$lib/state";
    import { supabase } from "$lib/supabase";

    const group = Math.random() > 0.5 ? "A" : "B";

    let round = 0;
    let subRound = 0;
    let state = "survey";

    const NUM_ROUNDS = 20;

    const COLOR_THRESH_MAP: Record<string, number> = {
        purple: 0.8,
        green: 0.3,
        blue: 0.3,
        yellow: 0.8
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
                if (group === "A") {
                    $score += 14;
                } else {
                    $score -= 14;
                }
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
                submitResults();
                state = "done";
        }
    };

    const recordSurvey = (score: number) => {
        $surveyResults.push(score);
        $surveyResults = $surveyResults;
        round++;
        checkRound();
    };

    const playSlotMachine = (color: string, double: boolean = false) => {
        if (!COLOR_THRESH_MAP[color]) {
            throw new Error(`Invalid color: ${color}`);
        }

        const threshold = COLOR_THRESH_MAP[color];
        const result = Math.random();

        if (!$answerLog[round]) $answerLog[round] = [];
        $answerLog[round].push(color);

        if (result > threshold) {
            if (double) $score += 2;
            else $score += 1;
        }

        subRound++;
        if (subRound === 20) {
            round++;
            subRound = 0;
        }
        checkRound();
    };

    const submitResults = async () => {
        const toSubmit = {
            data: {
                group: group,
                answers: $answerLog,
                survey: $surveyResults,
                score: $score
            }
        };

        await supabase.from("data").insert(toSubmit);
    };
</script>

<div class="h-screen flex flex-col">
    <Top />
    <main class="flex-1">
        {#if !$isStarted}
            <div class="text-center space-y-4 mx-auto w-11/12">
                <h1 class="text-4xl">Welcome to the experiment!</h1>

                <p class="text-lg">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Eius sapiente cum debitis soluta, numquam doloribus quos a
                    rerum excepturi itaque vero quas voluptate enim obcaecati
                    accusantium, maiores quis harum totam.
                </p>

                <button
                    on:click={() => {
                        $isStarted = true;
                        checkRound();
                    }}
                    class="btn btn-lg btn-primary">
                    Start
                </button>
            </div>
        {:else}
            {#if state === "game"}
                <div class="text-5xl text-center">
                    <h2>Select a slot machine</h2>
                    {#if round > 5}
                        <h3 class="text-2xl">Rewards are now doubled!</h3>
                    {/if}
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
                    {:else if subRound < Math.floor(NUM_ROUNDS / 2)}
                        <ColorButton
                            on:click={() => playSlotMachine("blue", true)}
                            color="blue"
                            emoji="🦈" />
                        <ColorButton
                            on:click={() => playSlotMachine("green", true)}
                            color="green"
                            emoji="🦆" />
                    {:else}
                        <ColorButton
                            on:click={() => playSlotMachine("yellow", true)}
                            color="yellow"
                            emoji="🐤" />
                        <ColorButton
                            on:click={() => playSlotMachine("purple", true)}
                            color="purple"
                            emoji="🦄" />
                    {/if}
                </div>
                <div class="text-3xl text-center">
                    <h3>
                        {NUM_ROUNDS - subRound} rolls remaining
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
                {#if group === "A"}
                    <div class="text-3xl text-center">
                        <h2>
                            🎉 Congratulations! You win a surprise gift of $14!
                        </h2>
                    </div>
                {:else}
                    <div class="text-3xl text-center">
                        <h2>Oh no! You lost your wallet and lost $14!</h2>
                    </div>
                {/if}

                <div class="text-3xl text-center mt-8">
                    <button
                        on:click={() => {
                            round++;
                            checkRound();
                        }}
                        class="btn btn-primary btn-lg">
                        Proceed
                    </button>
                </div>
            {/if}

            {#if state === "done"}
                <div class="text-5xl text-center">
                    <h2>Thank you for playing!</h2>
                </div>
                <div class="text-3xl text-center mt-4">
                    You won ${$score}!
                </div>
                <p class="text-lg mt-4 text-center">
                    Check the board for results.
                </p>
            {/if}
        {/if}
    </main>
</div>
