const gameboard = (() => {
    const board = Array(9).fill(0);
    const addMark = (mark, pos) => board[pos] = mark;
    return {addMark};
})();

const displayController = (() => {
    const generate = () => {
        const ul = document.createElement('ul');
        ul.classList.add('board');
        document.body.replaceChildren(ul);
        for (let i = 0; i < 9; i++) {
            const li = document.createElement('li');
            li.classList.add('tile');
            ul.appendChild(li);
        }
    }
    const reset = () => {
        const ul = document.querySelector('ul');
        [...ul.children].forEach(li => li.textContent='');
    }

    return {generate, reset};
})();

const playerFactory = (name, mark) => {
    return {name, mark};
}

displayController.generate();
displayController.reset();