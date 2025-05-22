import { useState, useCallback } from 'react'
import './App.css'
import { useEffect } from 'react'
import { CheckSolution } from "./Solution"

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

function App() {
  let [grid, setGrid] = useState([])
  let [game, setgame] = useState({
    size: [3, 4],
    pieces: ["king","king","knights","knights","rooks"]
  })
  const [loss, setLoss] = useState(false)
  const [win, setWin] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [curr, setCurr] = useState(null)
  const [index, setIndex] = useState(null)
  const [isFromDropZone, setIsFromDropZone] = useState(false)

  const handleTouchMove = useCallback((e) => {

  }, [])

  const handleTouchEnd = useCallback((e) => {
    setIsDragging(false)
  }, [])

  const handleDragStart = useCallback((e, index, isFromDropZone = false) => {
    setIndex(index)
    setIsFromDropZone(isFromDropZone)
    setIsDragging(true);
  }, []);

  const handleDrop = useCallback((e, row, col) => {
    e.preventDefault();
    e.stopPropagation();
    setCurr(null)
    const dragIndex = index
    if (!isFromDropZone) {
      const dragIndex = index;
      if (dragIndex == null || dragIndex >= game.pieces.length) return;

      const pieceToAdd = game.pieces[dragIndex];
      if (!pieceToAdd) return;

      const newGrid = JSON.parse(JSON.stringify(grid));
      const pieceToReplace = newGrid[row][col].piece;
      newGrid[row][col].piece = pieceToAdd;
      setGrid(newGrid);

      const updatedPieces = [...game.pieces];
      updatedPieces.splice(dragIndex, 1);
      if (pieceToReplace) updatedPieces.push(pieceToReplace);
      setgame(prev => ({ ...prev, pieces: updatedPieces }));
    }
    else {
      let row1 = Math.floor(dragIndex / game.size[1]);
      let col1 = dragIndex % game.size[1];
      const newGrid = JSON.parse(JSON.stringify(grid));
      let tempPiece = null
      if (newGrid[row][col].piece) {
        tempPiece = newGrid[row][col].piece
      }
      newGrid[row][col].piece = newGrid[row1][col1].piece;
      newGrid[row1][col1].piece = tempPiece
      setGrid(newGrid);
    }

    setIsDragging(false);
  }, [grid, game, index, isFromDropZone]);

  useEffect(() => {
    let temp = []
    for (let i = 0; i < game.size[0]; i += 1) {
      let row = []
      for (let j = 0; j < game.size[1]; j += 1) {
        row.push({
          num: i * game.size[1] + j,
          isPresent: (i === 0 && j === 0) ? false : true,
          piece: null,
          backgroundColor: "white"
        })
      }
      temp.push(row)
    }
    setGrid(temp)
  }, [game.size])

  useEffect(() => {
    const handleDocumentTouchMove = (e) => {
      if (isDragging) {
        e.preventDefault();
        handleTouchMove(e);
      }
    };

    const handleDocumentTouchEnd = (e) => {
      if (isDragging) {
        handleTouchEnd(e);
      }
    };
    document.addEventListener('touchmove', handleDocumentTouchMove, { passive: false });
    document.addEventListener('touchend', handleDocumentTouchEnd, { passive: false });

    return () => {
      document.removeEventListener('touchmove', handleDocumentTouchMove);
      document.removeEventListener('touchend', handleDocumentTouchEnd);
    };
  }, [isDragging, handleTouchMove, handleTouchEnd]);

  useEffect(() => {
    if (grid.length > 0) {
      if (CheckSolution(grid, game.size[0], game.size[1])) {
        setLoss(false)
        if (game.pieces.length === 0) {
          setWin(true)
        }
      } else {
        setLoss(true)
        setWin(false)
      }
    }
  }, [grid, game.pieces])

  useEffect(() => {
    let rows = game.size[0]
    let cols = game.size[1]
    if (!grid || grid.length !== rows || (grid[0] && grid[0].length !== cols)) {
      return
    }
    let tempGrid = JSON.parse(JSON.stringify(grid))
    for (let i = 0; i < game.size[0]; i += 1) {
      for (let j = 0; j < game.size[1]; j += 1) {
        tempGrid[i][j].backgroundColor = "white"
      }
    }
    if (curr && curr.piece && typeof curr.row === 'number' && typeof curr.col === 'number') {
      const pieceConfig = pieces[curr.piece];
      if (pieceConfig) {
        const { moves, num } = pieceConfig;
        for (let move of moves) {
          let n1 = curr.row;
          let n2 = curr.col;
          for (let step = 1; step <= num; step++) {
            n1 += move[0];
            n2 += move[1];
            if (n1 < 0 || n1 >= rows || n2 < 0 || n2 >= cols) break;
            if (tempGrid[n1] && tempGrid[n1][n2] && tempGrid[n1][n2].isPresent) {
              tempGrid[n1][n2].backgroundColor = "brown";
            }
            if (num === 1) break;
          }
        }
      }
    }

    setGrid(tempGrid)
  }, [curr, game.size])

  return (
    <>
      <main>
        {win && <div>Win</div>}
        {loss && <div>Loss</div>}
        <div className='grid-container' style={{ gridTemplateRows: `repeat(${game.size[0]}, 50px)`, gridTemplateColumns: `repeat(${game.size[1]}, 50px)`, width: `${game.size[1] * 50 + game.size[1]}px` }}>
          {grid.map((row, inx) => {
            return (row.map((item, ind) => {
              return (
                <div key={item.num} className='grid-cell'>
                  {item.isPresent &&
                    <div
                      onDrop={(e) => handleDrop(e, inx, ind)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        const dragIndex = index
                        if (!isFromDropZone) {
                          setCurr({ piece: game.pieces[dragIndex], row: inx, col: ind })
                        } else {
                          let row1 = Math.floor(dragIndex / game.size[1]);
                          let col1 = dragIndex % game.size[1];
                          setCurr({ piece: grid[row1][col1].piece, row: inx, col: ind })
                        }
                      }}
                      onDragLeave={() => {
                        setCurr(null)
                      }}
                      draggable={!!item.piece}
                      onDragStart={(e) => item.piece && handleDragStart(e, inx * game.size[1] + ind, true)}
                      style={{ backgroundColor: `${item.backgroundColor}` }}
                    >
                      {item.piece && <img className='grid-img' src={`/${item.piece}.png`} alt={`${item.piece}-img`} />}
                    </div>}
                </div>
              )
            }))
          })}
        </div>
        <div className='pieces-staging-area'>
          {game && game.pieces.map((piece, inx) => {
            return (
              <div
                key={inx}
                className='pieces-staging-item'
                draggable
                onDragStart={(e) => handleDragStart(e, inx, false)}
              >
                <img src={`/${piece}.png`} alt={`${piece}-img`} />
              </div>
            )
          })}
        </div>
      </main>
    </>
  )
}

export default App