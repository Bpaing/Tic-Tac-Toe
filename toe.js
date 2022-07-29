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
        } else {
            alert('This tile is already filled.');
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

    let _filledSpaces = 0;
    let _outcome = {
        hasWinner: false,
        mark: ''
    };

    const _checkRows = (board) => {
        if (_outcome.hasWinner) { return; }
        for (let i = 0; i < board.length; i+=3) {
            const win = board[i] != '' && (board[i] == board[i+1]) && (board[i] == board[i+2]);
            if(win) { 
                console.log('row win');
                _outcome.hasWinner = true;
                _outcome.mark = board[i] 
                break;
            };
        }
    }

    const _checkColumns = (board) => {
        if (_outcome.hasWinner) { return; }
        for (let i = 0; i < board.length/3; i++) {
            const win = board[i] != '' && (board[i] == board[i+3]) && (board[i] == board[i+6]);
            if(win) { 
                console.log('col win');
                _outcome.hasWinner = true;
                _outcome.mark = board[i] 
                break;
            };
        }
    }

    const _checkDiagonals = (board) => {
        if (_outcome.hasWinner) { return; }
        for (let i = 2; i < 5; i+=2) {
            const center = parseInt(board.length/2);
            const win = board[center] != '' && (board[center] == board[center-i]) && (board[center] == board[center+i]);
            if(win) { 
                console.log('diag win');
                _outcome.hasWinner = true;
                _outcome.mark = board[i] 
                break;
            };
        }
    }

    const _checkForWin = () => {
        /*
            0   1   2
            3   4   5
            6   7   8
        */
        let board = gameboard.getBoard();
        _checkRows(board);
        _checkColumns(board);
        _checkDiagonals(board);
        
        if (_outcome.hasWinner) 
            console.log(`${_outcome.mark} wins.`);
        
        if (_filledSpaces == board.length && !_outcome.hasWinner)
            console.log('draw.');

    }

    const _changeTurn = () => {
        _currentTurn = (_currentTurn == _humanPlayer) ? _aiPlayer : _humanPlayer;
    }

    const _fillTile = (tile) => {
        gameboard.addMark(_currentTurn.getMark(), tile.dataset.index);
        _filledSpaces++;
        displayController.refresh();
    }

    const _playTurn = (tile) => {
        //prevent play after win
        if (_outcome.hasWinner) { return; }

        _fillTile(tile);
        _checkForWin();
        _changeTurn();
    }

    const startGame = () => {
        displayController.generate();
        const tiles = [...document.querySelector('ul').children];
        tiles.forEach(elem => elem.addEventListener('click', _playTurn.bind(this, elem)));
    }

    return {startGame};
})();

gameController.startGame();