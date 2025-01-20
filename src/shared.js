const navListMenu = document.getElementById("navListMenu");

navListMenu.addEventListener("click", async () => {
    const createActions = document.getElementById("createActions");
    const listActions = document.getElementById("listActions");
    const updateActions = document.getElementById("updateActions");
    setInitialState();
    createActions.classList.add('hidden');   
    listActions.classList.remove('hidden');
    updateActions.classList.add('hidden');
});