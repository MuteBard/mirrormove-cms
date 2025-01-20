

window.addEventListener('keydown', function(event) {
    if (event.keyCode === 27 || event.key === 'Escape') { 
        process.exit(1);
    }
});


const actionListRows = document.getElementById('actionListRows');
const actionSearchSubmit = document.getElementById('actionSearchSubmit');


const navActionCreate = document.getElementById("navActionCreate");
const demoActionButton = document.getElementById("demoAction");
const actionInput = document.getElementById('actionNameInput');
const actionName = actionInput.value;

let actionToUpdate;


navActionCreate.addEventListener("click", async () => {
    const createActions = document.getElementById("createActions");
    const listActions = document.getElementById("listActions");
    const updateActions = document.getElementById("updateActions");
    setInitialState();
    createActions.classList.remove('hidden');
    listActions.classList.add('hidden');
    updateActions.classList.add('hidden');
});

getTableData({
    name: "",
    orderBy: "NAME"
});
listenForTable()
updateRecords()


document.getElementById('actionListRows').addEventListener('click', async (event) => {
    const clickedRow = event.target.closest('tr'); 
    const createActions = document.getElementById("createActions");
    const listActions = document.getElementById("listActions");
    const updateActions = document.getElementById("updateActions");

    if (clickedRow) {
        const id = clickedRow.querySelector('.row-id').textContent;
        setInitialState();
        createActions.classList.add('hidden');
        listActions.classList.add('hidden');
        updateActions.classList.remove('hidden');

        const actionGetData = await getAction(id);
        const actionNameInputUpdate = document.getElementById("actionNameInputUpdate");
        const actionDescriptionInputUpdate = document.getElementById("actionDescriptionInputUpdate");

        actionNameInputUpdate.value = actionGetData[0].name;
        actionDescriptionInputUpdate.value = actionGetData[0].description;
        actionToUpdate = actionGetData;
    }
});

function updateRecords() {
    const saveActionButton = document.getElementById("saveActionUpdate");
    const deleteActionButton = document.getElementById("deleteActionUpdate");
    const createActions = document.getElementById("createActions");
    const listActions = document.getElementById("listActions");
    const updateActions = document.getElementById("updateActions");

    saveActionButton.addEventListener("click", () => {
        createActions.classList.add('hidden');
        listActions.classList.remove('hidden');
        updateActions.classList.add('hidden');
        const actionNameInput = document.getElementById('actionNameInputUpdate');
        const name = actionNameInput.value;

        const actionDescriptionInput = document.getElementById('actionDescriptionInputUpdate');
        const description = actionDescriptionInput.value;

        const data = {
            ...actionToUpdate[0],
            name,
            description
        }

        safeExec(terminal, async () => {
            await updateAction(data);
        });
    });

    deleteActionButton.addEventListener("click", () => {
        createActions.classList.add('hidden');
        listActions.classList.remove('hidden');
        updateActions.classList.add('hidden');

        logger("delteing")
        logger(actionToUpdate[0])

        safeExec(terminal, async () => {
            await deleteAction(actionToUpdate[0]?.id);
        });
        
    });
}

function listenForTable(){
    actionSearchSubmit.addEventListener("click", () => { 

        const actionSortOrderDropDown = document.getElementById('actionSortOrderDropDown');
        const actionOrderByDropDown = document.getElementById('actionOrderByDropDown');
        const actionSearchNameInput = document.getElementById('actionSearchNameInput');
        const searchActionCheckbox = document.getElementById('searchActionCheckbox');
        
        const payload = {
            name: actionSearchNameInput?.value,
            orderBy: actionOrderByDropDown?.value?.toUpperCase(),
            sortOrder: actionSortOrderDropDown?.value?.toUpperCase(),
            isHidden: searchActionCheckbox?.checked
        };
        
        getTableData(payload) 
    });
}

async function getTableData(payload) {
    actionListRows.innerHTML = '';
    const data = await searchActions(payload)
    data.map((rowData) => {
        row = createNewRow(rowData)
        actionListRows.append(row)
    })
}

function createNewRow(data){
    let row = document.createElement('tr');

    let idCell = document.createElement('td');
    idCell.style.display = 'none';
    idCell.textContent = data.id;
    idCell.classList.add('row-id');
    row.append(idCell);

    const orderedAllowedFields = ["name", "createdAt", "seconds", "description"]
    orderedAllowedFields.forEach(key => {
        let cell = document.createElement('td');
        let text = document.createTextNode(data[key]);
        cell.append(text);
        row.append(cell);
    });
    return row;
}

function logger(data){
    typeof data === "object" ? JSON.stringify(data) : data
    log(terminal, data)
}

