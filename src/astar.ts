export type Gnode = {
	x: number;
	y: number;
	weight: number;
	gScore: number;
	hScore: number;
	fScore: number;
	cameFrom: Gnode | null;
}

function heuristic(a: Gnode, b: Gnode): number {
	return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function* astar(grid: Gnode[][], start: Gnode, end: Gnode) {
	console.log('astar');
	const openSet: Gnode[] = [start];
	//const closedSet: boolean[][] = Array(grid.length).fill(false).map(() => Array(grid[0].length).fill(false));
	const closedSet: Gnode[] = [];

	while(openSet.length > 0) {
		openSet.sort((a, b) => a.fScore - b.fScore);
		const current = openSet.shift()!;

		if(current === end) {
			const path: Gnode[] = [];
			let temp = current.cameFrom!;
			while(temp.cameFrom) {
				path.push(temp);
				temp = temp.cameFrom;
			}
			yield { openSet: openSet, closedSet: closedSet, path: path };
			return;
		}

		//closedSet[current.y][current.x] = true;
		closedSet.push(current);

		const neighbors = getNeighbors(grid, current);

		for (const neighbor of neighbors) {
			//if(closedSet[neighbor.y][neighbor.x]) continue;
			if(closedSet.includes(neighbor)) continue;
			const tentativeGScore = current.gScore + d(current, neighbor);
			if(tentativeGScore < neighbor.gScore) {
				neighbor.cameFrom = current;
				neighbor.gScore = tentativeGScore;
				neighbor.hScore = heuristic(neighbor, end);
				neighbor.fScore = neighbor.gScore + neighbor.hScore;

				if(!openSet.includes(neighbor)) {
					openSet.push(neighbor);
				}
			}
		}
		yield { openSet: [...openSet], closedSet: closedSet };
	}

	return null;
}

function getNeighbors(grid: Gnode[][], node: Gnode): Gnode[] {
	const neighbors: Gnode[] = [];
	for(const neighbor of [
		grid[node.y - 1]?.[node.x],
		grid[node.y + 1]?.[node.x],
		grid[node.y]?.[node.x - 1],
		grid[node.y]?.[node.x + 1],
		grid[node.y - 1]?.[node.x - 1],
		grid[node.y - 1]?.[node.x + 1],
		grid[node.y + 1]?.[node.x - 1],
		grid[node.y + 1]?.[node.x + 1]
	]) {
		if(neighbor && neighbor.weight !== 0) neighbors.push(neighbor);
	}
	return neighbors;
}

function d(a: Gnode, b: Gnode): number {
	return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}