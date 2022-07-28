const Player = (mark) => {
    let _mark = mark;
    const getMark = () => _mark;
    return {getMark};
}

const gameboard = (() => {
    let _board = Array(9).fill('');

    const addMark = (mark, index) => {
        if(_board[index] == '') {
            _board[index] = mark;
        }
    }

    const getBoard = () => _board;

    const reset = () => {
        _board.fill('');
    }

    return {addMark, getBoard, reset};
})();

const displayController = (() => {
    const generate = () => {
        const ul = document.createElement('ul');
        ul.classList.add('board');
        document.body.replaceChildren(ul);
        for (let i = 0; i < 9; i++) {
            const li = document.createElement('li');
            li.classList.add('tile');
            li.dataset.index = i;
            ul.appendChild(li);
        }
    }

    const refresh = () => {
        const tiles = [...document.querySelector('.board').children];
        const board = gameboard.getBoard();
        for (let i = 0; i < tiles.length; i++) {
            tiles[i].textContent = board[i];
        }
    }

    const reset = () => {
        const ul = document.querySelector('ul');
        [...ul.children].forEach(li => li.textContent='');
    }

    return {
        generate, 
        refresh, 
        reset
    };
})();

const gameController = (() => {
    let _humanPlayer = Player('X');
    let _aiPlayer = Player('O');
    let _currentTurn = _humanPlayer;

    const _fillTile = (tile) => {
        gameboard.addMark(_currentTurn.getMark(), tile.dataset.index);
        displayController.refresh();
    }

    const startGame = () => {
        displayController.generate();
        const tiles = [...document.querySelector('ul').children];
        tiles.forEach(elem => elem.addEventListener('click', _fillTile.bind(this, elem)));
    }

    const checkForWin = () => {
        /*
            0   1   2
            3   4   5
            6   7   8
        */
        let mark = '';

        //check rows
        for (let i = 0; i < board.length; i+3) {
            const win = (board[i] == board[i+1]) && (board[i] == board[i+2]);
            if(win) { mark = board[i] };
        }

        //check columns
        for (let i = 0; i < board.length/3; i++) {
            const win = (board[i] == board[i+3]) && (board[i] == board[i+6]);
            if(win) { mark = board[i] };
        }

        // check diagonals
        for (let i = 2; i < 5; i+2) {
            const center = board.length/2;
            const win = (board[center] == board[center + i]) && (board[i] == board[center - i]);
            if(win) { mark = board[i] };
        }
    }

    return {startGame};
})();

gameController.startGame();