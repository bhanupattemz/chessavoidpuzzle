const games = [
    {
        size: [3, 4],
        pieces: ["bishops", "bishops", "bishops", "bishops", "queen"],
        notHave: [[0, 0]],
        solution: [
            { piece: "bishops", n: [0, 2] },
            { piece: "bishops", n: [0, 3] },
            { piece: "bishops", n: [2, 2] },
            { piece: "bishops", n: [2, 3] },
            { piece: "queen", n: [1, 0] }
        ]
    },
    {
        size: [3, 4],
        pieces: ["king", "king", "knights", "knights", "rooks"],
        notHave: [[0, 0]],
        solution: [
            { piece: "king", n: [0, 3] },
            { piece: "king", n: [2, 3] },
            { piece: "knights", n: [0, 1] },
            { piece: "knights", n: [2, 1] },
            { piece: "rooks", n: [1, 0] }
        ]
    },
    {
        size: [3, 5],
        pieces: ["bishops", "bishops", "bishops", "king", "knights", "rooks"],
        notHave: [[0, 0], [0, 3], [0, 4]],
        solution: [
            { piece: "bishops", n: [2,0] },
            { piece: "bishops", n: [2, 1] },
            { piece: "bishops", n: [2, 2] },
            { piece: "knights", n: [2, 3] },
            { piece: "rooks", n: [1, 4] },
            { piece: "king", n: [0,1] }
        ]
    }
]

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

const getGame = (level) => {
    if (level <= 0) {
        level = 1
    }
    if (level > games.length) {
        level = games.length
    }
    return games[level - 1]
}

const getnLevels = () => {
    return games.length
}

export { getGame, pieces, getnLevels }