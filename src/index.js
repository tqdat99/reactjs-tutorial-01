import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'



function Square(props) {
    return (
        <button className="square"
            onClick={() => props.onClick()}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    renderSquares(n) {
        let squares = [];
        for (let i = n; i < n + 3; i++) {
            squares.push(this.renderSquare(i));
        }
        return squares;
    }

    renderRows(i) {
        return <div className="board-row">{this.renderSquares(i)}</div>;
    }

    render() {
        return (
            <div>
                {this.renderRows(0)}
                {this.renderRows(3)}
                {this.renderRows(6)}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null)
                }
            ],
            stepNumber: 0,
            xIsNext: true
        };
    }

    handleClick(i) {
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

        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([
                {
                    squares: squares,
                    locations: squareLocations[i]
                }
            ]),
            lastStep: i,
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        const squareElements = document.getElementsByClassName('square');
        for (let i = 0; i < squareElements.length; i++) {
            squareElements[i].style.background = null;
        }

        const moveElements = document.getElementsByClassName('moves');

        for (let i = 0; i < moveElements.length; i++) {
            moveElements[i].style.background = null;
        }

        moveElements[step].style.background = 'darkgray';

        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });

    }

    sortHistory() {
        this.setState({
            sorted: !this.state.sorted,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const draw = isDraw(current.squares);

        const moves = history.map((step, move) => {
            let numberOfStep;

            if (this.state.sorted) {
                numberOfStep = this.state.stepNumber;
                move = numberOfStep - move;
            }

            if (move >= 0) {
                const desc = (move) ? 'Go to move #' + (move) + '(' + history[move].locations + ')' : 'Go to game start';
                return (
                    <tr key={move}>
                        <td>{move}</td>
                        <td>
                            <button name={move} className="moves" onClick={() => this.jumpTo(move)}>
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
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }

        const sortButton = () => {
            if (this.state.wasSorted) {
                return (
                    <button onClick={() => this.sortHistory()}> Sort Descending</button>
                );
            } else {
                return (
                    <button onClick={() => this.sortHistory()}> Sort Ascending</button>
                );
            }
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div>
                        {sortButton()}
                    </div>
                    <div>
                        {moves}
                    </div>
                </div>
            </div>
        );
    }
}

function isDraw(squares) {
    for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
            return false;
        }
    }
    return true;
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    let result = {
        winner: null,
        winSquares: {
            a: null,
            b: null,
            c: null,
        }
    }

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            result.winner = squares[a];
            result.winSquares = { a, b, c };
            return result;
        }
    }
    return null;
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
