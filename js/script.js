// OUTSTANDING ITEMS (# of 20 min sprints) Total 16/3 = 5 1/3 hours
// 1. (3) enable pieces to attack each other
// 2. (1) enable promotions to king pieces
// 3. (2) restrict moves based on piece/player type
// 4. (2) restrict attacks based on piece/player type
// .. (?) restrict all moves if ANY pieces are able to attack

// 5. (1) add win/loss logic ~ player wins when all opponent pieces are captured or blocked (i.e. losing player has no valid moves)
// 6. (1) show appropriate game alerts ~ whose move it is, how many pieces are left/captured by each player, game over/win/loss alert
// 7. (2) build README.file ~ include screenshots
// 8. (1) make notes for the presentation ~ fav code snipped, biggest challenge, learnings/takeaways
// 9. (2) final code review / clean up
// 10. (1) final push to git hub pages

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

let testingGameState = [
    [0, -1, 0, -1, 0, -1, 0, 0],
    [-1, 0, -1, 0, -1, 0, -1, 0],
    [0, -1, 0, -1, 0, -1, 0, -1],
    [0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, -1, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 1, 0, 1, 0, 1, 0]
]

let currentGameState = testingGameState

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
let destinationTiles = []
let attackList = []
let captureTiles = []
let playerOneTurn = true

// CLICK ON GRID

function gridClick(eventObj) {
    
    let targetElement = eventObj.target

    if ((isPieceInHand === false) && (targetElement.classList.contains('piece'))) {
        activatePiece(targetElement)
    } else if (isPieceInHand) {
        if (targetElement === pieceInHand) {
            deactivatePiece(targetElement)
        } else if (captureTiles.includes(targetElement)) {
            attackPiece(pieceInHand, targetElement)
            deactivatePiece(pieceInHand)
        } else if (destinationTiles.includes(targetElement)) {
            movePiece(pieceInHand, targetElement)
            deactivatePiece(pieceInHand)
        }
    }
}

function attackPiece(targetPiece, targetDestination) {
    originLocation = targetPiece.parentNode.id.split('-')
    destinationLocation = targetDestination.id.split('-')

    captureLocationRow = (Number(originLocation[0]) + Number(destinationLocation[0])) / 2
    captureLocationColumn = (Number(originLocation[1]) + Number(destinationLocation[1])) / 2
    captureLocation = [captureLocationRow, captureLocationColumn]
    
    pieceNotation = currentGameState[originLocation[0]][originLocation[1]]
    currentGameState[originLocation[0]][originLocation[1]] = 0
    currentGameState[destinationLocation[0]][destinationLocation[1]] = pieceNotation
    targetDestination.appendChild(targetPiece)
    currentGameState[captureLocation[0]][captureLocation[1]] = 0
    renderGameState(currentGameState)
}

function movePiece(targetPiece, targetDestination) {
    originLocation = targetPiece.parentNode.id.split('-')
    destinationLocation = targetDestination.id.split('-')
    pieceNotation = currentGameState[originLocation[0]][originLocation[1]]
    currentGameState[originLocation[0]][originLocation[1]] = 0
    currentGameState[destinationLocation[0]][destinationLocation[1]] = pieceNotation
    targetDestination.appendChild(targetPiece)
}

function activatePiece(targetPiece) {
    isPieceInHand = true
    pieceInHand = targetPiece
    pieceInHand.classList.add('active')

    let tileLocation = pieceInHand.parentNode.id.split('-')
    attackList = buildAttackList(tileLocation[0], tileLocation[1])
    
    moveList = buildMoveList(tileLocation[0], tileLocation[1])

    attackList.forEach(function(attack) {
        let captureTile = document.getElementById(`${attack[0]}-${attack[1]}`)
        captureTile.classList.add('active')
        captureTiles.push(captureTile)
    })
    
    moveList.forEach(function(move) {
        let destinationTile = document.getElementById(`${move[0]}-${move[1]}`)
        destinationTile.classList.add('active')
        destinationTiles.push(destinationTile)
    })
}

function deactivatePiece(targetPiece) {
    targetPiece.classList.remove('active')

    captureTiles.forEach(function(captureTile) {
        captureTile.classList.remove('active')
    })

    destinationTiles.forEach(function(destinationTile) {
        destinationTile.classList.remove('active')
    })

    isPieceInHand = false
    pieceInHand = null
    moveList = []
    destinationTiles = []
    attackList = []
    captureTiles = []
}

function buildAttackList(rowInput, columnInput) {

    let row = Number(rowInput)
    let column = Number(columnInput)

    let pieceType = currentGameState[row][column]

    let rowUp = row - 1
    let rowDown = row + 1
    let columnLeft = column - 1
    let columnRight = column + 1

    let jumpRowUp = row - 2
    let jumpRowDown = row + 2
    let jumpColumnLeft = column - 2
    let jumpColumnRight = column + 2

    let upLeft = [rowUp, columnLeft]
    let upRight = [rowUp, columnRight]
    let downLeft = [rowDown, columnLeft]
    let downRight = [rowDown, columnRight]

    let jumpUpLeft = [jumpRowUp, jumpColumnLeft]
    let jumpUpRight = [jumpRowUp, jumpColumnRight]
    let jumpDownLeft = [jumpRowDown, jumpColumnLeft]
    let jumpDownRight = [jumpRowDown, jumpColumnRight]

    let attackUpLeft = attackAvailable(upLeft, jumpUpLeft)
    let attackUpRight = attackAvailable(upRight, jumpUpRight)
    let attackDownLeft = attackAvailable(downLeft, jumpDownLeft)
    let attackDownRight = attackAvailable(downRight, jumpDownRight)

    attackList = []

    if (attackUpLeft) attackList.push(jumpUpLeft)
    if (attackUpRight) attackList.push(jumpUpRight)
    if (attackDownLeft) attackList.push(jumpDownLeft)
    if (attackDownRight) attackList.push(jumpDownRight)

    return attackList
}

function attackAvailable(captureTile, jumpTile) {

    let captureRow = captureTile[0]
    let captureColumn = captureTile[1]

    let jumpRow = jumpTile[0]
    let jumpColumn = jumpTile[1]
    
    if (jumpRow < 0 || jumpRow > 7) return false
    if (jumpColumn < 0 || jumpColumn > 7) return false

    if ((currentGameState[jumpRow][jumpColumn] === 0) && (currentGameState[captureRow][captureColumn] !== 0)) {
        return true
    }

    return false
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

    moveList = []

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