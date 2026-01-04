// src/lib/minesweeper.ts

export type Cell = {
	row: number;
	col: number;
	isMine: boolean;
	isOpen: boolean;
	isFlagged: boolean;
	neighborCount: number;
};

export const DIRECTIONS = [
	[-1, -1], [-1, 0], [-1, 1],
	[0, -1],           [0, 1],
	[1, -1],  [1, 0],  [1, 1]
];

// 1. Create an EMPTY Board (No mines yet)
export function createGrid(rows: number, cols: number): Cell[][] {
	return Array.from({ length: rows }, (_, r) =>
		Array.from({ length: cols }, (_, c) => ({
			row: r,
			col: c,
			isMine: false,
			isOpen: false,
			isFlagged: false,
			neighborCount: 0
		}))
	);
}

// 2. Place Mines (Run this ON THE FIRST CLICK)
export function placeMines(grid: Cell[][], mines: number, firstClick: { r: number, c: number }) {
    const rows = grid.length;
    const cols = grid[0].length;
    let minesPlaced = 0;

    // Define the "Safe Zone" (The clicked cell + its 8 neighbors)
    const safeZone = new Set<string>();
    safeZone.add(`${firstClick.r},${firstClick.c}`);
    
    DIRECTIONS.forEach(([dr, dc]) => {
        const nr = firstClick.r + dr;
        const nc = firstClick.c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            safeZone.add(`${nr},${nc}`);
        }
    });

    // Randomly place mines
    while (minesPlaced < mines) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);

        if (grid[r][c].isMine || safeZone.has(`${r},${c}`)) continue;

        grid[r][c].isMine = true;
        minesPlaced++;
    }

    // Calculate Numbers
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c].isMine) continue;
            
            let count = 0;
            DIRECTIONS.forEach(([dr, dc]) => {
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc].isMine) {
                    count++;
                }
            });
            grid[r][c].neighborCount = count;
        }
    }
}

// 3. Recursive Reveal
export function revealCell(grid: Cell[][], r: number, c: number): { grid: Cell[][], gameOver: boolean, win: boolean } {
	const cell = grid[r][c];
	
	if (cell.isOpen || cell.isFlagged) return { grid, gameOver: false, win: false };
	
	if (cell.isMine) {
		cell.isOpen = true;
		return { grid, gameOver: true, win: false };
	}

	cell.isOpen = true;

	if (cell.neighborCount === 0) {
		DIRECTIONS.forEach(([dr, dc]) => {
			const nr = r + dr, nc = c + dc;
			if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length) {
				revealCell(grid, nr, nc);
			}
		});
	}

	return { grid, gameOver: false, win: false };
}
