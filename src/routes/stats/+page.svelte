<script lang="ts">
    import { SAMPLE_DATA } from "$lib/sample";
    // Charts to display
    // 1. Survey distribution for each group and overall
    // 2. Score rankings
    // 3. Round 7 purple vs yellow and green vs blue

    import { supabase } from "$lib/supabase";
    import Chart from "chart.js/auto";
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
                refreshCharts();
            }
        )
        .subscribe();

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

    let surveyAvgData = {
        labels: ["Start", "After G1", "After Wheel", "After G2", "End"],
        datasets: [
            {
                label: "Group A",
                data: aGroupSurveyAvg,
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1
            },
            {
                label: "Group B",
                data: bGroupSurveyAvg,
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1
            }
        ]
    };

    let surveyAvgConfig: any = {
        type: "bar",
        data: surveyAvgData,
        options: {
            animation: {
                duration: 0
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };

    let beforePrecentData = {
        labels: ["Group A", "Group B"],
        datasets: [
            {
                label: "All Groups",
                data: [aGroupBeforePercent, bGroupBeforePercent],
                backgroundColor: [
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 99, 132, 0.2)"
                ]
            }
        ]
    };

    let beforePercentConfig: any = {
        type: "bar",
        data: beforePrecentData,
        options: {
            animation: {
                duration: 0
            },
            labels: {
                display: false
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };

    let surveyAvgChart: HTMLCanvasElement;
    let beforePercentChart: HTMLCanvasElement;

    let ctx1: any;
    let chart1: any;

    let ctx2: any;
    let chart2: any;

    const refreshCharts = () => {
        // Refresh data
        aGroupSurveyAvg = calcAvgArr("A");
        bGroupSurveyAvg = calcAvgArr("B");

        aGroupBeforePercent = calcPercentBefore("A");
        bGroupBeforePercent = calcPercentBefore("B");

        surveyAvgData.datasets[0].data = aGroupSurveyAvg;
        surveyAvgData.datasets[1].data = bGroupSurveyAvg;

        beforePrecentData.datasets[0].data = [
            aGroupBeforePercent,
            bGroupBeforePercent
        ];

        // Recreate charts
        if (chart1) chart1.destroy();
        if (chart2) chart2.destroy();

        ctx1 = surveyAvgChart.getContext("2d");
        chart1 = new Chart(ctx1, surveyAvgConfig);

        ctx2 = beforePercentChart.getContext("2d");
        chart2 = new Chart(ctx2, beforePercentConfig);
    };

    onMount(async () => {
        // const { data, error } = await supabase.from("data").select("*");

        // if (error) {
        //     console.error(error);
        // } else {
        //     appData.push(...data.map(x => x.data));
        // }
        // appData = appData;

        ctx1 = surveyAvgChart.getContext("2d");
        chart1 = new Chart(ctx1, surveyAvgConfig);

        ctx2 = beforePercentChart.getContext("2d");
        chart2 = new Chart(ctx2, beforePercentConfig);
    });
</script>

<div class="h-screen w-screen flex p-4 gap-4 bg-slate-100">
    <aside class="rounded-md bg-white shadow-lg p-2">
        <h2 class="font-semibold text-lg">Leaderboard</h2>
        <ul>
            {#each sortedScores as { score, group }, i}
                <li>
                    <span>{i + 1}.</span>
                    <span>{score} ({group})</span>
                </li>
            {/each}
        </ul>
        <button
            class="bg-blue-500 text-white p-2 rounded-md mt-2"
            on:click={() => {
                appData.push({
                    group: "B",
                    answers: {
                        "1": ["purple", "green", "green", "green"],
                        "5": ["blue", "yellow", "blue", "yellow"],
                        "7": ["purple", "green", "blue", "yellow"]
                    },
                    survey: [1, 1, 1, 1, 1],
                    score: 55
                });
                appData = appData;
                console.log(appData);
                refreshCharts();
            }}>
            Refresh
        </button>
    </aside>
    <main class="flex-1 space-y-4 flex flex-col overflow-clip">
        <section
            class="p-4 bg-white shadow-lg rounded-md flex-1 h-1/2
        flex flex-col items-center justify-center">
            <h2 class="text-center text-lg font-semibold">Survey Averages</h2>
            <canvas bind:this={surveyAvgChart}></canvas>
        </section>
        <section
            class="p-4 bg-white shadow-lg rounded-md flex-1 h-1/2
        flex flex-col items-center justify-center">
            <h2 class="text-center text-lg font-semibold">
                Pre-Spin Percentages
            </h2>
            <canvas bind:this={beforePercentChart}></canvas>
        </section>
    </main>
</div>
