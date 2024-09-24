<script lang="ts">
    import Chart from "chart.js/auto";
    import { onMount } from "svelte";

    let n = 100;
    let f = 1;
    let eta_h = 0.1;
    let eta_v = 0.1;
    let reward = 10;

    let aData = Array.from({ length: n }, () => Math.random() * 100);
    let bData = Array.from({ length: n }, () => Math.random() * 100);

    let graphData = {
        labels: Array.from({ length: n }, (_, i) => i),
        datasets: [
            {
                label: "A",
                data: aData,
                borderColor: "red",
                fill: false,
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.5
            },
            {
                label: "B",
                data: bData,
                borderColor: "blue",
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
        aData = Array.from({ length: n }, () => Math.random() * 100);
        bData = Array.from({ length: n }, () => Math.random() * 100);

        config.data.datasets[0].data = aData;
        config.data.datasets[1].data = bData;

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
                    max="500"
                    step="10"
                    bind:value={n}
                    on:input={() => {
                        updateChart();
                    }}
                    class="range" />

                <span>500</span>
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
                <span>-100</span>
                <input
                    id="reward"
                    type="range"
                    min="-100"
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
