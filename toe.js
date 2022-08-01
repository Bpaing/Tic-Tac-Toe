const Player = (mark) => {
    let _mark = mark;
    const getMark = () => _mark;
    return {getMark};
}

const gameboard = (() => {
    let _board = Array(9).fill('');

    const addMark = (mark, index) => {
            _board[index] = mark;
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
        document.querySelector('#game').replaceChildren(ul);
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

    return {
        generate, 
        refresh
    };
})();

const gameController = (() => {
    let _playerOne = Player('X');
    let _playerTwo = Player('O');
    let _currentTurn = _playerOne;

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
            alert(`${_outcome.mark} wins.`);
        
        if (_filledSpaces == board.length && !_outcome.hasWinner)
            alert('draw.');

    }

    const _changeTurn = () => {
        _currentTurn = (_currentTurn == _playerOne) ? _playerTwo : _playerOne;
    }

    const _fillTile = (tile) => {
        const index = tile.dataset.index;
        if (gameboard.getBoard()[index] != '') { return; }
        gameboard.addMark(_currentTurn.getMark(), index);
        console.log(_filledSpaces);
        displayController.refresh();
    }

    const _playTurn = (tile) => {
        //prevent play after win
        if (_outcome.hasWinner) { return; }

        _fillTile(tile);
        _checkForWin();
        _changeTurn();
    }

    const reset = () => {
        gameboard.reset();
        displayController.refresh();
        _filledSpaces = 0;
        _outcome.hasWinner = false;
        _outcome.mark = '';
    }

    const startGame = () => {
        displayController.generate();
        const tiles = [...document.querySelector('ul').children];
        tiles.forEach(elem => elem.addEventListener('click', _playTurn.bind(this, elem)));
    }

    return {startGame, reset};
})();

const menuController = (() => {
    const _generateButtons = () => {
        const menu = document.querySelector('#menu');
        menu.replaceChildren();

        const reselect = document.createElement('button');
        reselect.textContent = 'reselect';
        reselect.addEventListener('click', playerSelection);

        const restart = document.createElement('button');
        restart.textContent = 'restart';
        restart.addEventListener('click', gameController.reset);

        menu.append(reselect);
        menu.append(restart);
    }

    const _setupGame = (numberOfPlayers) => {
        console.log(numberOfPlayers);
        gameController.startGame();
        _generateButtons();
    }

    const playerSelection = () => {
        const body = document.body;
        body.replaceChildren();
        const menu = document.createElement('div');
        menu.id = 'menu';
        const game = document.createElement('div')
        game.id = 'game';
        body.append(menu);
        body.append(game);

        const h1 = document.createElement('h1');
        h1.textContent = "How many players?"
        menu.append(h1);

        for (let i = 0; i < 2; i++) {
            const button = document.createElement('button');
            button.textContent = `${i+1} player`;
            button.dataset.num = i+1;
            button.addEventListener('click', _setupGame.bind(this,button.dataset.num));
            menu.append(button);
        }
    }

    return { playerSelection };
})();

menuController.playerSelection();