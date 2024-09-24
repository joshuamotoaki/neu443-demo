<script lang="ts">
    import { SAMPLE_DATA } from "$lib/sample";
    // Charts to display
    // 1. Survey distribution for each group and overall
    // 2. Score rankings
    // 3. Round 7 purple vs yellow and green vs blue

    import { supabase } from "$lib/supabase";
    import { onMount } from "svelte";

    const COLOR_THRESH_MAP: Record<string, number> = {
        purple: 0.75, // Before
        green: 0.25, // Before
        blue: 0.25, // After
        yellow: 0.75 // After
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

    $: sortedScores = appData.toSorted((a, b) => b.score - a.score);

    const calcAvgArr = (group: "A" | "B"): number[] => {
        return appData
            .filter(x => x.group === group)
            .map(x => x.survey)
            .reduce((acc, curr) => {
                return acc.map((x, i) => x + curr[i]);
            }, Array(5).fill(0))
            .map(x => x / appData.filter(x => x.group === group).length)
            .map(x => parseFloat(x.toFixed(2)));
    };

    const calcPercentBefore = (group: "A" | "B"): number => {
        const x: (OptionsOne | OptionsTwo)[] = appData
            .filter(x => x.group === group)
            .map(x => x.answers["7"])
            .flat();

        let preCount = 0;
        let total = 0;

        for (const ans of x) {
            if (ans === "purple" || ans === "green") {
                preCount++;
            }
            total++;
        }

        return parseFloat((preCount / total).toFixed(2));
    };

    let aGroupSurveyAvg: number[] = calcAvgArr("A");
    let bGroupSurveyAvg: number[] = calcAvgArr("B");

    let aGroupBeforePercent: number = calcPercentBefore("A");
    let bGroupBeforePercent: number = calcPercentBefore("B");
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
        <section>{aGroupSurveyAvg} {bGroupSurveyAvg}</section>
        <section>{aGroupBeforePercent} {bGroupBeforePercent}</section>
    </main>
</div>
