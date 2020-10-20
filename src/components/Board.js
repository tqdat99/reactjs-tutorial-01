import React from "react";
import Square from "./Square";

function Board(props) {
    const renderSquare = (i) => {
        return (
            <Square
                value={props.squares[i]}
                onClick={() => props.onClick(i)}
            />
        );
    }

    const renderSquares = (n) => {
        let squares = [];
        for (let i = n; i < n + 3; i++) {
            squares.push(renderSquare(i));
        }
        return squares;
    }

    const renderRows = (i) => {
        return <div className="board-row">{renderSquares(i)}</div>;
    }

    return (
        <div>
            {renderRows(0)}
            {renderRows(3)}
            {renderRows(6)}
        </div>
    );
}

export default Board;