<script lang="ts">
  import type { Gnode } from "../astar";

  export let cell: Gnode;
  export let path: Gnode[] | null;

  function toggleWall() {
    cell.weight = cell.weight === 1 ? 0 : 1;
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="cell {Array.isArray(path) && path.includes(cell)
    ? 'path'
    : ''} {cell.weight === 0 ? 'wall' : ''}"
  on:click={toggleWall}
>
  <!-- cell content here -->
</div>

<style>
  .cell {
    width: 20px;
    height: 20px;
    background-color: white;
    border: 1px solid black;
  }
  .cell.path {
    background-color: #0f0;
  }
  .cell.wall {
    background-color: #000;
  }
</style>
