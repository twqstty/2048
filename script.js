const boardElement = document.getElementById('board');
const restartButton = document.getElementById('restart');
const gameOverElement = document.getElementById('gameOver');

const SIZE = 4;
let board = [];
let tiles = [];
let gameEnded = false;

function createBoard() {
    boardElement.innerHTML = '';
    board = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
    tiles = [];
    gameEnded = false;
    gameOverElement.style.display = 'none';

    // Создаем фоновые ячейки
    for (let i = 0; i < SIZE * SIZE; i++) {
        const bg = document.createElement('div');
        bg.classList.add('background-cell');
        boardElement.appendChild(bg);
    }

    addNewTile();
    addNewTile();
    renderTiles();
}

function addNewTile() {
    const emptyCells = [];
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            if (!board[i][j]) {
                emptyCells.push({ i, j });
            }
        }
    }

    if (emptyCells.length > 0) {
        const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const value = Math.random() < 0.9 ? 2 : 4;
        const tile = createTile(i, j, value);
        board[i][j] = tile;
        tiles.push(tile);
    }
}

function createTile(i, j, value) {
    const div = document.createElement('div');
    div.classList.add('tile');
    div.textContent = value;
    div.style.backgroundColor = getCellColor(value);
    div.dataset.value = value;
    div.dataset.x = j;
    div.dataset.y = i;
    div.style.transform = `translate(${j * 110}px, ${i * 110}px)`;
    div.style.transition = 'transform 0.2s ease';

    boardElement.appendChild(div);
    return { element: div, x: j, y: i, value };
}

function updateTilePosition(tileElement, i, j) {
    tileElement.style.transform = `translate(${j * 110}px, ${i * 110}px)`;
}

function getCellColor(value) {
    const colors = {
        2: '#eee4da',
        4: '#ede0c8',
        8: '#f2b179',
        16: '#f59563',
        32: '#f67c5f',
        64: '#f65e3b',
        128: '#edcf72',
        256: '#edcc61',
        512: '#edc850',
        1024: '#edc53f',
        2048: '#edc22e'
    };
    return colors[value] || '#3c3a32';
}

function move(direction) {
    if (gameEnded) return;

    let moved = false;
    let merged = [];

    function moveTile(tile, toI, toJ) {
        board[tile.y][tile.x] = null;
        tile.x = toJ;
        tile.y = toI;
        board[toI][toJ] = tile;
        updateTilePosition(tile.element, toI, toJ);
    }

    const loop = (iStart, iEnd, iStep, jStart, jEnd, jStep) => {
        for (let i = iStart; i !== iEnd; i += iStep) {
            for (let j = jStart; j !== jEnd; j += jStep) {
                const tile = board[i][j];
                if (!tile) continue;

                let [ni, nj] = [i, j];
                while (true) {
                    const [nextI, nextJ] = getNext(ni, nj, direction);
                    if (nextI < 0 || nextI >= SIZE || nextJ < 0 || nextJ >= SIZE) break;
                    const nextTile = board[nextI][nextJ];

                    if (!nextTile) {
                        ni = nextI;
                        nj = nextJ;
                    } else if (nextTile.value === tile.value && !merged.includes(nextTile)) {
                        ni = nextI;
                        nj = nextJ;
                        merged.push(nextTile);
                        break;
                    } else {
                        break;
                    }
                }

                if (ni !== i || nj !== j) {
                    const existing = board[ni][nj];
                    if (existing && existing.value === tile.value) {
                        existing.value *= 2;
                        existing.element.textContent = existing.value;
                        existing.element.style.backgroundColor = getCellColor(existing.value);
                        existing.element.classList.add('merge');
                        setTimeout(() => existing.element.classList.remove('merge'), 200);
                        boardElement.removeChild(tile.element);
                        tiles = tiles.filter(t => t !== tile);
                        board[i][j] = null;
                        moved = true;
                    } else {
                        moveTile(tile, ni, nj);
                        moved = true;
                    }
                }
            }
        }
    };

    switch (direction) {
        case 'up': loop(1, SIZE, 1, 0, SIZE, 1); break;
        case 'down': loop(SIZE - 2, -1, -1, 0, SIZE, 1); break;
        case 'left': loop(0, SIZE, 1, 1, SIZE, 1); break;
        case 'right': loop(0, SIZE, 1, SIZE - 2, -1, -1); break;
    }

    if (moved) {
        setTimeout(() => {
            addNewTile();
            if (!hasAvailableMoves()) {
                endgame();
            }
        }, 150);
    }
}

function getNext(i, j, direction) {
    switch (direction) {
        case 'up': return [i - 1, j];
        case 'down': return [i + 1, j];
        case 'left': return [i, j - 1];
        case 'right': return [i, j + 1];
    }
}

function renderTiles() {
    tiles.forEach(tile => {
        updateTilePosition(tile.element, tile.y, tile.x);
    });
}

function hasAvailableMoves() {
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            const tile = board[i][j];
            if (!tile) return true;

            const directions = ['up', 'down', 'left', 'right'];
            for (const dir of directions) {
                const [ni, nj] = getNext(i, j, dir);
                if (ni >= 0 && ni < SIZE && nj >= 0 && nj < SIZE) {
                    const neighbor = board[ni][nj];
                    if (!neighbor || neighbor.value === tile.value) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

function endgame() {
    gameEnded = true;
    gameOverElement.style.display = 'flex';
}

document.addEventListener('keydown', (e) => {
    const keyMap = {
        'ArrowUp': 'up',
        'w': 'up', 'ц': 'up',
        'ArrowDown': 'down',
        's': 'down', 'ы': 'down',
        'ArrowLeft': 'left',
        'a': 'left', 'ф': 'left',
        'ArrowRight': 'right',
        'd': 'right', 'в': 'right',
    };
    const direction = keyMap[e.key.toLowerCase()];
    if (direction) move(direction);
});

restartButton.addEventListener('click', createBoard);

createBoard();
