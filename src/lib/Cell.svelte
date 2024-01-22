<script lang="ts">
  import type { Gnode } from "../astar";
  import { isMouseDown, shouldWall } from "../stores";

  export let cell: Gnode;
  export let path: Gnode[] | null;
  export let openSet: Gnode[];
  export let closedSet: Gnode[];
  export let start: Gnode;
  export let end: Gnode;

  let isPath = false;
  let animationDelay = 0;
  let isDragging: boolean;
  let placingWalls: boolean;

  isMouseDown.subscribe((value) => {
    isDragging = value;
  });

  shouldWall.subscribe((value) => {
    placingWalls = value;
  });

  $: if (path?.includes(cell)) {
    isPath = true;
    animationDelay = path.indexOf(cell) * 0.05;
  }

  function toggleWall() {
    if (isDragging) {
      if (placingWalls) {
        cell.weight = 0;
      } else {
        cell.weight = 1;
      }
    }
    //cell.weight = cell.weight === 0 ? 1 : 0;
  }

  function handleMouseDown() {
    isMouseDown.set(true);
    shouldWall.set(cell.weight === 1);
    toggleWall();
  }

  function handleMouseEnter() {
    toggleWall();
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="cell {Array.isArray(path) && path.includes(cell)
    ? 'path'
    : ''} {cell.weight === 0 ? 'wall' : ''} {openSet.includes(cell)
    ? 'open'
    : ''} {closedSet.includes(cell) ? 'closed' : ''} {cell === start
    ? 'start'
    : ''} {cell === end ? 'end' : ''}"
  style="animation-delay: {animationDelay}s"
  on:mousedown={handleMouseDown}
  on:mouseenter={handleMouseEnter}
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
    animation: path 1s forwards;
  }
  @keyframes path {
    to {
      background-color: #0f0;
    }
  }
  .cell.wall {
    background-color: #000;
  }
  .cell.open {
    background-color: #00f;
  }
  .cell.closed {
    background-color: #f00;
  }
  .cell.start {
    background-color: #0ff;
  }
  .cell.end {
    background-color: #ff0;
  }
</style>
