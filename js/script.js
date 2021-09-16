let originalGameState = [
    [0, -1, 0, -1, 0, -1, 0, -1],
    [-1, 0, -1, 0, -1, 0, -1, 0],
    [0, -1, 0, -1, 0, -1, 0, -1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0]
]

let currentGameState = originalGameState

function renderGameState(gameState) {
    gameState.forEach(function(row, rowNumber) {
        row.forEach(function(cellValue, cellNumber) {
            let newDivElement = document.createElement('div')
            if (cellValue === 1) newDivElement.className = 'piece man playerOne'
            if (cellValue === 2) newDivElement.className = 'piece king playerOne'
            if (cellValue === -1) newDivElement.className = 'piece man piece playerTwo'
            if (cellValue === -2) newDivElement.className = 'piece king playerTwo'
            let targetTile = document.getElementById(`${rowNumber}-${cellNumber}`)
            targetTile.innerHTML = ''
            if (cellValue != 0) targetTile.appendChild(newDivElement)
        })
    })
}

renderGameState(currentGameState)

let gridArea = document.querySelector('.grid')
gridArea.addEventListener('click', gridClick)

let isPieceInHand = false
let pieceInHand = null
let moveList = []

// CLICK ON GRID

function gridClick(eventObj) {

    // if no piece is active, and piece itself is selected: 
    //          f1. activate piece and tiles available for movement or capture
    // else if piece is active,
    //      if same piece is clicked on again,
    //          f2. deactivate piece and tiles
    //      else if one of the highlighted movement tiles is clicked on,
    //          f3. move piece
    //          f2. deactivate piece and tiles 
    // else do nothing

    let targetElement = eventObj.target
    
    if (isPieceInHand) {

        // if the player clicks the same piece he previously clicked on,
        // 1. remove the dotted border style around the piece itself
        // 2. remove the dotted border style around the tiles highlighting valid moves
        if (targetElement === pieceInHand) {
            // 1.
            targetElement.style.borderStyle = 'double'
            // 2.
            moveList.forEach(function(move) {
                let destinationTile = document.getElementById(`${move[0]}-${move[1]}`)
                destinationTile.style.borderStyle = ''
            })
            isPieceInHand = false
            pieceInHand = null
        }

        let destinationTiles = []
        
        moveList.forEach(function(move) {
            let destinationTile = document.getElementById(`${move[0]}-${move[1]}`)
            destinationTiles.push(destinationTile)
        })

        for (destinationTile of destinationTiles) {
            if (targetElement === destinationTile) {
                targetElement.appendChild(pieceInHand)

                // Switch off dotted line around piece
                pieceInHand.style.borderStyle = 'double'

                // Switch off dotted line around each of the destination tiles
                destinationTiles.forEach(function(destinationTile) {
                    destinationTile.style.borderStyle = ''
                })

                console.log("FINISH!")
                break
            }
        }

        destinationTiles.forEach(function(destinationTile) {
            if (targetElement === destinationTile) {
                targetElement.appendChild(pieceInHand)
                pieceInHand.style.borderStyle = 'double'
            }
        })

        return
    }
    
    if (targetElement.classList.contains('piece')) {
        pieceInHand = targetElement
        isPieceInHand = true
        
        pieceInHand.style.borderStyle = 'dotted'
        
        let originTileLocation = pieceInHand.parentNode.id.split('-')
        moveList = buildMoveList(originTileLocation[0], originTileLocation[1])
        
        moveList.forEach(function(move) {
            let destinationTile = document.getElementById(`${move[0]}-${move[1]}`)
            destinationTile.style.borderStyle = 'dotted'
        })
    }
}

function buildMoveList(rowInput, columnInput) {
    
    let row = Number(rowInput)
    let column = Number(columnInput)

    let pieceType = currentGameState[row][column]
    
    let rowUp = row - 1
    let rowDown = row + 1
    let columnLeft = column - 1
    let columnRight = column + 1

    let upLeft = [rowUp, columnLeft]
    let upRight = [rowUp, columnRight]
    let downLeft = [rowDown, columnLeft]
    let downRight = [rowDown, columnRight]

    let moveUpLeft = moveAvailable(upLeft)
    let moveUpRight = moveAvailable(upRight)
    let moveDownLeft = moveAvailable(downLeft)
    let moveDownRight = moveAvailable(downRight)

    let moveList = []

    if (moveUpLeft) moveList.push(upLeft)
    if (moveUpRight) moveList.push(upRight)
    if (moveDownLeft) moveList.push(downLeft)
    if (moveDownRight) moveList.push(downRight)

    return moveList
}

function moveAvailable(move) {
    let row = move[0]
    let column = move[1]
    
    if (row < 0 || row > 7) return false
    if (column < 0 || column > 7) return false
    if (currentGameState[row][column] === 0) return true
    return false
}

// NEW GAME BUTTON

let newGameButton = document.querySelector('button')
newGameButton.addEventListener('click', resetGame)

function resetGame(eventObj) {
    document.location.reload()
}

// NOTES for future work:
// 
// -- Code cleanup ---
// Convert 0, 1, 2, -1, -2 into emptyCell, p1M, p1K, p2M, p2K
// Replace white/blank tile reference with dark/light reference
// 
// -- Feature add ons ---
// Add color scheme
// Custom color scheme templates
// Fully customizable color schemes
// Hints on hover
// Threat detection
// Switch to International Draughts mode, with a 10x10 grid and updated ruleset
// Render game board dynamically
// Crystal clear set of rules
// Custom rule options
// Free movement and delete piece options
// Random-move AI
// Example game state saves to showcase rules and functionality
// Sounds for movement, capture, promotion, victory and new game