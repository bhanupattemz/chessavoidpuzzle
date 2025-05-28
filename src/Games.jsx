
const games = [
    {
        size: [2, 3],
        pieces: ["queen", "bishops"],
        notHave: [],
        solution: [
            { piece: "queen", n: [0, 0] },
            { piece: "bishops", n: [1, 2] }
        ]
    },
    {
        size: [2, 3],
        pieces: ["king", "rooks"],
        notHave: [[1, 0]],
        solution: [
            { piece: "king", n: [0, 0] },
            { piece: "rooks", n: [1, 2] }
        ]
    },
    {
        size: [2, 4],
        pieces: ["bishops", "knights", "rooks"],
        notHave: [[0, 2]],
        solution: [
            { piece: "bishops", n: [0, 0] },
            { piece: "knights", n: [0, 1] },
            { piece: "rooks", n: [1, 2] }
        ]
    },
    {
        size: [3, 2],
        pieces: ["king", "bishops", "knights"],
        notHave: [],
        solution: [
            { piece: "king", n: [0, 0] },
            { piece: "knights", n: [2, 0] },
            { piece: "bishops", n: [2, 1] }
        ]
    },
    {
        size: [3, 3],
        pieces: ["king", "bishops", "rooks"],
        notHave: [[0, 0], [2, 0]],
        solution: [
            { piece: "king", n: [0, 2] },
            { piece: "rooks", n: [1, 0] },
            { piece: "bishops", n: [2, 2] }
        ]
    },
    {
        size: [3, 3],
        pieces: ["king", "bishops", "knights", "knights"],
        notHave: [],
        solution: [
            { piece: "king", n: [0, 0] },
            { piece: "knights", n: [0, 2] },
            { piece: "bishops", n: [1, 2] },
            { piece: "knights", n: [2, 2] }
        ]
    },
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
            { piece: "bishops", n: [2, 0] },
            { piece: "bishops", n: [2, 1] },
            { piece: "bishops", n: [2, 2] },
            { piece: "knights", n: [2, 3] },
            { piece: "rooks", n: [1, 4] },
            { piece: "king", n: [0, 1] }
        ]
    },
    {
        size: [3, 4],
        pieces: ["king", "bishops", "knights", "rooks"],
        notHave: [],
        solution: [
            { piece: "king", n: [0, 0] },
            { piece: "bishops", n: [0, 2] },
            { piece: "knights", n: [0, 3] },
            { piece: "rooks", n: [2, 1] }
        ]
    },
    {
        size: [3, 4],
        pieces: ["king", "bishops", "knights", "rooks"],
        notHave: [[0, 0], [1, 0]],
        solution: [
            { piece: "king", n: [0, 1] },
            { piece: "knights", n: [0, 3] },
            { piece: "bishops", n: [1, 3] },
            { piece: "rooks", n: [2, 0] }
        ]
    },
    {
        size: [3, 4],
        pieces: ["king", "bishops", "knights", "knights", "knights"],
        notHave: [[0, 0], [1, 0]],
        solution: [
            { piece: "king", n: [0, 1] },
            { piece: "knights", n: [0, 3] },
            { piece: "bishops", n: [2, 0] },
            { piece: "knights", n: [2, 1] },
            { piece: "knights", n: [2, 3] }
        ]
    },
    {
        size: [3, 4],
        pieces: ["king", "queen", "bishops", "bishops"],
        notHave: [[0, 0], [0, 2], [1, 0]],
        solution: [
            { piece: "king", n: [0, 1] },
            { piece: "queen", n: [1, 3] },
            { piece: "bishops", n: [2, 0] },
            { piece: "bishops", n: [2, 1] }
        ]
    },
    {
        size: [3, 4],
        pieces: ["king", "bishops", "bishops", "bishops", "bishops"],
        notHave: [[0, 1], [0, 2]],
        solution: [
            { piece: "king", n: [0, 0] },
            { piece: "bishops", n: [0, 3] },
            { piece: "bishops", n: [1, 3] },
            { piece: "bishops", n: [2, 0] },
            { piece: "bishops", n: [2, 3] }
        ]
    },
    {
        size: [3, 4],
        pieces: ["king", "bishops", "bishops", "bishops", "knights"],
        notHave: [[0, 1], [0, 2]],
        solution: [
            { piece: "king", n: [0, 0] },
            { piece: "bishops", n: [0, 3] },
            { piece: "bishops", n: [1, 3] },
            { piece: "bishops", n: [2, 0] },
            { piece: "knights", n: [2, 3] }
        ]
    },
    {
        size: [3, 4],
        pieces: ["king", "king", "bishops", "bishops", "bishops"],
        notHave: [[0, 1], [0, 2]],
        solution: [
            { piece: "king", n: [0, 0] },
            { piece: "bishops", n: [0, 3] },
            { piece: "bishops", n: [1, 3] },
            { piece: "king", n: [2, 0] },
            { piece: "bishops", n: [2, 3] }
        ]
    },
    {
        size: [3, 5],
        pieces: ["queen", "bishops", "bishops", "rooks"],
        notHave: [[2, 3], [2, 4]],
        solution: [
            { piece: "queen", n: [0, 0] },
            { piece: "bishops", n: [1, 3] },
            { piece: "bishops", n: [1, 4] },
            { piece: "rooks", n: [2, 1] }
        ]
    },
    {
        size: [3, 5],
        pieces: ["queen", "bishops", "bishops", "knights", "knights"],
        notHave: [[1, 2], [1, 3]],
        solution: [
            { piece: "queen", n: [0, 0] },
            { piece: "knights", n: [1, 4] },
            { piece: "bishops", n: [2, 1] },
            { piece: "knights", n: [2, 3] },
            { piece: "bishops", n: [2, 4] }
        ]
    },
    {
        size: [3, 5],
        pieces: ["queen", "bishops", "knights", "rooks"],
        notHave: [[1, 0], [1, 1]],
        solution: [
            { piece: "queen", n: [0, 0] },
            { piece: "bishops", n: [1, 2] },
            { piece: "knights", n: [1, 3] },
            { piece: "rooks", n: [2, 4] }
        ]
    },
    {
        size: [3, 5],
        pieces: ["king", "queen", "knights", "knights", "knights"],
        notHave: [[0, 0]],
        solution: [
            { piece: "king", n: [0, 1] },
            { piece: "knights", n: [0, 3] },
            { piece: "knights", n: [0, 4] },
            { piece: "knights", n: [1, 4] },
            { piece: "queen", n: [2, 0] }
        ]
    },
    {
        size: [3, 5],
        pieces: [
            "king", "king", "bishops",
            "bishops", "knights", "knights",
            "knights", "knights"
        ],
        notHave: [[0, 1]],
        solution: [
            { piece: "knights", n: [0, 0] },
            { piece: "king", n: [0, 2] },
            { piece: "knights", n: [0, 4] },
            { piece: "bishops", n: [1, 0] },
            { piece: "bishops", n: [1, 4] },
            { piece: "knights", n: [2, 0] },
            { piece: "king", n: [2, 2] },
            { piece: "knights", n: [2, 4] }
        ]
    },
    {
        size: [4, 5],
        pieces: ["king", "queen", "bishops", "knights", "rooks"],
        notHave: [[1, 3], [1, 4], [2, 3]],
        solution: [
            { piece: "king", n: [0, 0] },
            { piece: "bishops", n: [0, 2] },
            { piece: "knights", n: [0, 4] },
            { piece: "queen", n: [2, 1] },
            { piece: "rooks", n: [3, 3] }
        ]
    },
    {
        size: [4, 5],
        pieces: ["king", "queen", "bishops", "knights", "rooks"],
        notHave: [[1, 3], [1, 4], [2, 2], [2, 3]],
        solution: [
            { piece: "king", n: [0, 0] },
            { piece: "bishops", n: [0, 2] },
            { piece: "knights", n: [0, 4] },
            { piece: "queen", n: [2, 1] },
            { piece: "rooks", n: [3, 3] }
        ]
    }
];

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