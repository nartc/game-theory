import { Board, number2binary, PieceProperties, Position, Turn } from './definitions';
// Tirar per fer el millor moviment
// Donar fitxa per a que l'usuari faci el pitjor moviment

export class Game {
    #board!: Board;
    #turn!: Turn;
    #winner: Turn | undefined = undefined;

    #moves: Array<Position> = [];

    constructor(starter: Turn) {
        this.#turn = starter;

        this.#board = [
            { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 },
            { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 },
            { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 3 },
            { row: 3, col: 0 }, { row: 3, col: 1 }, { row: 3, col: 2 }, { row: 3, col: 3 },
        ];

        console.log(this);
        console.log(evaluateBoard(this.#board));
    }

    get board() {
        return this.#board;
    }

    move(position: Position) {
        this.#board.splice(this.#board.findIndex((p: Position) => p.row === position.row), 0, position);
    }

    undo() {
        const lastMove = this.#moves.pop();

        if (lastMove)
            this.move({ row: lastMove.row, col: lastMove.col });
    }
}

function getPossibleMoves(board: Board): Array<Position> {
    return board.filter(p => !p.piece);
}

export function getNextMove(depth: number = 3,
    game: Game,
    alpha = Number.NEGATIVE_INFINITY,
    beta = Number.POSITIVE_INFINITY,
    isMaximizingPlayer = true): number {
    return 0;
    // Base case: evaluate board
    if (depth === 0)
        return evaluateBoard(game.board);

    // Recursive case: search possible moves
    let bestMove = null; // best move not set yet
    const possibleMoves = getPossibleMoves(game.board);

    // Set a default best move value
    let bestMoveValue = isMaximizingPlayer ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
    // Search through all possible moves
    for (let i = 0; i < possibleMoves.length; i++) {
        const move = possibleMoves[i];
        // Make the move, but undo before exiting loop
        game.move(move);
        // Recursively get the value from this move
        const value = getNextMove(depth - 1, game, alpha, beta, !isMaximizingPlayer);
        // Log the value of this move
        console.log(isMaximizingPlayer ? 'Max: ' : 'Min: ', depth, move, value,
            bestMove, bestMoveValue);

        if (isMaximizingPlayer) {
            // Look for moves that maximize position
            if (value > bestMoveValue) {
                bestMoveValue = value;
                bestMove = move;
            }
            alpha = Math.max(alpha, value);
        } else {
            // Look for moves that minimize position
            if (value < bestMoveValue) {
                bestMoveValue = value;
                bestMove = move;
            }
            beta = Math.min(beta, value);
        }
        // Undo previous move
        game.undo();
        // Check for alpha beta pruning
        if (beta <= alpha) {
            console.log('Prune', alpha, beta);
            break;
        }
    }
}

function evaluateBoard(board: Board) {
    const rows = Array.from(new Array(4), (_, i) => board.slice(i * 4, i * 4 + 4));
    const columns = Array.from(new Array(4), (_, i) => [board[i], board[i + 4], board[i + 8], board[i + 12]]);
    const diagonal1 = [board[0], board[5], board[10], board[15]];
    const diagonal2 = [board[3], board[6], board[9], board[12]];

    return rows.concat(columns).concat([diagonal1], [diagonal2])
               .map(pieces => evaluatePositions(pieces)).reduce((acc, cur) => acc + cur, 0);
}

function evaluatePositions(positions: Position[]) {
    const filledPositions = positions.filter(p => !!p.piece);

    //console.log('Evaluating:\n', filledPositions.map(p => PIECES[p.piece!]).join('\n'));

    const value = filledPositions.reduce((acc, cur) => acc & cur.piece!, filledPositions.length ? 15 : 0);

    const commonFeatures = number2binary(value)
        .padStart(4, '0')
        .split('')
        .reduce((acc: string[], cur, currentIndex) => cur === '1' ? [...acc, PieceProperties[currentIndex]] : acc, []);
    // console.log('Common features:', commonFeatures);
    return commonFeatures.length;
}
