// Game Components
const Player = (name, mark) => {
    let _name = name;
    let _mark = mark;
    const getMark = () => _mark;
    const getName = () => _name;
    return {getMark, getName};
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


// Game Logic
const gameController = (() => {
    let _playerOne = null;
    let _playerTwo = null;
    let _currentTurn = null;
    let _winner = null;
    let _filledSpaces = 0;

    const _playTurn = (tile) => {
        //prevent play after win
        if (_winner != null) { return; }

        _fillTile(tile);
        _checkForWin();
        _changeTurn();
    }

    const _fillTile = (tile) => {
        console.log('click');
        const index = tile.dataset.index;
        if (gameboard.getBoard()[index] != '') { return; }
        gameboard.addMark(_currentTurn.getMark(), index);
        console.log(_filledSpaces);
        displayController.refresh();
    }

    const _changeTurn = () => {
        _currentTurn = (_currentTurn == _playerOne) ? _playerTwo : _playerOne;
    }

    const _checkForWin = () => {
        let board = gameboard.getBoard();
        _checkRows(board);
        _checkColumns(board);
        _checkDiagonals(board);
        
        if (_winner != null) 
            alert(`${_winner.getName()} wins.`);
        else if (_filledSpaces == board.length && _winner == null)
            alert('draw.');
    }

    const _checkRows = (board) => {
        if (_winner != null) { return; }
        for (let i = 0; i < board.length; i+=3) {
            const win = board[i] != '' && (board[i] == board[i+1]) && (board[i] == board[i+2]);
            if(win) { 
                _playerOne.getMark() == board[i] ? 
                    _winner = _playerOne :
                    _winner = _playerTwo;
                break;
            }
        }
    }

    const _checkColumns = (board) => {
        if (_winner != null) { return; }
        for (let i = 0; i < board.length/3; i++) {
            const win = board[i] != '' && (board[i] == board[i+3]) && (board[i] == board[i+6]);
            if(win) { 
                _playerOne.getMark() == board[i] ? 
                    _winner = _playerOne :
                    _winner = _playerTwo;
                break;
            }
        }
    }

    const _checkDiagonals = (board) => {
        if (_winner != null) { return; }
        for (let i = 2; i < 5; i+=2) {
            const center = parseInt(board.length/2);
            const win = board[center] != '' && (board[center] == board[center-i]) && (board[center] == board[center+i]);
            if(win) { 
                _playerOne.getMark() == board[i] ? 
                    _winner = _playerOne :
                    _winner = _playerTwo;
                break;
            }
        }
    }

    const getPlayers = () => [_playerOne, _playerTwo];
    const getWinner = () => _winner;

    const reset = () => {
        gameboard.reset();
        displayController.refresh();
        _filledSpaces = 0;
        _winner = null;
    }

    const _setupPlayers = (names) => {
        switch(names.length) {
            case 1:
                _playerOne = Player(names[0], 'X');
                _playerTwo = Player("Computer", 'O');
                break;
            case 2:
                _playerOne = Player(names[0], 'X');
                _playerTwo = Player(names[2], 'O');
                break;
            default:
                console.log('default');
                return;
        }
        _currentTurn = _playerOne;
    }

    const startGame = (names) => {
        _setupPlayers(names);
        displayController.generateBoard();
        const tiles = [...document.querySelector('ul').children];
        tiles.forEach(elem => elem.addEventListener('click', _playTurn.bind(this, elem)));
    }

    return {
        startGame, 
        reset,
        getPlayers,
        getWinner
    };
})();


// UI and Setup

/*
    Prompt for one or two players
    Prompt to enter names
    Render gameboard, names, and buttons
    Restart: clear game state to default start
    Reselect: reprompt one/two player UI
    If playing against computer, use algorithm
    */
const displayController = (() => {
    const generateBoard = () => {
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

    const playerPrompt = () => {
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
            button.addEventListener('click', _namePrompt.bind(this,button.dataset.num));
            menu.append(button);
        }
    }

    const _namePrompt = (numPlayers) => {
        const menu = document.querySelector('#menu');
        const form = document.createElement('form');

        for (let i = 0; i < numPlayers; i++) {
            const label = document.createElement('label');
            const input = document.createElement('input');
            label.textContent = `Player ${i+1} name: `
            label.htmlFor = `name${i+1}`;
            input.id = `name${i+1}`;
            input.type = 'text';
            input.setAttribute('required', '');
            form.append(label);
            form.append(input);
        }
        const button = document.createElement('button');
        button.type = 'submit';
        button.textContent = 'submit';
        button.form = form;
        form.append(button);

        form.addEventListener('submit', _generateGameboard);

        menu.replaceChildren(form);
    }

    const _generateButtons = () => {
        const menu = document.querySelector('#menu');
        menu.replaceChildren();

        const reselect = document.createElement('button');
        reselect.textContent = 'reselect';
        reselect.addEventListener('click', playerPrompt);

        const restart = document.createElement('button');
        restart.textContent = 'restart';
        restart.addEventListener('click', gameController.reset);

        menu.append(reselect);
        menu.append(restart);
    }

    const _generateGameboard = (e) => {
        e.preventDefault();
        const names = [...document.querySelectorAll('form input')];
        names.forEach((input, index) => names[index] = input.value);
        gameController.startGame(names);
        _generateButtons();
    }

    return {
        generateBoard, 
        refresh,
        playerPrompt
    };
})();

displayController.playerPrompt();