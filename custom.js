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

      }
      console.log(row);
    }
  };

  // interface to interact with the board
  return {
    getGameboard,
    markCell,
    displayGameboard
  };
}

// A cell contains a value which is either 0: no player has marked it yet, 1: 
// it has an X, and 2: it has an O
function Cell(marker) {
  let value = 0;

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