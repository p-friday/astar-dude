<script lang="ts">
  import Cell from "./lib/Cell.svelte";
  import { astar, type Gnode } from "./astar";
  import { isMouseDown } from "./stores";

  let w;
  let h;
  let size = 20;
  let text = "edit this text";

  let height: number;
  let width: number;

  let innerHeight = 400;
  let innerWidth = 400;

  // let gridWidth = 20;
  // let gridHeight = 20;

  let gridWidth = 40;
  let gridHeight = 25;

  let grid = Array.from({ length: gridHeight }, (_, y) =>
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
  let openSet: Gnode[] = [];
  let closedSet: Gnode[] = [];
  let result: Gnode[] | null = null;
  let isDragging: boolean;

  isMouseDown.subscribe((value) => {
    isDragging = value;
  });

  async function findPath() {
    const generator = astar(grid, start, end);

    for await (const {
      openSet: newOpenSet,
      closedSet: newClosedSet,
      path: newPath,
    } of generator) {
      openSet = newOpenSet;
      closedSet = newClosedSet;

      if (newPath) {
        result = newPath;
      }

      await new Promise((resolve) => setTimeout(resolve, 40));
    }

    if (result) {
      path = result.reverse();
    }
  }

  function resetGrid() {
    grid = Array.from({ length: gridHeight }, (_, y) =>
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

    start = grid[0][0];
    end = grid[gridHeight - 1][gridWidth - 1];
    path = [];
    openSet = [];
    closedSet = [];
    result = null;
  }

  function resetPath() {
    grid.forEach((row) => {
      row.forEach((cell) => {
        cell.gScore = cell.x === 0 && cell.y === 0 ? 0 : Infinity;
        cell.fScore = Infinity;
        cell.cameFrom = null;
      });
    });
    path = [];
    openSet = [];
    closedSet = [];
    result = null;
  }

  function clearWalls() {
    if (result) {
      resetGrid();
    } else {
      grid = Array.from({ length: gridHeight }, (_, y) =>
        Array.from({ length: gridWidth }, (_, x) => ({
          x,
          y,
          weight: 1,
          gScore: x === 0 && y === 0 ? 0 : Infinity,
          hScore:
            Math.abs(x - (gridWidth - 1)) + Math.abs(y - (gridHeight - 1)),
          fScore: Infinity,
          cameFrom: null,
        }))
      );

      start = grid[0][0];
      end = grid[gridHeight - 1][gridWidth - 1];
    }
  }
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<main class="flex flex-col">
  <div>{innerWidth} x {innerHeight}</div>
  <div class="nav">
    <button on:click={findPath}>Find Path</button>
    <button on:click={clearWalls}>Clear</button>
    <button on:click={resetPath}>Reset Path</button>
  </div>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="grid"
    style="--grid-width: {gridWidth}"
    on:mouseup={() => isMouseDown.set(false)}
    bind:clientWidth={width}
    bind:clientHeight={height}
  >
    {#each grid as row, y}
      <div class="row">
        {#each row as cell, x}
          <Cell {cell} {path} {openSet} {closedSet} {start} {end} />
        {/each}
      </div>
    {/each}
  </div>
</main>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(var(--grid-width), 1fr);
  }
  .row {
    display: contents;
  }
</style>
