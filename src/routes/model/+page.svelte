<script lang="ts">
    import Chart from "chart.js/auto";
    import { onMount } from "svelte";

    let n = 250;
    let f = 1.2;
    let eta_h = 0.1;
    let eta_v = 0.1;
    let reward = 10;

    let mood: number[] = [];
    let expectedValue: number[] = [];
    let predictionError: number[] = [];
    let perceivedReward: number[] = [];

    const createCharts = () => {
        const rArr = Array(n).fill(reward);
        const rP = Array(n).fill(0);
        const h = Array(n + 1).fill(0);
        const v = Array(n + 1).fill(0);
        const pe = Array(n).fill(0);
        const m = Array(n + 1).fill(0);

        for (let i = 0; i < n; i++) {
            rP[i] = rArr[i] * Math.pow(f, m[i]);
            pe[i] = rP[i] - v[i];
            h[i + 1] = h[i] + eta_h * (pe[i] - h[i]);
            m[i + 1] = Math.tanh(h[i]);
            v[i + 1] = v[i] + eta_v * pe[i];
        }

        mood = m;
        expectedValue = v;
        predictionError = pe;
        perceivedReward = rP;
    };

    createCharts();

    let graphData = {
        labels: Array.from({ length: n }, (_, i) => i),
        datasets: [
            {
                label: "Mood",
                data: mood,
                borderColor: "red",
                fill: false,
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.5
            },
            {
                label: "Expected Value",
                data: expectedValue,
                borderColor: "blue",
                fill: false,
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.5
            },
            {
                label: "Prediction Error",
                data: predictionError,
                borderColor: "green",
                fill: false,
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.5
            },
            {
                label: "Perceived Reward",
                data: perceivedReward,
                borderColor: "purple",
                fill: false,
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.5
            }
        ]
    };

    let config: any = {
        type: "line",
        data: graphData,
        options: {
            animation: {
                duration: 0
            },
            responsive: true,
            plugins: {
                legend: {
                    position: "top"
                },
                title: {
                    display: true,
                    text: "RL Model (Eldar & Niv 2015)"
                }
            }
        }
    };

    let graphCanvas: HTMLCanvasElement;
    let ctx: any;
    let graph: any;

    onMount(() => {
        ctx = graphCanvas.getContext("2d")!;
        graph = new Chart(ctx, config);
    });

    function updateChart() {
        // Destroy the old chart
        if (graph) {
            graph.destroy();
        }

        // Create a new chart
        createCharts();

        graphData.datasets[0].data = mood;
        graphData.datasets[1].data = expectedValue;
        graphData.datasets[2].data = predictionError;
        graphData.datasets[3].data = perceivedReward;

        graphData.labels = Array.from({ length: n }, (_, i) => i);

        graph = new Chart(ctx, config);
    }
</script>

<div class="mx-auto w-11/12 py-4">
    <h1 class="text-center text-3xl">Interactive Model</h1>
    <div class="w-full flex justify-center">
        <canvas bind:this={graphCanvas} id="myGraph"></canvas>
    </div>

    <section class="space-y-2 mt-8 max-w-5xl mx-auto">
        <div class="space-y-1">
            <label for="trials">Trials ({n})</label>
            <div class="slider">
                <span>0</span>
                <input
                    id="trials"
                    type="range"
                    min="0"
                    max="2000"
                    step="10"
                    bind:value={n}
                    on:input={() => {
                        updateChart();
                    }}
                    class="range" />

                <span>1000</span>
            </div>
        </div>
        <div class="space-y-1">
            <label for="f">f ({f})</label>
            <div class="slider">
                <span>0</span>
                <input
                    id="f"
                    type="range"
                    min="0"
                    max="3"
                    step="0.1"
                    bind:value={f}
                    on:input={() => {
                        updateChart();
                    }}
                    class="range" />

                <span>3</span>
            </div>
        </div>
        <div class="space-y-1">
            <label for="eta_h">eta_h ({eta_h})</label>
            <div class="slider">
                <span>0</span>
                <input
                    id="eta_h"
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    bind:value={eta_h}
                    on:input={() => {
                        updateChart();
                    }}
                    class="range" />

                <span>1</span>
            </div>
        </div>
        <div class="space-y-1">
            <label for="eta_v"> eta_v ({eta_v})</label>
            <div class="slider">
                <span>0</span>
                <input
                    id="eta_v"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    bind:value={eta_v}
                    on:input={() => {
                        updateChart();
                    }}
                    class="range" />

                <span>1</span>
            </div>
        </div>
        <div class="space-y-1">
            <label for="reward">Reward ({reward})</label>
            <div class="slider">
                <span>0</span>
                <input
                    id="reward"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    bind:value={reward}
                    on:input={() => {
                        updateChart();
                    }}
                    class="range" />

                <span>100</span>
            </div>
        </div>
    </section>
</div>

<style lang="postcss">
    .slider {
        @apply flex items-center gap-4;
    }
</style>
