const pieces = {
    king: {
        moves: [
            [0, 1], [0, -1], [1, 0], [-1, 0],
            [-1, -1], [-1, 1], [1, 1], [1, -1]
        ],
        num: 1
    },
    queen: {
        moves: [
            [0, 1], [0, -1], [1, 0], [-1, 0],
            [-1, -1], [-1, 1], [1, 1], [1, -1]
        ],
        num: 64
    },
    rooks: {
        moves: [
            [0, 1], [0, -1], [1, 0], [-1, 0]
        ],
        num: 64
    },
    bishops: {
        moves: [
            [-1, -1], [-1, 1], [1, 1], [1, -1]
        ],
        num: 64
    },
    knights: {
        moves: [
            [2, 1], [1, 2], [-1, 2], [-2, 1],
            [-2, -1], [-1, -2], [1, -2], [2, -1]
        ],
        num: 1
    }
}
const CheckSolution = (grid, rows, cols) => {

    if (!grid || grid.length != rows || grid[0].length != cols) {
        return [true, [-1. - 1]]
    }
    for (let i = 0; i < rows; i += 1) {
        for (let j = 0; j < cols; j += 1) {
            const currentPiece = grid[i][j].piece;
            if (currentPiece) {
                const { moves, num } = pieces[currentPiece];

                for (let move of moves) {
                    let n1 = i;
                    let n2 = j;

                    for (let step = 1; step <= num; step++) {
                        n1 += move[0];
                        n2 += move[1];
                        if (n1 < 0 || n1 >= rows || n2 < 0 || n2 >= cols) break;
                        if (grid[n1][n2].piece) {
                            return [false, [n1, n2]];
                        }
                        if (num === 1) break;
                    }
                }
            }
        }
    }
    return [true, [-1, -1]];
};

const GenerateSolution = (grid, piecesData) => {
    if (piecesData.length === 0) return true;

    let rows = grid.length;
    let cols = grid[0].length;

    for (let i = 0; i < piecesData.length; i++) {
        const { moves, num } = pieces[piecesData[i]];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (grid[row][col].piece || !grid[row][col].isPresent || grid[row][col].blocked > 0) continue;

                let canPlace = true;
                let attacked = [];

                for (let [dx, dy] of moves) {
                    let x = row;
                    let y = col;
                    for (let step = 1; step <= num; step++) {
                        x += dx;
                        y += dy;
                        if (x < 0 || x >= rows || y < 0 || y >= cols) break;
                        if (grid[x][y].piece) {
                            canPlace = false;
                            break;
                        }
                        attacked.push([x, y]);
                        if (num === 1) break;
                    }
                    if (!canPlace) break;
                }

                if (canPlace) {
                    grid[row][col].piece = piecesData[i];
                    for (let [x, y] of attacked) {
                        grid[x][y].blocked += 1;

                    }
                    const nextPieces = piecesData.filter((_, idx) => idx !== i);
                    if (GenerateSolution(grid, nextPieces)) return true;

                    grid[row][col].piece = null;
                    for (let [x, y] of attacked) {
                        grid[x][y].blocked -= 1;
                    }
                }
            }
        }
    }

    return false;
};


export { CheckSolution, GenerateSolution }