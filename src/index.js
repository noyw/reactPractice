import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import './index.css';

function Square(props) {
    return (
        <button className={'square ' + props.style} onClick={props.onClick}>
            {props.value}
        </button >
    );
}

class Board extends React.Component {
    renderSquare(index) {
        let style;

        if (this.props.lines) {
            style = this.props.lines.includes(index) ? " highlight-yellow" : null;
        }

        return (
            <Square
                key={index}
                style={style}
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
            orderIsAscending: true
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

    orderBy() {
        this.setState({
            orderIsAscending: !this.state.orderIsAscending,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const lines = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const moveAftOrderby = this.state.orderIsAscending ? move : (history.length - 1 - move);
            const stepAftOrderby = this.state.orderIsAscending ? step : (history[history.length - 1 - move]);

            const desc = moveAftOrderby ? 'Go to move #' + moveAftOrderby + ' (' + stepAftOrderby.col + ', ' + stepAftOrderby.row + ')' : 'Go to game start';
            const style = (moveAftOrderby === this.state.stepNumber) ? "bold" : "normal";

            return (
                <li key={moveAftOrderby}>
                    <Button variant='outline-primary' size='sm' style={{ fontWeight: style }} onClick={() => this.jumpTo(moveAftOrderby)}>
                        {desc}
                    </Button>
                </li>
            );
        })

        let status;

        if (lines) {
            status = 'Winner: ' + current.squares[lines[0]];
        } else {
            if (this.state.stepNumber === 9) {
                status = 'Draw the game';
            } else {
                status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
            }
        }

        let orderBy;

        if (this.state.orderIsAscending) {
            orderBy = 'orderby desc'
        } else {
            orderBy = 'orderby asc'
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        lines={lines}
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <Button variant='outline-primary' size='sm' onClick={() => this.orderBy()}>
                        {orderBy}
                    </Button>
                    <ol>{moves}</ol>
                </div>
            </div >
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
            return lines[i];
        }
    }
    return null;
}