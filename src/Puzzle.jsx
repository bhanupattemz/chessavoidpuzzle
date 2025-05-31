import { useState, useCallback } from 'react'
import './Puzzle.css'
import { useEffect } from 'react'
import { CheckSolution } from "./Solution"
import { useParams, useNavigate } from "react-router-dom"
import { getGame, pieces, getnLevels } from "./Games"
import { FaInfoCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

function Puzzle() {
  const [infoOpen, setInfoOpen] = useState(false)
  const [openSolution, setOpenSolution] = useState(false)
  const [refreshCount, setRefreshCount] = useState(0)
  const screenWidth = window.screen.width
  let [grid, setGrid] = useState([])
  let [coloredGrid, setColoredGrid] = useState([])
  let [solutionGrid, setSolutionGrid] = useState([])
  const navigate = useNavigate()
  const [initialPieces, setInitialPieces] = useState([])
  let [game, setgame] = useState({
    size: [0, 0],
    pieces: [],
    notHave: [],
    solution: []
  })
  const params = useParams()
  const [level, setLevel] = useState(parseInt(params.level))
  const [steps, setSteps] = useState(0)
  const [win, setWin] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [curr, setCurr] = useState(null)
  const [index, setIndex] = useState(null)
  const [isFromDropZone, setIsFromDropZone] = useState(false)
  const [isDropped, setIsDropped] = useState(false)
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
    setSteps(prev => prev + 1)
    if (!isDragging) return
    setIsDropped(true)
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
    setIsDropped(true)
    setSteps(prev => prev + 1)
    const dragIndex = index
    if (!isFromDropZone) {
      if (dragIndex == null || dragIndex >= game.pieces.length) return;

      const pieceToAdd = game.pieces[dragIndex];
      if (!pieceToAdd) return;
      const newGrid = JSON.parse(JSON.stringify(grid));
      const pieceToReplace = newGrid[row][col].piece;
      newGrid[row][col].piece = pieceToAdd;
      setGrid(newGrid);
      const updatedPieces = JSON.parse(JSON.stringify(game.pieces));
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
    let tempColors = []
    for (let i = 0; i < game.size[0]; i += 1) {
      let row = []
      let coloredRow = []
      for (let j = 0; j < game.size[1]; j += 1) {
        coloredRow.push("white")
        let isPresent = true
        for (let item of game.notHave) {
          if (item[0] === i && item[1] === j) {
            isPresent = false
          }
        }
        row.push({
          num: i * game.size[1] + j,
          isPresent,
          piece: null,
          colored: false
        })
      }
      temp.push(row)
      tempColors.push(coloredRow)
    }
    setGrid(temp)
    setColoredGrid(tempColors)
    let tempSolution = JSON.parse(JSON.stringify(temp))
    for (let piece of game.solution) {
      tempSolution[piece.n[0]][piece.n[1]].piece = piece.piece
    }
    setSolutionGrid(tempSolution)
  }, [game, refreshCount])

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
        if (game.pieces.length === 0) {
          setWin(true)
        }
      } else {
        const [i, j] = data[1]
        if (coloredGrid[i] && coloredGrid[i][j] !== "rgb(198, 255, 180)") {
          let tempColoredGrid = JSON.parse(JSON.stringify(coloredGrid))
          tempColoredGrid[i][j] = "rgb(198, 255, 180)"
          setColoredGrid(tempColoredGrid)
        }
        setWin(false)
      }
    }
  }, [grid, coloredGrid])

  useEffect(() => {
    let rows = game.size[0]
    let cols = game.size[1]
    if (!grid || grid.length !== rows || (grid[0] && grid[0].length !== cols)) {
      return
    }
    let tempGrid = JSON.parse(JSON.stringify(grid))
    let tempColoredGrid = JSON.parse(JSON.stringify(coloredGrid))
    for (let i = 0; i < game.size[0]; i += 1) {
      for (let j = 0; j < game.size[1]; j += 1) {
        tempColoredGrid[i][j] = "white"
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
            if (tempColoredGrid[n1] && tempColoredGrid[n1][n2] && tempGrid[n1][n2].isPresent) {
              tempColoredGrid[n1][n2] = "rgb(198, 255, 180)";
            }
            if (num === 1) break;
          }
        }
      }
    }
    if (isDropped) {
      let rows = game.size[0];
      let cols = game.size[1];
      if (!grid || grid.length !== rows || (grid[0] && grid[0].length !== cols)) {
        return;
      }
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          tempGrid[i][j].colored = false;
        }
      }

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const pieceConfig = tempGrid[i][j].piece;
          if (pieceConfig) {
            const { moves, num } = pieces[pieceConfig];
            for (let move of moves) {
              let n1 = i;
              let n2 = j;
              if (tempGrid[n1] && tempGrid[n1][n2] && tempGrid[n1][n2].isPresent) {
                tempGrid[n1][n2].colored = true;
              }
              for (let step = 1; step <= num; step++) {
                n1 += move[0];
                n2 += move[1];
                if (n1 < 0 || n1 >= rows || n2 < 0 || n2 >= cols) break;
                if (tempGrid[n1] && tempGrid[n1][n2] && tempGrid[n1][n2].isPresent) {
                  tempGrid[n1][n2].colored = true;
                }
                if (num === 1) break;
              }
            }
          }
        }
      }
      setIsDropped(false);
      setGrid(tempGrid)
    }
    setColoredGrid(tempColoredGrid)
  }, [isDropped, curr])

  useEffect(() => {
    let tempgame = getGame(level)
    setgame(tempgame)
    setInitialPieces(tempgame.pieces)
    localStorage.setItem("level", level)
  }, [level])

  return (
    <>
      <h1 className='game-h1'>Chess Avoidance Puzzles</h1>
      {infoOpen && <div className='popup-container'>
        <div className='close-btn'>
          <span onClick={() => setInfoOpen(false)}><MdCancel /></span>
        </div>
        <h2>Game details</h2>
        <p>Place the chess pieces provided on the chess board provided so that no piece attacks any other.</p>
        <div className='info-pieces'>
          <div className='info-piece'>
            <h3>King</h3>
            <div>
              <img src="/king.png" alt="king-piece" />
              <p>One square in any direction (horizontal, vertical, or diagonal).</p>
            </div>
          </div>
          <div className='info-piece'>
            <h3>queen</h3>
            <div>
              <img src="/queen.png" alt="queen-piece" />
              <p>Any number of squares in any direction (horizontal, vertical, diagonal).</p>
            </div>
          </div>
          <div className='info-piece'>
            <h3>Bishops</h3>
            <div>
              <img src="/bishops.png" alt="bishops-piece" />
              <p>Any number of squares diagonally.</p>
            </div>
          </div>
          <div className='info-piece'>
            <h3>rooks</h3>
            <div>
              <img src="/rooks.png" alt="rooks-piece" />
              <p>Any number of squares horizontally or vertically.</p>
            </div>
          </div>
          <div className='info-piece'>
            <h3>Knights</h3>
            <div>
              <img src="/knights.png" alt="knights-piece" />
              <p>In an "L" shape (2 squares in one direction, then 1 square perpendicular).</p>
            </div>
          </div>
        </div>
      </div>}
      {openSolution &&
        <div className='popup-container'>
          <div className='close-btn'>
            <span onClick={() => setOpenSolution(false)}><MdCancel /></span>
          </div>
          <h2>Solution</h2>
          <div className='grid-container' style={{
            gridTemplateRows: `repeat(${game.size[0]}, ${screenWidth < 600 ? 50 : 100}px)`,
            gridTemplateColumns: `repeat(${game.size[1]}, ${screenWidth < 600 ? 50 : 100}px)`,
            gap: `${screenWidth < 600 ? 5 : 8}px`,
            padding: `${screenWidth < 600 ? 10 : 15}px`,
          }}>
            {solutionGrid.map((row, inx) => {
              return (row.map((item, ind) => {
                let backgroundColor = item.colored ? "rgb(253, 219, 225)" : "white"
                if (coloredGrid[inx][ind] !== "white") {
                  backgroundColor = coloredGrid[inx][ind]
                }
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
                        style={{ backgroundColor: `${backgroundColor}` }}
                      >
                        {item.piece && <img className='grid-img' src={`/${item.piece}.png`} alt={`${item.piece}-img`} />}
                      </div>}
                  </div>
                )
              }))
            })}
          </div>
        </div>}
      {win &&
        <div className='popup-container'>
          <div className='close-btn'>
            <span onClick={() => setWin(false)}><MdCancel /></span>
          </div>
          <img src="/win_animation.gif" alt="win-animation-gif" />
          <p>Solved</p>
          <div className='solved-btns'>
            {level >= 2 && <button onClick={() => window.location.href = `/puzzle/${level - 1}`}>Previous</button>}
            <button onClick={() => {
              window.location.href = `/puzzle/${level}`
            }}>RePlay</button>
            {level < getnLevels() && <button onClick={() => window.location.href = `/puzzle/${level + 1}`}>Next</button>}
          </div>
        </div>}
      <main className='chess-puzzle-main'>
        <div className='info-btn'><button onClick={() => { navigate("/generate") }}>Generate Own</button><span onClick={() => setInfoOpen(true)}><FaInfoCircle /></span></div>
        <div className='level-heading'>
          <h2>Level {level}</h2>
        </div>
        <div className='grid-scroll-container'>
          <div className='grid-container' style={{
            gridTemplateRows: `repeat(${game.size[0]}, ${screenWidth < 600 ? 50 : 100}px)`,
            gridTemplateColumns: `repeat(${game.size[1]}, ${screenWidth < 600 ? 50 : 100}px)`,
            gap: `${screenWidth < 600 ? 5 : 8}px`,
            padding: `${screenWidth < 600 ? 10 : 15}px`,
          }}>
            {grid.map((row, inx) => {
              return (row.map((item, ind) => {
                let backgroundColor = item.colored ? "rgb(253, 219, 225)" : "white"
                if (coloredGrid[inx][ind] !== "white") {
                  backgroundColor = coloredGrid[inx][ind]
                }
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
                        style={{ backgroundColor: `${backgroundColor}` }}
                      >
                        {item.piece && <img className='grid-img' src={`/${item.piece}.png`} alt={`${item.piece}-img`} />}
                      </div>}
                  </div>
                )
              }))
            })}
          </div>
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
        <div className='btn-container'>
          {level >= 2 && <button onClick={() => window.location.href = `/puzzle/${level - 1}`}>Previous</button>}
          <button onClick={() => {
            window.location.href = `/puzzle/${level}`
          }}>Refresh</button>
          <button onClick={() => setOpenSolution(true)}>Solution</button>
          {level < getnLevels() && <button onClick={() => window.location.href = `/puzzle/${level + 1}`}>Next</button>}
        </div>
        {ghostImage && (
          <div
            style={{
              position: 'fixed',
              left: ghostImage.x,
              top: ghostImage.y,
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

export default Puzzle