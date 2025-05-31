import { useState, useEffect } from "react"
import "./Generate.css"
import { GenerateSolution } from "./Solution"

import { MdCancel } from "react-icons/md";
export default function Generate() {
    const [formData, setFormData] = useState({
        king: 0,
        queen: 0,
        rooks: 0,
        bishops: 0,
        knights: 0
    })
    const currentGame = localStorage.getItem("game")
    const [noSolution, setNoSolution] = useState(false)
    const screenWidth = window.screen.width
    const [size, setSize] = useState([3, 3])
    const [selectionGrid, setSelectionGrid] = useState([])
    let [game, setgame] = useState({
        size: [0, 0],
        pieces: [],
        notHave: [],
        solution: [

        ]
    })

    useEffect(() => {
        let temp = []
        for (let i = 0; i < size[0]; i += 1) {
            let row = []
            for (let j = 0; j < size[1]; j += 1) {
                let isPresent = true
                row.push({
                    num: i * size[1] + j,
                    isPresent,
                    piece: null,
                    blocked: 0
                })
            }
            temp.push(row)
        }
        setSelectionGrid(temp)
    }, [size])
    return (
        <main className="generate-puzzle-main">
            {noSolution && <div className='popup-container'>
                <div className='close-btn'>
                    <span onClick={() => setNoSolution(false)}><MdCancel /></span>
                </div>
                <h2>No Solution</h2>
            </div>}
            {currentGame && <div>
                <a href="/puzzle/own">Play previous generated puzzle</a>
            </div>}
            <form style={{
                minWidth: "70%"
            }}
                onSubmit={(e) => {
                    e.preventDefault();
                    let tempGame = JSON.parse(JSON.stringify(game))
                    tempGame.size = size
                    let pieces = ["king", "queen", "bishops", "knights", "rooks"]
                    for (let piece of pieces) {
                        for (let i = 0; i < formData[piece]; i += 1) {
                            tempGame.pieces.push(piece)
                        }
                    }
                    let tempGrid = JSON.parse(JSON.stringify(selectionGrid))
                    let piecesData = JSON.parse(JSON.stringify(tempGame.pieces))
                    if (piecesData < 2) {
                        alert("Select more than two pieces")
                        return
                    }
                    if (GenerateSolution(tempGrid, piecesData)) {
                        for (let i = 0; i < size[0]; i += 1) {
                            for (let j = 0; j < size[1]; j += 1) {
                                if (tempGrid[i][j].isPresent) {
                                    if (tempGrid[i][j].piece) {
                                        tempGame.solution.push({ piece: tempGrid[i][j].piece, n: [i, j] })
                                    }
                                } else {
                                    tempGame.notHave.push([i, j])
                                }
                            }
                        }
                        // let games = JSON.parse(window.localStorage.getItem("game") || "[]")
                        // games.push(tempGame)
                        window.localStorage.setItem("game", JSON.stringify(tempGame))
                        window.location.href = '/puzzle/own'
                        console.log("success")
                    } else {
                        setNoSolution(true)
                    }

                }}>
                <div className="form-container">
                    <div className="generate-pieces-container">
                        <div>
                            <img src="/king.png" alt="king-img" />
                            <h2>King</h2>
                            <input type="number" min={0} max={10} value={formData.king} name="king" id="king" onChange={(e) => setFormData(prev => ({ ...prev, king: e.target.value }))} />
                        </div>
                        <div>
                            <img src="/queen.png" alt="queen-img" />
                            <h2>Queen</h2>
                            <input type="number" min={0} max={10} value={formData.queen} name="queen" id="queen" onChange={(e) => setFormData(prev => ({ ...prev, queen: e.target.value }))} />
                        </div>
                        <div>
                            <img src="/rooks.png" alt="rooks-img" />
                            <h2>rooks</h2>
                            <input type="number" min={0} max={10} value={formData.rooks} name="rooks" id="rooks" onChange={(e) => setFormData(prev => ({ ...prev, rooks: e.target.value }))} />
                        </div>
                        <div>
                            <img src="/bishops.png" alt="bishops-img" />
                            <h2>bishops</h2>
                            <input type="number" min={0} max={10} value={formData.bishops} name="bishops" id="bishops" onChange={(e) => setFormData(prev => ({ ...prev, bishops: e.target.value }))} />
                        </div>
                        <div>
                            <img src="/knights.png" alt="knights-img" />
                            <h2>knights</h2>
                            <input type="number" min={0} max={10} value={formData.knights} name="knights" id="knights" onChange={(e) => setFormData(prev => ({ ...prev, knights: e.target.value }))} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="grid-size">Grid Size :
                            <input type="number" min={2} max={10} value={size[0]} onChange={(e) => setSize(prev => ([parseInt(e.target.value), prev[1]]))} />X
                            <input type="number" min={2} max={10} value={size[1]} onChange={(e) => setSize(prev => ([prev[0], parseInt(e.target.value)]))} />
                        </label>
                    </div>
                    <p>Click a cell to remove it. Click again to restore it to the grid.</p>
                    <div className="grid-scroll-container">
                        <div className='grid-container' style={{
                            gridTemplateRows: `repeat(${size[0]}, ${screenWidth < 600 ? 50 : 100}px)`,
                            gridTemplateColumns: `repeat(${size[1]}, ${screenWidth < 600 ? 50 : 100}px)`,
                            gap: `${screenWidth < 600 ? 5 : 8}px`,
                            padding: `${screenWidth < 600 ? 10 : 15}px`,

                        }}>
                            {selectionGrid.map((row, inx) => {
                                return (row.map((item, ind) => {
                                    return (
                                        <div key={item.num} className='grid-cell' onClick={() => {
                                            let tempGrid = JSON.parse(JSON.stringify(selectionGrid))
                                            tempGrid[inx][ind].isPresent = !tempGrid[inx][ind].isPresent
                                            setSelectionGrid(tempGrid)
                                        }}>
                                            {item.isPresent &&
                                                <div
                                                    style={{ backgroundColor: `white` }}
                                                >
                                                </div>}
                                        </div>
                                    )
                                }))
                            })}
                        </div>
                    </div>
                    <button>Generate</button>

                </div>
            </form>

        </main>
    )
}