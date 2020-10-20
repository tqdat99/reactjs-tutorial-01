import React, { useState } from "react";
import { calculateWinner } from "../helper";
import { isDraw } from "../helper";
import Board from "./Board";

function Game(props) {
    const [history, setHistory] = useState([{ squares: Array(9).fill(null) }]);
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);
    const [sorted, setSorted] = useState(true);


    const handleClick = (i) => {
        const squareLocations = [
            [1, 1],
            [2, 1],
            [3, 1],
            [1, 2],
            [2, 2],
            [3, 2],
            [1, 3],
            [2, 3],
            [3, 3]
        ];


        const historyPoint = history.slice(0, stepNumber + 1);
        const current = historyPoint[historyPoint.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = xIsNext ? 'X' : 'O';
        setHistory(
            historyPoint.concat([
                {
                    squares: squares,
                    locations: squareLocations[i]
                }
            ]));
        setStepNumber(historyPoint.length);
        setXIsNext(!xIsNext);


    }

    const jumpTo = (step) => {
        const squareElements = document.getElementsByClassName('square');
        for (let i = 0; i < squareElements.length; i++) {
            squareElements[i].style.background = null;
        }

        const moveElements = document.getElementsByClassName('moves');

        for (let i = 0; i < moveElements.length; i++) {
            moveElements[i].style.background = null;
        }

        moveElements[step].style.background = 'darkgray';

        setStepNumber(step);
        setXIsNext((step % 2) === 0);

    }

    const sortHistory = () => {
        setSorted(!sorted);
    }

    const historyPoint = history;
    const current = historyPoint[stepNumber];
    const winner = calculateWinner(current.squares);
    const draw = isDraw(current.squares);

    const renderMoves = () =>
        historyPoint.map((step, move) => {
            let numberOfStep;

            if (sorted) {
                numberOfStep = stepNumber;
                move = numberOfStep - move;
            }

            if (move >= 0) {
                const desc = (move) ? 'Go to move #' + (move) + '(' + historyPoint[move].locations + ')' : 'Go to game start';
                return (
                    <tr key={move}>
                        <td>{move}</td>
                        <td>
                            <button name={move} className="moves" onClick={() => jumpTo(move)}>
                                {desc}
                            </button>
                        </td>
                    </tr>
                );
            }
        });

    let status;
    if (draw) {
        status = "Draw!";
    }
    else if (winner) {
        status = "Winner: " + winner.winner;
        const squareElements = document.getElementsByClassName('square');
        squareElements[winner.winSquares.a].style.background = 'lightgreen';
        squareElements[winner.winSquares.b].style.background = 'lightgreen';
        squareElements[winner.winSquares.c].style.background = 'lightgreen';
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O");
    }

    const sortButton = () => {
        if (sorted) {
            return (
                <button onClick={() => sortHistory()}>Sort Descending</button>
            );
        } else {
            return (
                <button onClick={() => sortHistory()}>Sort Ascending</button>
            );
        }
    }

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    squares={current.squares}
                    onClick={(i) => handleClick(i)}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <div>
                    {sortButton()}
                </div>
                <div>
                    {renderMoves()}
                </div>
            </div>
        </div>
    );
}

export default Game;
