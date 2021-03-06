// TO-DO LIST
// 1. must force captures where possible
// ...if any player's piece can capture
// ...then, only capture moves should be generated for those with one available
// 2. address all concerns at (***)
// 3. do I really need a comment to describe each function?
// ...comments should serve a purpose for my future self; otherwise delete
// 4. do I really need moveList & captureList to be global variables? 
// ...instead could they be returned by generateMoves() and stay within local scope
// 5. need to check/confirm that once a piece is promoted to king;
// ...its turn is immediately ended even if it has another capturing opporunity
// 6. perhaps terminology should distinguish between step-move vs. capture-move
// TEST

// 0 => empty tile, 1 => black piece, 2 => white piece
let initialBoardSetup = [
    [0, -1, 0, -1, 0, -1, 0, -1],
    [-1, 0, -1, 0, -1, 0, -1, 0],
    [0, -1, 0, -1, 0, -1, 0, -1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0]
]

// multi-jump and king promotion
let gameState1 = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, -1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, -1, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
]

// win by blocking movement
let gameState2 = [
    [0, -1, 0, 0, 0, 0, 0, -1],
    [1, 0, 1, 0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, -1, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
]

// force captures
let gameState3 = [
    [0, -1, 0, 0, 0, 0, 0, 0],
    [1, 0, -1, 0, 0, 0, -1, 0],
    [0, 0, 0, 1, 0, 1, 0, 0],
    [0, 0, -1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, -1, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
]

let currentGameState = gameState3
let gameOver = false
let playerTurn = 'black'
let blackPieceCount
let whitePieceCount
let isPieceActive = false
let activePiece

let moveList = []
let captureList = []
let captureTiles = []
let moveTiles = []

let alertWindow = document.querySelector('.alert-area')
let gridArea = document.querySelector('.grid')
let newGameButton = document.querySelector('button')

// initiate gameplay
renderGameState(currentGameState)
gridArea.addEventListener('click', gridClick)
newGameButton.addEventListener('click', resetGame)

// generate the pieces on the board
function renderGameState(gameState) {

    // reset piece count
    blackPieceCount = 0
    whitePieceCount = 0

    // loop over each tile on the board
    gameState.forEach(function(rowValues, rowIndex) {
        rowValues.forEach(function(tileValue, columnIndex) {
            
            // capture and empty the corresponding tile
            let targetTile = document.getElementById(`${rowIndex}-${columnIndex}`)
            targetTile.innerHTML = ''

            if (tileValue != 0) {

                // create a <div> with the corresponding piece type
                let newDivElement = document.createElement('div')
                if (tileValue ===  1) newDivElement.className = 'piece black man'
                if (tileValue ===  2) newDivElement.className = 'piece black king'
                if (tileValue === -1) newDivElement.className = 'piece white man'
                if (tileValue === -2) newDivElement.className = 'piece white king'
                
                // place the piece on to the tile
                targetTile.appendChild(newDivElement)

                // update piece count
                if (tileValue > 0) blackPieceCount++
                if (tileValue < 0) whitePieceCount++
            }
        })
    })

    // generate player info
    alertWindow.innerHTML = ''
    alertWindow.innerHTML = `<p>Black Pieces Remaining: ${blackPieceCount}<br>White Pieces Remaining: ${whitePieceCount}</p>`
    if (playerTurn === 'black') alertWindow.innerHTML += '<p>Black Turn</p>'
    if (playerTurn === 'white') alertWindow.innerHTML += '<p>White Turn</p>'
}

// manage player interaction with pieces on the board
function gridClick(eventObj) {
    
    if (gameOver) {
        return
    }

    let playerSelection = eventObj.target
    
    // activate piece on first click
    if ((!isPieceActive) && 
        (playerSelection.classList.contains('piece')) &&
        (playerSelection.classList.contains(playerTurn))) {
            activatePiece(playerSelection)

    // instruct active piece on second click
    } else if (isPieceActive) {

        // deactivate if selected again
        if (playerSelection === activePiece) {
            deactivatePiece()

        // capture enemy piece
        } else if (captureTiles.includes(playerSelection)) {
            capturePiece(playerSelection)
            checkForPromotions()
            activatePiece(activePiece)  // (***) is this second activation required or would it be simpler to just generateMoves()
            if (captureList.length > 0) {
                return
            } else {
                switchPlayerTurn()
                deactivatePiece()
                renderGameState(currentGameState)
            }

        // move player piece
        } else if (moveTiles.includes(playerSelection)) {
            movePiece(playerSelection)
            checkForPromotions()
            switchPlayerTurn()
            deactivatePiece()
            renderGameState(currentGameState)
        }
    }

    checkForWinner()
}

// activate piece and its potential moves
function activatePiece(targetPiece) {

    let anyCaptureAvailable = scanForCaptures()

    isPieceActive = true
    activePiece = targetPiece
    activePiece.classList.add('active')  // enables styling

    let tileLocation = activePiece.parentNode.id.split('-')
    generateMoves(tileLocation[0], tileLocation[1])

    captureList.forEach(function(captureLocation) {
        let captureTile = document.getElementById(`${captureLocation[0]}-${captureLocation[1]}`)
        captureTile.classList.add('active')
        captureTiles.push(captureTile)
    })
    
    // if (captureList.length > 0) {
    if (anyCaptureAvailable) {
        return
    } else {
        moveList.forEach(function(moveLocation) {
            let moveTile = document.getElementById(`${moveLocation[0]}-${moveLocation[1]}`)
            moveTile.classList.add('active')
            moveTiles.push(moveTile)
        })
    }
}

// generate moves for a piece at the given board location
// if mode = 0; update moveList & captureList with every valid move found
// if mode = 1; return true as soon as the first valid move (includes capture) is found
// if mode = 2; return true as soon as the first valid capture is found
function generateMoves(rowIndex, columnIndex, mode = 0) {

    let row = Number(rowIndex)
    let column = Number(columnIndex)

    // generate coordinates for adjacent tiles
    let moveRowUp = row - 1
    let moveRowDown = row + 1
    let moveColumnLeft = column - 1
    let moveColumnRight = column + 1
    //
    let jumpRowUp = row - 2
    let jumpRowDown = row + 2
    let jumpColumnLeft = column - 2
    let jumpColumnRight = column + 2
    //
    let stepUpLeft = [moveRowUp, moveColumnLeft]
    let stepUpRight = [moveRowUp, moveColumnRight]
    let stepDownLeft = [moveRowDown, moveColumnLeft]
    let stepDownRight = [moveRowDown, moveColumnRight]
    //
    let jumpUpLeft = [jumpRowUp, jumpColumnLeft]
    let jumpUpRight = [jumpRowUp, jumpColumnRight]
    let jumpDownLeft = [jumpRowDown, jumpColumnLeft]
    let jumpDownRight = [jumpRowDown, jumpColumnRight]

    // return true or false if a move or capture is available in each direction
    let moveUpLeft = moveAvailable(stepUpLeft)
    let moveUpRight = moveAvailable(stepUpRight)
    let moveDownLeft = moveAvailable(stepDownLeft)
    let moveDownRight = moveAvailable(stepDownRight)
    //
    let captureUpLeft = captureAvailable(stepUpLeft, jumpUpLeft)
    let captureUpRight = captureAvailable(stepUpRight, jumpUpRight)
    let captureDownLeft = captureAvailable(stepDownLeft, jumpDownLeft)
    let captureDownRight = captureAvailable(stepDownRight, jumpDownRight)

    moveList = []
    captureList = []

    let pieceType = currentGameState[row][column]

    if (pieceType === 1) {

        if (moveUpLeft) {if (mode === 1) {return true} else {moveList.push(stepUpLeft)}}
        if (moveUpRight) {if (mode === 1) {return true} else {moveList.push(stepUpRight)}}

        if (captureUpLeft) {if ((mode === 1) || (mode === 2)) {return true} else {captureList.push(jumpUpLeft)}}
        if (captureUpRight) {if ((mode === 1) || (mode === 2)) {return true} else {captureList.push(jumpUpRight)}}

    } else if (pieceType === -1) {

        if (moveDownLeft) {if (mode === 1) {return true} else {moveList.push(stepDownLeft)}}
        if (moveDownRight) {if (mode === 1) {return true} else {moveList.push(stepDownRight)}}

        if (captureDownLeft) {if ((mode === 1) || (mode === 2)) {return true} else {captureList.push(jumpDownLeft)}}
        if (captureDownRight) {if ((mode === 1) || (mode === 2)) {return true} else {captureList.push(jumpDownRight)}} 

    } else if ((pieceType === 2) || (pieceType === -2)) {

        if (moveUpLeft) {if (mode === 1) {return true} else {moveList.push(stepUpLeft)}} 
        if (moveUpRight) {if (mode === 1) {return true} else {moveList.push(stepUpRight)}}
        if (moveDownLeft) {if (mode === 1) {return true} else {moveList.push(stepDownLeft)}}
        if (moveDownRight) {if (mode === 1) {return true} else {moveList.push(stepDownRight)}}

        if (captureUpLeft) {if ((mode === 1) || (mode === 2)) {return true} else {captureList.push(jumpUpLeft)}}
        if (captureUpRight) {if ((mode === 1) || (mode === 2)) {return true} else {captureList.push(jumpUpRight)}}
        if (captureDownLeft) {if ((mode === 1) || (mode === 2)) {return true} else {captureList.push(jumpDownLeft)}}
        if (captureDownRight) {if ((mode === 1) || (mode === 2)) {return true} else {captureList.push(jumpDownRight)}}
    }
}

// determine if a piece can move to the given location
function moveAvailable(moveLocation) {

    let row = moveLocation[0]
    let column = moveLocation[1]

    // check if move is out-of-bounds
    if (row < 0 || row > 7) return false
    if (column < 0 || column > 7) return false

    // check if move location is unoccupied
    if (currentGameState[row][column] === 0) return true

    return false
}

// determine if a piece can jump via then given capture and jump locations
function captureAvailable(captureLocation, jumpLocation) {

    let captureRow = captureLocation[0]
    let captureColumn = captureLocation[1]

    let jumpRow = jumpLocation[0]
    let jumpColumn = jumpLocation[1]
    
    // check if jump is out-of-bounds
    if (jumpRow < 0 || jumpRow > 7) return false
    if (jumpColumn < 0 || jumpColumn > 7) return false

    // check if jump location is unoccupied
    if (currentGameState[jumpRow][jumpColumn] !== 0) return false

    // check if capture location is occupied by enemy piece
    if ((playerTurn === 'black') && (currentGameState[captureRow][captureColumn] < 0)) return true
    if ((playerTurn === 'white') && (currentGameState[captureRow][captureColumn] > 0)) return true

    return false
}

function checkForWinner() {

    // win by elimination
    blackElimination = (blackPieceCount === 0)
    whiteElimination = (whitePieceCount === 0)
    if (blackElimination || whiteElimination) {
        if (blackElimination) alertWindow.innerHTML = '<p>White Wins The Game!</p>'
        if (whiteElimination) alertWindow.innerHTML = '<p>Black Wins The Game!</p>'
        gameOver = true
        return
    }

    // win by blocking
    anyMoveAvailable = scanForMoves()
    if ((!anyMoveAvailable) && (playerTurn === 'black')) {
        alertWindow.innerHTML = '<p>White Wins The Game!</p>'
        gameOver = true
    } else if ((!anyMoveAvailable) && (playerTurn === 'white')) {
        alertWindow.innerHTML = '<p>Black Wins The Game!</p>'
        gameOver = true
    }
}

// return true if the current player has at least one move available
function scanForMoves() {
    for (let row = 0; row < 8; row++) {
        for (let column = 0; column < 8; column++) {
            pieceType = currentGameState[row][column]
            if ((playerTurn === 'black') && (pieceType > 0)) {
                if (generateMoves(row, column, mode = 1)) return true
            } else if ((playerTurn === 'white') && (pieceType < 0)) {
                if (generateMoves(row, column, mode = 1)) return true
            }
        }
    }
    return false
}

// return true if the current player has at least one capture available
function scanForCaptures() {
    for (let row = 0; row < 8; row++) {
        for (let column = 0; column < 8; column++) {
            pieceType = currentGameState[row][column]
            if ((playerTurn === 'black') && (pieceType > 0)) {
                if (generateMoves(row, column, mode = 2)) return true
            } else if ((playerTurn === 'white') && (pieceType < 0)) {
                if (generateMoves(row, column, mode = 2)) return true
            }
        }
    }
    return false
}

function switchPlayerTurn() {
    if (playerTurn === 'black') {
        playerTurn = 'white'
    } else {
        playerTurn = 'black'
    }
}

// scans the last row for each player to promote all men that have reached it 
function checkForPromotions() {

    // holds the HTML ID of the active piece, so that we can reselect it once the game rerenders the board
    // (rerendering the board invalidates the reference to the object currently held inside activePiece)
    let pieceId = activePiece.parentNode.id

    for (let column = 0; column < 8; column++) {
        if (playerTurn === 'black') {
            pieceType = currentGameState[0][column]
            if (pieceType === 1) {
                currentGameState[0][column] = 2
                pieceId = `0-${column}`
                break
            }
        } else if (playerTurn === 'white') {
            pieceType = currentGameState[7][column]
            if (pieceType === -1) {
                currentGameState[7][column] = -2
                pieceId = `7-${column}`
                break
            }
        }
    }
    renderGameState(currentGameState)
    activePiece = document.getElementById(pieceId).childNodes[0]
}

// execute the capture command
function capturePiece(destinationTile) {

    currentLocation = activePiece.parentNode.id.split('-')
    jumpLocation = destinationTile.id.split('-')

    captureLocationRow = (Number(currentLocation[0]) + Number(jumpLocation[0])) / 2
    captureLocationColumn = (Number(currentLocation[1]) + Number(jumpLocation[1])) / 2
    captureLocation = [captureLocationRow, captureLocationColumn]
    
    pieceType = currentGameState[currentLocation[0]][currentLocation[1]]
    currentGameState[currentLocation[0]][currentLocation[1]] = 0
    currentGameState[jumpLocation[0]][jumpLocation[1]] = pieceType
    currentGameState[captureLocation[0]][captureLocation[1]] = 0

    document.getElementById(`${jumpLocation[0]}-${jumpLocation[1]}`).classList.remove('active')

    renderGameState(currentGameState)
    activePiece = document.getElementById(`${jumpLocation[0]}-${jumpLocation[1]}`).childNodes[0]
}

// execute the move command
function movePiece(destinationTile) {

    currentLocation = activePiece.parentNode.id.split('-')
    moveLocation = destinationTile.id.split('-')

    pieceType = currentGameState[currentLocation[0]][currentLocation[1]]
    currentGameState[currentLocation[0]][currentLocation[1]] = 0
    currentGameState[moveLocation[0]][moveLocation[1]] = pieceType

    renderGameState(currentGameState)
    activePiece = document.getElementById(`${moveLocation[0]}-${moveLocation[1]}`).childNodes[0]
}

function deactivatePiece() {

    activePiece.classList.remove('active')
    captureTiles.forEach(function(captureTile) {captureTile.classList.remove('active')})
    moveTiles.forEach(function(destinationTile) {destinationTile.classList.remove('active')})

    isPieceActive = false
    activePiece = null

    // (***) are each of these below really necessary? review to see if redundant
    captureList = []
    moveList = []
    captureTiles = []
    moveTiles = []
}

// resets the game by reloading the page
function resetGame() {
    document.location.reload()
}