import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {
//
//     render() {
//         return (
//             // stateをセットする
//             <button className="square" onClick={() => this.props.onClick()}>
//                 {/*　valueを表示 */}
//                 {this.props.value}
//             </button>
//         );
//     }
// }

//関数コンポーネント
function Square(props) {
    return (
        <button className={
            props.isHighlight ? 'square highlight-color' : 'square'
        }
                onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    // constructor(props) {
    //     super(props);
    //     // state->squaresにnull配列をセット
    //     this.state = {
    //         squares: Array(9).fill(null),
    //         xIsNext: true,
    //     }
    // }

    // Squareコンポーネントに値を渡す
    renderSquare(i) {
        {/* マス目がクリックされた場合Squareから呼び出される*/
        }
        return <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            isHighlight={this.props.winLine.includes(i)}
            key={i}
        />;
    }

    render() {

        const sq = 3;

        let div_list = [];

        for (let c = 0; c < Math.pow(sq, 2); c += sq) {
            let row = [];
            for (let r = 0; r < sq; r++) {
                row.push(this.renderSquare(c + r));
            }
            div_list.push(<div className="board-row" key={c}>{row}</div>);
        }
        ;

        return (<div>{div_list}</div>)

    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            isAsc: false,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];

        // squareのコピーを取得
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                col: (i % 3) + 1,
                row: Math.floor(i / 3) + 1,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    handleOrder() {
        this.setState({
            isAsc: !this.state.isAsc,
        })
    }


    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winnerInfo = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move + ' ( cols: ' + step.col + ' row: ' + step.row + ' ) ' :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {move === this.state.stepNumber ? <strong>{desc}</strong> : desc}
                    </button>
                </li>
            )
        });

        let status;
        let winLine = [];
        if (!winnerInfo) {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        } else if (winnerInfo === 'draw') {
            status = 'Draw';
        } else {
            status = 'Winner: ' + winnerInfo.player;
            winLine = winnerInfo.line;
        }

        const orderButton = this.state.isAsc ? 'ASC' : 'DESC';

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winLine={winLine}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div>
                        <button onClick={() => this.handleOrder()}>{orderButton}</button>
                    </div>
                    <ol>
                        {this.state.isAsc ? moves : moves.reverse()}
                    </ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game/>,
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
            return {player: squares[a], line: [a, b, c]};
        }
        if (!squares.includes(null)) {
            return 'draw';
        }
    }
    return null;
}
