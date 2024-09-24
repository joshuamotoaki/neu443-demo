# NEU443 Demo

A little web demo for a class presentation in NEU443: Computational Psychiatry (Fall 2024 Princeton University) on _Eldar, E., & Niv, Y. (2015). Interaction between emotional state and learning underlies mood instability. Nature communications, 6(1), 1-10_. There are 3 parts (routes):

-   The game (/) -- a modified version of the study conducted in the paper. Just for fun, not scientific.
-   The stats page (/stats) -- a leaderboard of results and a few graphs based on the game results.
-   The interactive model (/model) -- a graph of the RL model presented in the paper with configurable parameters.

The graphs in the stats page update in realtime with Supabase. The app is not currently deployed, but if you want to try it out, create a Supabase project with 1 table with an id and a jsonb column called "data". Disable RLS and enable Realtime. Add the URL and Public Anon Key to [`supabase.ts`](./src/lib/supabase.ts).

Built with Svelte/SvelteKit, TailwindCSS, DaisyUI, and Supabase.
