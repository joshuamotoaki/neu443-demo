<script>
    import { onMount } from "svelte";

    let isSpinning = false;
    let result = null;
    let rotation = 0;

    // Start spinning when the component is mounted
    const startSpin = () => {
        isSpinning = true;
        result = null;

        const finalRotation = Math.random() * 360 + 1440; // Ensures at least 4 full spins (360 * 4)
        const duration = 5; // spin for 5 seconds
        const easeOutCubic = t => --t * t * t + 1;

        let startTime;

        const spin = timestamp => {
            if (!startTime) startTime = timestamp;
            const elapsed = (timestamp - startTime) / 1000;

            if (elapsed < duration) {
                // Ease out cubic effect
                rotation = finalRotation * easeOutCubic(elapsed / duration);
                requestAnimationFrame(spin);
            } else {
                // Spin complete
                rotation = finalRotation % 360;
                isSpinning = false;
                // Determine result
                result = determineResult(rotation);
            }
        };

        requestAnimationFrame(spin);
    };

    // Determine which part of the wheel the spinner lands on
    const determineResult = rotation => {
        const normalizedRotation = rotation % 360;
        if (normalizedRotation >= 0 && normalizedRotation < 90) return "+$7";
        if (normalizedRotation >= 90 && normalizedRotation < 180) return "-$7";
        if (normalizedRotation >= 180 && normalizedRotation < 270) return "+$7";
        return "-$7";
    };

    onMount(() => {
        startSpin(); // Start the spin as soon as the component mounts
    });
</script>

<div class="flex flex-col items-center">
    <div class="spin-wheel" style="transform: rotate({rotation}deg);">
        <div class="spin-wheel__part">+$7</div>
        <div class="spin-wheel__part">-$7</div>
        <div class="spin-wheel__part">+$7</div>
        <div class="spin-wheel__part">-$7</div>
    </div>

    {#if !isSpinning && result}
        <p class="mt-4 text-xl font-semibold">You landed on: {result}</p>
    {/if}
</div>

<style>
    .spin-wheel {
        border-radius: 50%;
        width: 200px;
        height: 200px;
        position: relative;
        border: 4px solid #ddd;
        overflow: hidden;
        transform-origin: center center;
    }

    .spin-wheel__part {
        position: absolute;
        width: 50%;
        height: 50%;
        background-color: #f3f4f6;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.5rem;
        font-weight: bold;
        color: #333;
    }

    .spin-wheel__part:nth-child(1) {
        top: 0;
        left: 0;
        transform: rotate(0deg) translateX(50%);
        background-color: #38bdf8;
    }

    .spin-wheel__part:nth-child(2) {
        top: 0;
        left: 50%;
        transform: rotate(90deg) translateX(50%);
        background-color: #f87171;
    }

    .spin-wheel__part:nth-child(3) {
        top: 50%;
        left: 0;
        transform: rotate(180deg) translateX(50%);
        background-color: #38bdf8;
    }

    .spin-wheel__part:nth-child(4) {
        top: 50%;
        left: 50%;
        transform: rotate(270deg) translateX(50%);
        background-color: #f87171;
    }
</style>
