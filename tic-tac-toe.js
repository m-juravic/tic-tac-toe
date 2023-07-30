"use strict";

/**
 * Tic Tac Toe
 * Player 1 and 2 alternate turns. On each turn, a player clicks a square to
 * place their piece until a player gets three in a row (horiz, vert, diag) or
 * until the board is filled (tie)
 */

let $htmlBoard = $("#board");
let $endGameMsg = $("#endGameMsg");
let $startBtn = $("#start");

let board = [];
let gameOver = false;
let restartReady = false;

let currPlayer = 1;
let player1Piece;
let player2Piece;


/** makes JS board. Set to height of 3 & width of 3 (consistent with traditional
 * tic-tac-toe game) */
function makeBoard() {
  // board = [];
  board.length = 0;
  for (let y = 0; y < 3; y++) {
    let row = [];
    for (let x = 0; x < 3; x++) {
      row.push(null);
    }
    board.push(row);
  }
}

/** make HTML 3x3 grid */
function makeHTMLBoard() {
  $htmlBoard.empty();
  const $tableBody = $("<tbody>").attr("id", "tbody");
  $htmlBoard.append($tableBody);

  for (let y = 0; y < 3; y++) {
    let $row = $("<tr>");

    for (let x = 0; x < 3; x++) {
      let $cell = $("<td>")
        .attr("data-row-idx", y)
        .attr("data-column-idx", x)
        .attr("class", "cell");

      $row.append($cell);
    }
    $tableBody.append($row);
  }
}

/** Handle clicking on a game square. If cell already played, do nothing.
 * If cell not already played:
 * - update to current player's piece
 * - check for win
 * - check for tie
 * - switch players
*/
function handleClick(evt) {
  if (gameOver) {
    return;
  }

  let $cell = $(evt.target);

  const rowIdx = $cell.data("row-idx");
  const columnIdx = $cell.data("column-idx");

  if (board[rowIdx][columnIdx] !== null) return;

  //update board array to current player at column/row of evt.target
  //update text of clicked td to current player piece
  if (currPlayer === 1) {
    board[rowIdx][columnIdx] = 1;
    $cell.text(player1Piece);
  } else {
    board[rowIdx][columnIdx] = 2;
    $cell.text(player2Piece);
  }

  if (checkForWin()) {
    gameOver = true;
    let winningEmoji = (currPlayer === 1) ? player1Piece : player2Piece;

    return endGame(`Player ${winningEmoji} wins!`);
  }

  if (board.every(r => r.every(c => c !== null))) {
    endGame('The game is a 👔');
  }

  currPlayer = (currPlayer === 1) ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for 3 in a row from current player
 * either with 3 in a row horizontally, vertically, diagonally left, or
 * diagonally right
*/
function checkForWin() {

  /** _win
   * takes input array of 3 cell coordinates [[y, x], [y, x], [y, x]]
   * returns true if all are legal coordinates for a cell and all cells match
   * currPlayer
   */
  function _win(cells) {
    return cells.every(([y, x]) => board[y]?.[x] === currPlayer);
  }

  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2]];
      let vert = [[y, x], [y + 1, x], [y + 2, x]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

/** endGame: announce game end */
function endGame(msg) {
  $endGameMsg.text(msg);
}

/**
 *Shows game board, updates the start button text, hides player piece select
 fields
 */
function showGameState() {
  $htmlBoard.show();
  $startBtn.show().text("Restart");
  $("#p1").hide();
  $("#p2").hide();
}

/** Shows player emoji select fields, updates restart variable to false so
 * game play state is shown, and start button text updated to start
 */
function restartGame() {
  $("#p1").show();
  $("#p2").show();
  restartReady = false;
  $startBtn.text("Start");
}

/**  Resets gameOver variable to false, if restartReady true, calls restartGame
 * otherwise then triggers to make both html & JS board and flips restartReady
 * to true */
function startGame(evt) {
  $endGameMsg.text("");
  gameOver = false;

  $htmlBoard.hide();

  if (restartReady === true) {
    restartGame();
    return;
  }

  player1Piece = $("#emoji1").val();
  player2Piece = $("#emoji2").val();

  makeBoard();
  makeHTMLBoard();

  restartReady = true;

  showGameState();
}

$("#game").on("click", "td", handleClick);
$("#start").on("click", startGame);