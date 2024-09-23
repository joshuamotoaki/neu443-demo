<script lang="ts">
    import { supabase } from "$lib/supabase";
    import { onMount } from "svelte";

    type DataEntry = {
        group: "A" | "B";
        answers: Record<number, string[]>;
        survey: number[];
        score: number;
    };

    let appData: DataEntry[] = [];

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

    onMount(async () => {
        const { data, error } = await supabase.from("data").select("*");

        if (error) {
            console.error(error);
        } else {
            appData.push(...data.map(x => x.data));
        }
        appData = appData;
    });

    $: console.log(appData);
</script>

<div>
    {#each appData as entry}
        <div>
            <h2>{entry.group}</h2>
            <p>Score: {entry.score}</p>
            <p>Survey: {entry.survey.join(", ")}</p>
            <p>Answers: {JSON.stringify(entry.answers)}</p>
        </div>
    {/each}
</div>
