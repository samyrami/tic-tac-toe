const board = [
    ['','',''],
    ['','',''],
    ['','','']
];

let turn = 0;
const boardContainer = document.querySelector("#board");
const player = document.querySelector("#player");

startGame();

function startGame(){
    renderBoard();
    turn = Math.random() <= 0.5 ? 0 : 1;

    renderCurrentPlayer();

    if(turn ==  0){
        playerPlays();
    } else {
        PCPlays();
    }
}

function playerPlays(){
    const cells = document.querySelectorAll(".cell");

    cells.forEach((cell, i) => {
        const column = i % 3;
        const row = parseInt(i / 3);

        if(board[row][column] == ""){
            cell.addEventListener("click", function onClick(e){
                board[row][column] = "O";
                cell.textContent = board[row][column];
                cell.removeEventListener("click", onClick);

                turn = 1;
                const won = checkIfWinner();

                if(won == "None"){
                    PCPlays();
                    return;
                }

                if(won == "Draw"){
                    renderDraw();
                    return;
                }

                if(won == "User Won"){
                    renderWin("User");
                    return;
                }
            });
        }
    });
}

function PCPlays(){
    renderCurrentPlayer();

    setTimeout(() => {
        let played = false;
        const options = checkIfCanWin();

        if(options.length > 0){
            const bestOption = options[0];
            for(let i = 0; i < bestOption.length; i++){
                if(bestOption[i].value == 0){
                    const posI = bestOption[i].i;
                    const posJ = bestOption[i].j;
                    board[posI][posJ] = "X";
                    played = true;
                    break;
                }
            }
        } else {
            for(let i = 0; i < board.length; i++){
                for(let j = 0; j < board[i].length; j++){
                    if(board[i][j] == "" && !played){
                        board[i][j] = "X";
                        played = true;
                        break;
                    }
                }
            }
        }
        const won = checkIfWinner();

        turn = 0;
        renderBoard();
        renderCurrentPlayer();

        if(won == "None"){
            playerPlays();
            return;
        }
        if(won == "Draw"){
            renderDraw();
            return;
        }

        if(won == "PC Won"){
            renderWin("PC");
            return;
        }
    }, 1000);
}

function renderDraw(){
    player.textContent = "Draw";
}

function renderWin(winner){
    player.textContent = `${winner} Wins`;
}

function checkIfCanWin(){
    const arr = JSON.parse(JSON.stringify(board));

    for(let i = 0; i < arr.length; i++){
        for(let j = 0; j < arr[i].length; j++){
            if (arr[i][j] == "X"){
                arr[i][j] = {value: 1, i, j};
            }
            if (arr[i][j] == ""){
                arr[i][j] = {value: 0, i, j};
            }
            if(arr[i][j] == "O"){
                arr[i][j] = {value: -2, i, j};
            }
        }
    }

    const lines = [
        [arr[0][0], arr[0][1], arr[0][2]],
        [arr[1][0], arr[1][1], arr[1][2]],
        [arr[2][0], arr[2][1], arr[2][2]],
        [arr[0][0], arr[1][0], arr[2][0]],
        [arr[0][1], arr[1][1], arr[2][1]],
        [arr[0][2], arr[1][2], arr[2][2]],
        [arr[0][0], arr[1][1], arr[2][2]],
        [arr[0][2], arr[1][1], arr[2][0]],
    ];

    return lines.filter(line => (
        line[0].value + line[1].value + line[2].value == 2 ||
        line[0].value + line[1].value + line[2].value == -4
    ));
}

function checkIfWinner(){
    const lines = [
        [board[0][0], board[0][1], board[0][2]],
        [board[1][0], board[1][1], board[1][2]],
        [board[2][0], board[2][1], board[2][2]],
        [board[0][0], board[1][0], board[2][0]],
        [board[0][1], board[1][1], board[2][1]],
        [board[0][2], board[1][2], board[2][2]],
        [board[0][0], board[1][1], board[2][2]],
        [board[0][2], board[1][1], board[2][0]],
    ];

    const result = lines.filter(line => (
        line[0] + line[1] + line[2] == "XXX" || 
        line[0] + line[1] + line[2] == "OOO"
    ));

    if(result.length > 0){
        if (result[0][0] == "X"){
            player.textContent = "PC Wins";
            return "PC Won";
        } else {
            player.textContent = "User Wins";
            return "User Won";
        }
    } else {
        let draw = true;
        for(let i = 0; i < board.length; i++){
            for(let j = 0; j < board[i].length; j++){
                if (board[i][j] == ""){
                    draw = false;
                }
            }
        }
        return draw ? "Draw" : "None";
    }
}

function renderCurrentPlayer(){
    player.textContent = `${turn == 0 ? "player turn" : "PC turn"}`;
}

function renderBoard(){
    const html = board.map(row => {
        const cells = row.map(cell => {
            return `<button class="cell">${cell}</button>`;
        });
        return `<div class="row">${cells.join("")}</div>`;
    });

    boardContainer.innerHTML = html.join("");
}

const againButton = document.querySelector("#again_buttom");

againButton.addEventListener("click", resetGame);

function resetGame() {
    // Resetear el tablero
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            board[i][j] = "";
        }
    }
    // Resetear el turno
    turn = Math.random() <= 0.5 ? 0 : 1;

    // Renderizar el tablero y el jugador actual
    renderBoard();
    renderCurrentPlayer();

    // Iniciar el juego nuevamente
    if (turn == 0) {
        playerPlays();
    } else {
        PCPlays();
    }
}
