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

// use for multi-jump example
let exGameState1 = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, -1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, -1, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
]

let exGameState2 = [
    [0, 0, 0, 0, 0, 0, 0, -1],
    [0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, -1, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
]

let exGameState3 = [
    [0, -1, 0, 0, 0, 0, 0, -1],
    [1, 0, 1, 0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, -1, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
]

let currentGameState = originalGameState

let gridArea = document.querySelector('.grid')
gridArea.addEventListener('click', gridClick)

let isPieceInHand = false
let pieceInHand = null
let moveList = []
let destinationTiles = []
let attackList = []
let captureTiles = []
let turn = "playerOne"
let playerOnePieces = 0
let playerTwoPieces = 0
let winner = null

let alertWindow = document.querySelector('.alert-area')


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
    countPieces(gameState)
    renderAlertWindow()
}

function countPieces(state) {
    playerOnePieces = 0
    playerTwoPieces = 0
    state.forEach(function(row, rowNumber) {
        row.forEach(function(cellValue, cellNumber) {
            if (state[rowNumber][cellNumber] > 0) playerOnePieces++
            if (state[rowNumber][cellNumber] < 0) playerTwoPieces++
        })
    })
}

renderGameState(currentGameState)

// CLICK ON GRID

function gridClick(eventObj) {
    
    let targetElement = eventObj.target

    if (winner) {
        return
    }
    if ((isPieceInHand === false) && 
        (targetElement.classList.contains('piece')) &&
        (targetElement.classList.contains(turn))) {
        activatePiece(targetElement)
    } else if (isPieceInHand) {
        if (targetElement === pieceInHand) {
            deactivatePiece(targetElement)
        } else if (captureTiles.includes(targetElement)) {
            attackPiece(pieceInHand, targetElement)
            checkForPromotions()
            activatePiece(pieceInHand)
            if (attackList.length > 0) {
                return
            } else {
                switchPlayerTurn()
                deactivatePiece(pieceInHand)
                renderGameState(currentGameState)
            }
        } else if (destinationTiles.includes(targetElement)) {
            movePiece(pieceInHand, targetElement)
            checkForPromotions()
            switchPlayerTurn()
            deactivatePiece(pieceInHand)
            renderGameState(currentGameState)
        }
    }
    checkForWinner()
}

function checkForWinner() {
    if (playerOnePieces === 0) {
        winner = true
        alertWindow.innerHTML = '<p>White Wins The Game!</p>'
    } else if (playerTwoPieces === 0) {
        winner = true
        alertWindow.innerHTML = '<p>Black Wins The Game!</p>'

    }
    anyMoveAvailable = scanForMoves()
    if ((!anyMoveAvailable) && (turn === "playerOne")) {
        winner = true
        alertWindow.innerHTML = '<p>White Wins The Game!</p>'
    } else if ((!anyMoveAvailable) && (turn === "playerTwo")) {
        winner = true
        alertWindow.innerHTML = '<p>Black Wins The Game!</p>'
    }
}

function scanForMoves() {
    if (turn === "playerOne") {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                pieceOnTile = currentGameState[i][j]
                if (pieceOnTile > 0) {
                    attackScan = buildAttackList(i, j)
                    moveScan = buildMoveList(i, j)
                    if ((attackScan.length > 0) || (moveScan.length > 0)) return true
                }
            }
        }
    } else if (turn === "playerTwo") {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                pieceOnTile = currentGameState[i][j]
                if (pieceOnTile < 0) {
                    attackScan = buildAttackList(i, j)
                    moveScan = buildMoveList(i, j)
                    if ((attackScan.length > 0) || (moveScan.length > 0)) return true
                }
            }
        }
    }
    return false
}

function renderAlertWindow() {
    alertWindow.innerHTML = ''
    alertWindow.innerHTML = `<p>Black Pieces Remaining: ${playerOnePieces}<br>White Pieces Remaining: ${playerTwoPieces}</p>`
    if (turn === "playerOne") {
        alertWindow.innerHTML += "<p>Black Turn</p>"
    } else {
        alertWindow.innerHTML += "<p>White Turn</p>"
    }
}

function switchPlayerTurn() {
    if (turn === "playerOne") {
        turn = "playerTwo"
    } else {
        turn = "playerOne"
    }
}

function checkForPromotions() {
    let lastRow = currentGameState[0]
    let firstRow = currentGameState[7]
    
    let pieceId = pieceInHand.parentNode.id

    lastRow.forEach(function(tileValue, tileNum) {
        if (tileValue === 1) {
            currentGameState[0][tileNum] = 2
            pieceId = `0-${tileNum}`
        }
    })

    firstRow.forEach(function(tileValue, tileNum) {
        if (tileValue === -1) {
            currentGameState[7][tileNum] = -2
            pieceId = `7-${tileNum}`
        }
    })

    renderGameState(currentGameState)
    newTile = document.getElementById(pieceId)
    newPiece = newTile.childNodes[0]
    pieceInHand = newPiece
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
    currentGameState[captureLocation[0]][captureLocation[1]] = 0
    renderGameState(currentGameState)
    newTile = document.getElementById(`${destinationLocation[0]}-${destinationLocation[1]}`)
    newPiece = newTile.childNodes[0]
    pieceInHand = newPiece
}

function movePiece(targetPiece, targetDestination) {
    originLocation = targetPiece.parentNode.id.split('-')
    destinationLocation = targetDestination.id.split('-')
    pieceNotation = currentGameState[originLocation[0]][originLocation[1]]
    currentGameState[originLocation[0]][originLocation[1]] = 0
    currentGameState[destinationLocation[0]][destinationLocation[1]] = pieceNotation
    renderGameState(currentGameState)
    newTile = document.getElementById(`${destinationLocation[0]}-${destinationLocation[1]}`)
    newPiece = newTile.childNodes[0]
    pieceInHand = newPiece
}

function activatePiece(targetPiece) {
    isPieceInHand = true
    pieceInHand = targetPiece
    pieceInHand.classList.add('active')

    // check every piece of current player to determine if any of them have an attack available
    // if so, force code below to only work if piece selected is one of the pieces with an attacking move

    let tileLocation = pieceInHand.parentNode.id.split('-')
    
    attackList = buildAttackList(tileLocation[0], tileLocation[1])
    moveList = buildMoveList(tileLocation[0], tileLocation[1])

    attackList.forEach(function(attack) {
        let captureTile = document.getElementById(`${attack[0]}-${attack[1]}`)
        captureTile.classList.add('active')
        captureTiles.push(captureTile)
    })
    
    if (attackList.length > 0) {
        return
    } else {
        moveList.forEach(function(move) {
            let destinationTile = document.getElementById(`${move[0]}-${move[1]}`)
            destinationTile.classList.add('active')
            destinationTiles.push(destinationTile)
        })
    }
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
    attackList = []
    moveList = []
    captureTiles = []
    destinationTiles = []
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

    if (pieceType === 1) {
        if (attackUpLeft) attackList.push(jumpUpLeft)
        if (attackUpRight) attackList.push(jumpUpRight)
    } else if (pieceType === -1) {
        if (attackDownLeft) attackList.push(jumpDownLeft)
        if (attackDownRight) attackList.push(jumpDownRight)
    } else if ((pieceType === 2) || (pieceType === -2)) {
        if (attackUpLeft) attackList.push(jumpUpLeft)
        if (attackUpRight) attackList.push(jumpUpRight)
        if (attackDownLeft) attackList.push(jumpDownLeft)
        if (attackDownRight) attackList.push(jumpDownRight)
    }

    return attackList
}

function attackAvailable(captureTile, jumpTile) {

    let captureRow = captureTile[0]
    let captureColumn = captureTile[1]

    let jumpRow = jumpTile[0]
    let jumpColumn = jumpTile[1]
    
    if (jumpRow < 0 || jumpRow > 7) return false
    if (jumpColumn < 0 || jumpColumn > 7) return false

    if ((turn === 'playerOne') && (currentGameState[jumpRow][jumpColumn] === 0) && (currentGameState[captureRow][captureColumn] < 0)) {
        return true
    }

    if ((turn === 'playerTwo') && (currentGameState[jumpRow][jumpColumn] === 0) && (currentGameState[captureRow][captureColumn] > 0)) {
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

    if (pieceType === 1) {
        if (moveUpLeft) moveList.push(upLeft)
        if (moveUpRight) moveList.push(upRight)
    } else if (pieceType === -1) {
        if (moveDownLeft) moveList.push(downLeft)
        if (moveDownRight) moveList.push(downRight)
    } else if ((pieceType === 2) || (pieceType === -2)) {
        if (moveUpLeft) moveList.push(upLeft)
        if (moveUpRight) moveList.push(upRight)
        if (moveDownLeft) moveList.push(downLeft)
        if (moveDownRight) moveList.push(downRight)
    }   

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

let newGameButton = document.querySelector('button')
newGameButton.addEventListener('click', resetGame)

function resetGame(eventObj) {
    document.location.reload()
}