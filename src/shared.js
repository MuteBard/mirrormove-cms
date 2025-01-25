const navActionMenu = document.getElementById("navActionMenu");
const navMoveMenu = document.getElementById("navMoveMenu");
const allActions = document.getElementById("actions");
const allMoves = document.getElementById("moves");

navActionMenu.addEventListener("click", async () => {
    const createActions = document.getElementById("createActions");
    const listActions = document.getElementById("listActions");
    const updateActions = document.getElementById("updateActions");
    setInitialState();
    allActions.classList.remove('hidden');
    allMoves.classList.add('hidden');
    createActions.classList.add('hidden');   
    listActions.classList.remove('hidden');
    updateActions.classList.add('hidden');
});

navMoveMenu.addEventListener("click", async () => {
    // const createMoves = document.getElementById("createMoves");
    // const listMoves = document.getElementById("listMovess");
    // const updateMoves = document.getElementById("updateMoves");
    setInitialState();
    allMoves.classList.remove('hidden');
    allActions.classList.add('hidden');
    // createMoves.classList.add('hidden');
    listMoves.classList.remove('hidden');
    // updateMoves.classList.add('hidden');
});