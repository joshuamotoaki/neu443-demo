<script lang="ts">
    import { SAMPLE_DATA } from "$lib/sample";
    // Charts to display
    // 1. Survey distribution for each group and overall
    // 2. Score rankings
    // 3.

    import { supabase } from "$lib/supabase";
    import { onMount } from "svelte";

    const COLOR_THRESH_MAP: Record<string, number> = {
        purple: 0.75,
        green: 0.25,
        blue: 0.25,
        yellow: 0.75
    };

    type OptionsOne = "purple" | "green";
    type OptionsTwo = "blue" | "yellow";

    type AnswerSheet = {
        "1": OptionsOne[];
        "5": OptionsTwo[];
        "7": (OptionsOne | OptionsTwo)[];
    };

    type DataEntry = {
        group: "A" | "B";
        answers: AnswerSheet;
        survey: number[];
        score: number;
    };

    // let appData: DataEntry[] = [];
    let appData: DataEntry[] = SAMPLE_DATA as DataEntry[];

    supabase
        .channel("data")
        .on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "data"
            },
            payload => {
                appData.push(payload.new.data);
                appData = appData;
            }
        )
        .subscribe();

    // onMount(async () => {
    //     const { data, error } = await supabase.from("data").select("*");

    //     if (error) {
    //         console.error(error);
    //     } else {
    //         appData.push(...data.map(x => x.data));
    //     }
    //     appData = appData;
    // });

    $: console.log(appData);
    $: sortedScores = appData.toSorted((a, b) => b.score - a.score);
</script>

<div class="h-screen w-screen flex p-2">
    <aside class="rounded-md bg-green-100 shadow-lg p-2">
        <h2 class="font-semibold">Leaderboard</h2>
        <ul>
            {#each sortedScores as { score, group }, i}
                <li>
                    <span>{i + 1}.</span>
                    <span>{score} ({group})</span>
                </li>
            {/each}
        </ul>
    </aside>
    <main class="flex-1">
        <section></section>
        <section></section>
    </main>
</div>
