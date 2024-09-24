<script lang="ts">
    import Chart from "chart.js/auto";
    import { onMount } from "svelte";

    let n = 100;

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
                tension: 0.8
            },
            {
                label: "B",
                data: bData,
                borderColor: "blue",
                fill: false,
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.8
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
        config.data.datasets[0].data = aData;
        config.data.datasets[1].data = bData;
        graph = new Chart(ctx, config);
    }
</script>

<div class="mx-auto w-11/12 pt-4">
    <h1 class="text-center text-3xl">Interactive Model</h1>
    <canvas bind:this={graphCanvas} id="myGraph"></canvas>

    <button
        on:click={() => {
            aData = Array.from({ length: n }, () => Math.random() * 100);
            bData = Array.from({ length: n }, () => Math.random() * 100);
            updateChart();
        }}>
        Click
    </button>
</div>
