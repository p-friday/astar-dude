<script lang="ts">
  import { onMount } from "svelte";
  import Cell from "./lib/Cell.svelte";
  import { astar, type Gnode } from "./astar";

  let gridWidth = 20;
  let gridHeight = 20;

  let grid: Gnode[][] = Array.from({ length: gridHeight }, (_, y) =>
    Array.from({ length: gridWidth }, (_, x) => ({
      x,
      y,
      weight: 1,
      gScore: x === 0 && y === 0 ? 0 : Infinity,
      hScore: Math.abs(x - (gridWidth - 1)) + Math.abs(y - (gridHeight - 1)),
      fScore: Infinity,
      cameFrom: null,
    }))
  );

  let start = grid[0][0];
  let end = grid[gridHeight - 1][gridWidth - 1];
  let path: Gnode[] | null = [];

  function findPath() {
    path = astar(grid, start, end);
  }
</script>

<button on:click={findPath}>Find Path</button>
<div class="grid" style="--grid-width: {gridWidth}">
  {#each grid as row, y}
    <div class="row">
      {#each row as cell, x}
        <Cell {cell} {path} />
      {/each}
    </div>
  {/each}
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(var(--grid-width), 1fr);
  }
  .row {
    display: contents;
  }
</style>
