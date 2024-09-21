<script>
    import BlueButton from "$lib/components/buttons/BlueButton.svelte";
    import GreenButton from "$lib/components/buttons/GreenButton.svelte";
    import OrangeButton from "$lib/components/buttons/OrangeButton.svelte";
    import PurpleButton from "$lib/components/buttons/PurpleButton.svelte";
    import Top from "$lib/components/Top.svelte";

    let round = 0;
</script>

<div class="h-screen flex flex-col">
    <Top />
    <main class="flex-1">
        <div class="text-5xl text-center">
            <h2>Select a button</h2>
        </div>
        <div class="h-1/2 w-full flex gap-16 p-16">
            <BlueButton />
            <OrangeButton />
            <PurpleButton />
            <GreenButton />
        </div>
    </main>
    <footer class="w-full h-16 bg-base-300"></footer>
</div>
