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


export { CheckSolution }