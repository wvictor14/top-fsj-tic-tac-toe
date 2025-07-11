// We have 3 components: Gameboard, Player, Cell

function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  // Create a 2d array that will represent the state of the game board
  // For this 2d array, row 0 will represent the top row and
  // column 0 will represent the left-most column.
  // This nested-loop technique is a simple and common way to create a 2d array.
  const newBoard = () => {
    board.length = 0;
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push(Cell());
      }
    }
  }
  newBoard();


  // getGameboard, return the array to work with in dom
  const getGameboard = () => board;

  //markCell, play a round by marking a cell in the gameboard
  const markCell = (row, column, player) => {

    // do not overwrite cells with existing markers
    if (board[row][column].getValue() == '') {
      board[row][column].addMarker(player);
      return true;
    } else {
      // if not an empty cell return false
      console.log('This cell already has a marker in it!')
      return false;
    };
  }

  //displayGameboard, to visualize the board in console
  const displayGameboard = () => {
    const boardWithValues = board.map(
      (row) => row.map(
        (col) => col.getValue()
      )
    )
    boardWithValues.forEach(element => { console.log(element) });
  };

  // checkWinner, determines if the current board has a winner
  function checkWinner() {

    // function that pulls out every 3 in a row in a board
    const winConditions = [

      // coordinates are in format of [row, column]
      // 3 across columns
      [[0, 0], [1, 0], [2, 0]],
      [[0, 1], [1, 1], [2, 1]],
      [[0, 2], [1, 2], [2, 2]],

      // 3 across rows
      [[0, 0], [0, 1], [0, 2]],
      [[1, 0], [1, 1], [1, 2]],
      [[2, 0], [2, 1], [2, 2]],

      // 3 across diag
      [[0, 0], [1, 1], [2, 2]],
      [[2, 0], [1, 1], [0, 2]]
    ];

    // iterate across each winning condition coordinates
    // checking if the board has all one symbol
    let winConditionsValues = [];

    // iterate across every possible win condition
    for (const cond of winConditions) {
      let array = [];

      // get the value of each coordinate of each win condition and put in array
      for (const coord of cond) {

        array.push(
          board[coord[0]][coord[1]].getValue()
        );
      }
      winConditionsValues.push(array);
    }

    // now check if the values in each winCondition are all the same

    // get the index of the winner
    // return the winning index and pattern
    function allEqual(array) {
      return array.every((x, i, a) => x === a[0] && a[0] != '')
    }
    // const winners = winConditionsValues.map((cond) => allEqual(cond));
    const winnerExists = winConditionsValues.some((ele) => allEqual(ele));
    const winnerIndex = winConditionsValues.findIndex((ele) => allEqual(ele));
    const winnerPattern = winConditionsValues.filter((ele) => allEqual(ele));
    const winnerCoordinates = winConditions[winnerIndex];

    return {
      exists: winnerExists,
      coordinates: winnerCoordinates,
      pattern: winnerPattern
    };

  }

  // interface to interact with the board
  return {
    getGameboard,
    markCell,
    displayGameboard,
    checkWinner,
    reset: newBoard
  };
}

// A cell contains a value which is it's content
function Cell(marker) {
  let value = '';

  // Accept a player's token to change the value of the cell
  const addMarker = (marker) => {
    value = marker;
  };

  // How we will retrieve the current value of this cell through closure
  const getValue = () => value;

  return {
    addMarker,
    getValue
  };
}

// game = Gameboard();
// game.markCell(0, 1, 'o');
// game.markCell(1, 1, 'o');
// game.markCell(2, 1, 'o');
// game.displayGameboard();
// console.log(game.checkWinner());

// GameController controls the game
function GameController() {

  // play a round
  // a round consists of each player marking a cell each
  // then checking if a winner exists
  // if exists end the game, declare winner
  // ask to play again
  // if not exists, then play another round


  // we need to instantiate two players
  function player(name, marker, player) {
    return {
      name,
      marker,
      player
    }
  }

  const player1 = player('Pikachu', 'X', 'player1');
  const player2 = player('Bulbasaur', 'O', 'player2');

  // a round will consist of the active player placing a marker down
  // then the activeplayer will switch, and they will place a marker down
  // after each placement the game will check if a winner has occured

  function switchActivePlayer() {
    if (activePlayer == player1) {
      activePlayer = player2;
    } else {
      activePlayer = player1;
    }
  }

  function getActivePlayer() {
    return activePlayer;
  }
  function getRound() {
    return roundCounter;
  }

  function playRound(row, col) {
    console.log('Round: ' + roundCounter);
    console.log(
      'Active Player: ' + activePlayer.name + ', ' + activePlayer.marker
    )

    // we assign output of markCell here, which is a boolean value that is
    // true if the cell was marked (it was empty to start with), and 
    // false if it was already marked
    // if false, then the activePlayer will remain active
    let markedCell = board.markCell(row, col, activePlayer.marker);
    let checkIfWinnerExists = board.checkWinner();

    if (checkIfWinnerExists.exists) {
      console.log('Congratulations ' + activePlayer.name, '!')
      console.log('You Won!!!')

      board.displayGameboard();
      console.log(checkIfWinnerExists.coordinates);

      // end game
      // start new game
      console.log('Start a new game? ...')
      continueGame = false;

    } else if (markedCell) {
      if (anyEmpty()) {
        switchActivePlayer();
        roundCounter++;
      } else {
        console.log('a Tie!');
        continueGame = false;
      }
    }
  }

  // check if game is tie
  // returns true if any empty cells remain
  function anyEmpty() {
    let gameboard = board.getGameboard();

    // any row has a cell that is empty
    let byRow = gameboard.map(ele => ele.map(cell => cell.getValue()).includes(''));

    return byRow.includes(true);
  }

  // reset
  function newGame() {
    board.reset();
    roundCounter = 1;
    activePlayer = player1;
    continueGame = true;
  }

  // initialize a game
  const board = Gameboard();
  let activePlayer = player1;
  let roundCounter = 1;
  let continueGame = true;

  const keepPlaying = () => continueGame;

  // we want to give access to all board functions from gamecontroller
  // so that screen can interact with the board
  return Object.assign(
    {},
    board,
    {
      playRound,
      getActivePlayer,
      player1,
      player2,
      keepPlaying,
      anyEmpty,
      newGame,
      getRound
    }
  )
}

// let game = GameController();
// game.getActivePlayer();
// game.playRound(0, 1);
// game.playRound(0, 1); // try to fill a marked cell
// game.playRound(0, 2); // activePlayer should not change, should be still "O"
// game.playRound(1, 1);
// game.playRound(1, 2);
// game.playRound(2, 1);


// screenController
// it will get the state of the game, and update the screen
function screenController() {

  // start a game
  const game = GameController();
  
  // // for dev
  // game.playRound(0, 0);
  // game.playRound(2, 2); // activePlayer should not change, should be still "O"
  // game.playRound(1, 1);
  // game.playRound(1, 0);
  // game.playRound(0, 2); // activePlayer should not change, should be still "O"

  // create players div at top of page
  const activePlayerRow = document.querySelector('.active-player-row');
  player1HTML = document.createElement('div');
  player1HTML.classList.add('player1');
  player1HTML.innerHTML = game.player1.name;
  player2HTML = document.createElement('div');
  player2HTML.classList.add('player2');
  player2HTML.innerHTML = game.player2.name;
  activePlayerRow.append(player1HTML);
  activePlayerRow.append(player2HTML);

  const updateScreen = () => {
    const htmlBoard = document.querySelector('.board');
    htmlBoard.innerHTML = '';

    const htmlRound = document.querySelector('.round');
    const board = game.getGameboard();

    htmlRound.innerHTML = 'Round: ' + game.getRound();

    // change class of active-player
    let activePlayer = game.getActivePlayer().player;
    if (activePlayer == 'player1') {
      player2HTML.classList.remove('active-player')
      player1HTML.classList.add('active-player')
    } else {
      player1HTML.classList.remove('active-player')
      player2HTML.classList.add('active-player')
    }

    // here we create a bunch of divs mirroring the board
    // each cell also has coordinates
    // which will be used to update each cell
    for (let i = 0; i < 3; i++) {
      let rowDiv = document.createElement('div');
      rowDiv.classList.add('row');
      rowDiv.setAttribute('data-row', i);

      for (let j = 0; j < 3; j++) {
        let cell = document.createElement('button');
        cell.classList.add('cell', 'btn');
        cell.setAttribute('data-row', i);
        cell.setAttribute('data-col', j);

        // add the value
        let cellValue = board[i][j].getValue();
        cell.innerHTML = cellValue;

        // add an eventListener
        if (cellValue == '') {
          cell.classList.add('not-marked-yet');

          // add class active-player to activate proper color on hover
          cell.classList.add(activePlayer);
          cell.classList.add('active-player');
          cell.addEventListener("click", mark);

          (activePlayer == 'player1') ? cell.classList.add('player1') : cell.classList.add('player2');

        } else {
          cell.classList.add('marked');
        }

        rowDiv.appendChild(cell);
      }
      htmlBoard.appendChild(rowDiv);
    }
    console.log(board[1][1].getValue());
    // event handler for a click on a cell
    // get the cell coordinates
    // play a round 
    // update screen
    function mark(event) {
      const row = event.target.getAttribute('data-row');
      const col = event.target.getAttribute('data-col');

      game.playRound(row, col);
      updateScreen();
      console.log(game.keepPlaying());

      // when game is over announce the winner
      // display the winning pattern
      if (!game.keepPlaying()) {

        if (game.checkWinner().exists) {

          // highlight the winning cells
          let winnerCoordinates = game.checkWinner().coordinates;
          for (let i = 0; i < 3; i++) {
            let cell = winnerCoordinates[i];
            
            const cellHTML = document.querySelector(
              `button[data-row="${cell[0]}"][data-col="${cell[1]}"]`
            );
            let activePlayer = game.getActivePlayer().player;
            cellHTML.classList.add(activePlayer)
            cellHTML.classList.add('winning-cell')

          }

          // write the message
          let winnerName = document.createElement('h1');
          winnerName.classList.add('winner-name');
          winnerName.innerHTML = game.getActivePlayer().name;

          let congrats = document.createElement('p');
          congrats.innerHTML = 'Congratulations! <br>You Win!!';

          winnerHTML.append(winnerName);
          winnerHTML.append(congrats)

        } else {
          let announcement = document.createElement('h1');
          announcement.innerHTML = "It's a TIE!";
          winnerHTML.append(announcement);
        }
      }
    }


    // winner announced 
    const winnerHTML = document.querySelector('.winner');

    // new game button
    const btnNewGame = document.querySelector('.new-game button');
    btnNewGame.addEventListener('click', function (event) {
      game.newGame();
      updateScreen();
      winnerHTML.innerHTML = '';
    });

  }

  updateScreen();
};

screenController();