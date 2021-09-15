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
            if (cellValue === 1) newDivElement.className = 'piece playerOne'
            if (cellValue === 2) newDivElement.className = 'king playerOne'
            if (cellValue === -1) newDivElement.className = 'piece playerTwo'
            if (cellValue === -2) newDivElement.className = 'king playerTwo'
            let targetTile = document.getElementById(`${rowNumber}-${cellNumber}`)
            targetTile.innerHTML = ''
            if (cellValue != 0) targetTile.appendChild(newDivElement)
        })
    })
}

renderGameState(currentGameState)

let gridArea = document.querySelector('.grid')
gridArea.addEventListener('click', pieceSelector)

function pieceSelector(eventObj) {
    eventObj.target.style.borderStyle = 'double dotted'
}


// let experiementalGameState = [
//     [0, -1, 0, -1, 0, -1, 0, -1],
//     [-1, 0, -2, 0, -2, 0, -1, 0],
//     [0, -1, 0, -1, 0, -1, 0, -1],
//     [0, 0, 0, 0, 0, 0, 0, 0],
//     [0, 1, 0, 2, 0, 1, 0, 1],
//     [1, 0, 1, 0, 1, 0, 1, 0],
//     [0, 1, 0, 1, 0, 1, 0, 1],
//     [0, 0, 0, 0, 0, 0, 0, 0]
// ]

// renderGameState(experiementalGameState)

// let playerOnePiece = document.createElement("div")
// playerOnePiece.className = "piece playerOne"
// targetTile = document.getElementById("7-0")
// targetTile.appendChild(playerOnePiece)
// targetTile2 = document.getElementById("7-3")
// targetTile2.appendChild(playerOne)

// let playerOneTurn = true
// let gameOver = false
// let playerOnePieces = 16
// let playerTwoPieces = 16

// let wrapper = document.querySelector('.wrapper')

// wrapper.innerHTML = '<h1>THIS WORKS</h1>'

// grid.forEach(function(row) {
//     row.forEach(function(tile) {
        
//     })
// })

// let grid = document.querySelector('.grid')
// grid.addEventListener('click', movePiece)

// let newGameButton = document.querySelector('button')
// newGameButton.addEventListener('click', resetGame)

// let playerOneTurn = true
// let pieceInHand = false
// let pieceInHandID = null
// let currentSpot = null

// function movePiece(eventObj) {
//     targetObj = eventObj.target

//     if (targetObj.classList.contains('piece')) {
//         pieceInHand = true
//         pieceInHandID = targetObj.id
//         targetObj.style.backgroundColor = 'maroon'
//         return
//     }

//     if (pieceInHand) {
//         pieceBeingMoved = document.getElementById(pieceInHandID)
//         targetObj.appendChild(pieceBeingMoved)
//         pieceInHand = false
//         pieceBeingMoved.style.backgroundColor = 'black'
//     }
// }

// function resetGame(eventObj) {
//     document.location.reload()
// }