<script lang="ts">
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
