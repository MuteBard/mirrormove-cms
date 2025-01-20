const navListMenu = document.getElementById("navListMenu");

navListMenu.addEventListener("click", async () => {
    const createActions = document.getElementById("createActions");
    const listActions = document.getElementById("listActions")
    setInitialState();
    createActions.classList.add('hidden');   
    listActions.classList.remove('hidden');
});