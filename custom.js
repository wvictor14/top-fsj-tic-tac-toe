// We have 3 components: Gameboard, Player, Cell

function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  // Create a 2d array that will represent the state of the game board
  // For this 2d array, row 0 will represent the top row and
  // column 0 will represent the left-most column.
  // This nested-loop technique is a simple and common way to create a 2d array.
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

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
    boardWithValues.forEach(element => {console.log(element)});
  };

  // checkWinner, determines if the current board has a winner
  function checkWinner() {

    // function that pulls out every 3 in a row in a board
    const winConditions = [

      // coordinates are in format of [row, column]
      // 3 across columns
      [[0,0], [1, 0], [2, 0]],
      [[0,1], [1, 1], [2, 1]],
      [[0,2], [1, 2], [2, 2]],

      // 3 across rows
      [[0,0], [0, 1], [0, 2]],
      [[1,0], [1, 1], [1, 2]],
      [[2,0], [2, 1], [2, 2]],

      // 3 across diag
      [[0,0], [1, 1], [2, 2]],
      [[0,2], [1, 1], [0, 2]]
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
    const winnerExists = winConditionsValues.some( (ele) => allEqual(ele));
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
    checkWinner
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
  function player(name, marker) {
    return {
      name,
      marker
    }
  } 

  const player1 = player('User', 'X');
  const player2 = player('Computer', 'O');

  // a round will consist of the active player placing a marker down
  // then the activeplayer will switch, and they will place a marker down
  // after each placement the game will check if a winner has occured

  function switchActivePlayer() {
    if (activePlayer == player1) {
      activePlayer=player2;
    } else {
      activePlayer=player1;
    }
  }


  function playRound(row, col) {
    game.markCell(row, col, activePlayer.marker);
    let checkIfWinnerExists=game.checkWinner();
    if (checkIfWinnerExists.exists) {
      game.displayGameboard();
      console.log('Congratulations ' + activePlayer.name, '!')
      console.log('You Won!!!')
    } else {
      switchActivePlayer();
    }
  }

  // play the game

  // initialize a game
  game = Gameboard();
  let activePlayer = player1;
  playRound(0, 0);
  playRound(1, 1);
  playRound(0, 2);
  playRound(0, 1);
  playRound(2, 0);
  playRound(2, 1);

}

GameController();
