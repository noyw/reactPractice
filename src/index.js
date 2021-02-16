import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(index) {

        return (
            <Square
                key={index}
                value={this.props.squares[index]}
                onClick={() => this.props.onClick(index)}
            />
        );
    }

    renderColumns(row) {
        const cols = [];

        for (let col = 0; col < 3; col++) {
            cols.push(
                this.renderSquare((row * 3) + col)
            );
        }

        return cols;
    }

    render() {
        const board = [];

        for (let row = 0; row < 3; row++) {
            board.push(
                <div key={row} className='board-row' >{this.renderColumns(row)}</div>
            );
        }

        return (
            <div>
                {board}
            </div >
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                col: null,
                row: null,
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[this.state.stepNumber];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';

        let col = (i % 3 === 0) ? '1' : (i % 3 === 1) ? '2' : '3';
        let row = (i < 3) ? '1' : (i < 6) ? '2' : '3';

        this.setState({
            history: history.concat([{
                squares: squares,
                col: col,
                row: row,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ? 'Go to move #' + move + ' (' + step.col + ', ' + step.row + ')' : 'Go to game start';
            const style = (move === this.state.stepNumber) ? "bold" : "normal";

            return (
                <li key={move}>
                    <button style={{ fontWeight: style }} onClick={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            );
        })


        let status;

        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
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
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

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
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}