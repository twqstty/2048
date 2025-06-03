const boardElement = document.getElementById('board');
const restartButton = document.getElementById('restart');

const SIZE = 4;
let board = [];

// Создаем пустое игровое поле
function createBoard() {
    board = [];
    for (let i = 0; i < SIZE; i++) {
        board[i] = [];
        for (let j = 0; j < SIZE; j++) {
            board[i][j] = 0;
        }
    }
    addNewTile();
    addNewTile();
    renderBoard();
}

// Добавляем новый элемент на поле
function addNewTile() {
    const emptyCells = [];
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            if (board[i][j] === 0) {
                emptyCells.push({ i, j });
            }
        }
    }
    if (emptyCells.length > 0) {
        const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
}

// Отображаем поле
function renderBoard() {
    boardElement.innerHTML = '';
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            const cell = document.createElement('div');
            cell.classList.add('game-cell');
            if (board[i][j] !== 0) {
                cell.textContent = board[i][j];
                cell.style.backgroundColor = getCellColor(board[i][j]);
            }
            boardElement.appendChild(cell);
        }
    }
}

// Цвета для различных значений
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

// Управление движением плиток
function move(direction) {
    let moved = false;
    switch (direction) {
        case 'up':
            moved = moveUp();
            break;
        case 'down':
            moved = moveDown();
            break;
        case 'left':
            moved = moveLeft();
            break;
        case 'right':
            moved = moveRight();
            break;
    }

    if (moved) {
        addNewTile();
        renderBoard();
    }
}

// Движение вверх
function moveUp() {
    let moved = false;
    for (let j = 0; j < SIZE; j++) {
        const column = [];
        for (let i = 0; i < SIZE; i++) {
            if (board[i][j] !== 0) column.push(board[i][j]);
        }
        const newColumn = merge(column);
        for (let i = 0; i < SIZE; i++) {
            board[i][j] = newColumn[i] || 0;
        }
        if (!arraysEqual(column, newColumn)) moved = true;
    }
    return moved;
}

// Движение вниз
function moveDown() {
    let moved = false;
    for (let j = 0; j < SIZE; j++) {
        const column = [];
        for (let i = SIZE - 1; i >= 0; i--) {
            if (board[i][j] !== 0) column.push(board[i][j]);
        }
        const newColumn = merge(column.reverse());
        for (let i = SIZE - 1; i >= 0; i--) {
            board[i][j] = newColumn[SIZE - i - 1] || 0;
        }
        if (!arraysEqual(column, newColumn.reverse())) moved = true;
    }
    return moved;
}

// Движение влево
function moveLeft() {
    let moved = false;
    for (let i = 0; i < SIZE; i++) {
        const row = [];
        for (let j = 0; j < SIZE; j++) {
            if (board[i][j] !== 0) row.push(board[i][j]);
        }
        const newRow = merge(row);
        for (let j = 0; j < SIZE; j++) {
            board[i][j] = newRow[j] || 0;
        }
        if (!arraysEqual(row, newRow)) moved = true;
    }
    return moved;
}

// Движение вправо
function moveRight() {
    let moved = false;
    for (let i = 0; i < SIZE; i++) {
        const row = [];
        for (let j = SIZE - 1; j >= 0; j--) {
            if (board[i][j] !== 0) row.push(board[i][j]);
        }
        const newRow = merge(row.reverse());
        for (let j = SIZE - 1; j >= 0; j--) {
            board[i][j] = newRow[SIZE - j - 1] || 0;
        }
        if (!arraysEqual(row, newRow.reverse())) moved = true;
    }
    return moved;
}

// Слияние плиток
function merge(arr) {
    const newArr = [];
    let i = 0;
    while (i < arr.length) {
        if (arr[i] === arr[i + 1]) {
            newArr.push(arr[i] * 2);
            i += 2;
        } else {
            newArr.push(arr[i]);
            i++;
        }
    }
    return newArr;
}

// Сравнение массивов
function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

// Слушаем клавиши
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            move('up');
            break;
        case 'ArrowDown':
            move('down');
            break;
        case 'ArrowLeft':
            move('left');
            break;
        case 'ArrowRight':
            move('right');
            break;
    }
});

restartButton.addEventListener('click', createBoard);

// Инициализация игры
createBoard();
