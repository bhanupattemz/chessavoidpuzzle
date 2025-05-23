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
    pieces: ["bishops", "bishops", "bishops", "bishops", "queen"],
    notHave: [[0, 0]]
  })
  const [steps, setSteps] = useState(0)
  const [loss, setLoss] = useState(false)
  const [win, setWin] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [curr, setCurr] = useState(null)
  const [index, setIndex] = useState(null)
  const [isFromDropZone, setIsFromDropZone] = useState(false)
  const [touchStartPos, setTouchStartPos] = useState(null)
  const [dragElement, setDragElement] = useState(null)
  const [ghostImage, setGhostImage] = useState(null)
  const getElementFromTouch = useCallback((clientX, clientY) => {
    return document.elementFromPoint(clientX, clientY)
  }, [])

  const getGridPosition = useCallback((element) => {
    const gridCell = element.closest('.grid-cell')
    if (!gridCell) return null

    const cellIndex = Array.from(gridCell.parentElement.children).indexOf(gridCell)
    const row = Math.floor(cellIndex / game.size[1])
    const col = cellIndex % game.size[1]

    return { row, col }
  }, [game.size])

  const getStagingIndex = useCallback((element) => {
    const stagingItem = element.closest('.pieces-staging-item')
    if (!stagingItem) return null

    return Array.from(stagingItem.parentElement.children).indexOf(stagingItem)
  }, [])

  const handleTouchStart = useCallback((e, touchIndex, touchIsFromDropZone = false) => {
    e.preventDefault()
    const touch = e.touches[0]
    setTouchStartPos({ x: touch.clientX, y: touch.clientY })
    setIndex(touchIndex)
    setIsFromDropZone(touchIsFromDropZone)
    setIsDragging(true)
    setDragElement(e.currentTarget)

    const pieceName = touchIsFromDropZone
      ? (() => {
        const row = Math.floor(touchIndex / game.size[1])
        const col = touchIndex % game.size[1]
        return grid[row] && grid[row][col] ? grid[row][col].piece : null
      })()
      : game.pieces[touchIndex]

    if (pieceName) {
      setGhostImage({
        piece: pieceName,
        x: touch.clientX,
        y: touch.clientY
      })
    }
  }, [game.pieces, game.size, grid])

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || !touchStartPos) return

    e.preventDefault()
    const touch = e.touches[0]

    if (ghostImage) {
      setGhostImage(prev => ({
        ...prev,
        x: touch.clientX,
        y: touch.clientY
      }))
    }

    const element = getElementFromTouch(touch.clientX, touch.clientY)

    if (element) {
      const gridPos = getGridPosition(element)
      if (gridPos && grid[gridPos.row] && grid[gridPos.row][gridPos.col] && grid[gridPos.row][gridPos.col].isPresent) {
        const dragIndex = index
        if (!isFromDropZone) {
          setCurr({ piece: game.pieces[dragIndex], row: gridPos.row, col: gridPos.col })
        } else {
          let row1 = Math.floor(dragIndex / game.size[1]);
          let col1 = dragIndex % game.size[1];
          setCurr({ piece: grid[row1][col1].piece, row: gridPos.row, col: gridPos.col })
        }
      } else {
        setCurr(null)
      }
    }
  }, [isDragging, touchStartPos, index, isFromDropZone, game.pieces, game.size, grid, getElementFromTouch, getGridPosition, ghostImage])

  const handleTouchEnd = useCallback((e) => {
    setSteps(prev => prev += 1)
    if (!isDragging) return

    e.preventDefault()
    const touch = e.changedTouches[0]
    const element = getElementFromTouch(touch.clientX, touch.clientY)

    setCurr(null)

    if (element) {
      const gridPos = getGridPosition(element)
      if (gridPos && grid[gridPos.row] && grid[gridPos.row][gridPos.col] && grid[gridPos.row][gridPos.col].isPresent) {
        const dragIndex = index

        if (!isFromDropZone) {
          if (dragIndex == null || dragIndex >= game.pieces.length) return;

          const pieceToAdd = game.pieces[dragIndex];
          if (!pieceToAdd) return;

          const newGrid = JSON.parse(JSON.stringify(grid));
          const pieceToReplace = newGrid[gridPos.row][gridPos.col].piece;
          newGrid[gridPos.row][gridPos.col].piece = pieceToAdd;
          setGrid(newGrid);

          const updatedPieces = [...game.pieces];
          updatedPieces.splice(dragIndex, 1);
          if (pieceToReplace) updatedPieces.push(pieceToReplace);
          setgame(prev => ({ ...prev, pieces: updatedPieces }));
        } else {
          let row1 = Math.floor(dragIndex / game.size[1]);
          let col1 = dragIndex % game.size[1];
          const newGrid = JSON.parse(JSON.stringify(grid));
          let tempPiece = null
          if (newGrid[gridPos.row][gridPos.col].piece) {
            tempPiece = newGrid[gridPos.row][gridPos.col].piece
          }
          newGrid[gridPos.row][gridPos.col].piece = newGrid[row1][col1].piece;
          newGrid[row1][col1].piece = tempPiece
          setGrid(newGrid);
        }
      }
    }

    setIsDragging(false)
    setTouchStartPos(null)
    setDragElement(null)
    setGhostImage(null)
  }, [isDragging, index, isFromDropZone, grid, game, getElementFromTouch, getGridPosition])

  const handleDragStart = useCallback((e, index, isFromDropZone = false) => {
    setIndex(index)
    setIsFromDropZone(isFromDropZone)
    setIsDragging(true);
  }, []);

  const handleDrop = useCallback((e, row, col) => {
    e.preventDefault();
    e.stopPropagation();
    setCurr(null)
    setSteps(prev => prev + 1)
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
        let isPresent = true
        for (let item of game.notHave) {
          if (item[0] == i && item[1] == j) {
            isPresent = false
          }
        }
        row.push({
          num: i * game.size[1] + j,
          isPresent,
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
      let data = CheckSolution(grid, game.size[0], game.size[1])
      if (data[0]) {
        setLoss(false)
        if (game.pieces.length === 0) {
          setWin(true)
        }
      } else {
        const [i, j] = data[1]
        if (grid[i][j].backgroundColor !== "brown") {
          let tempGrid = JSON.parse(JSON.stringify(grid))
          tempGrid[i][j].backgroundColor = "brown"
          setGrid(tempGrid)
        }
        setLoss(true)
        setWin(false)
      }
    }
  }, [grid])


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
        {win && <div style={{ color: "green", fontSize: "1.5rem", fontWeight: "700" }}>Solved</div>}
        {loss && <div style={{ color: "red", fontSize: "1.5rem", fontWeight: "700" }}>Exposed</div>}
        <div className='grid-container' style={{ gridTemplateRows: `repeat(${game.size[0]}, 100px)`, gridTemplateColumns: `repeat(${game.size[1]}, 100px)`, width: `${game.size[1] * 100 + game.size[1]}px` }}>
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
                      onTouchStart={(e) => item.piece && handleTouchStart(e, inx * game.size[1] + ind, true)}
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
                onTouchStart={(e) => handleTouchStart(e, inx, false)}
              >
                <img src={`/${piece}.png`} alt={`${piece}-img`} />
              </div>
            )
          })}
        </div>

        {ghostImage && (
          <div
            style={{
              position: 'fixed',
              left: ghostImage.x - 25,
              top: ghostImage.y - 25,
              width: '50px',
              height: '50px',
              pointerEvents: 'none',
              zIndex: 1000,
              opacity: 0.7,
              transform: 'scale(1.1)'
            }}
          >
            <img
              src={`/${ghostImage.piece}.png`}
              alt={`${ghostImage.piece}-ghost`}
              style={{
                width: '100%',
                height: '100%',
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
              }}
            />
          </div>
        )}
      </main>
    </>
  )
}

export default App