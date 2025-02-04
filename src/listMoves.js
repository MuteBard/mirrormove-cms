


const moveUpdateActionListRows = document.getElementById('moveUpdateActionListRows');
const moveListRows = document.getElementById('moveListRows');
const moveSearchSubmit = document.getElementById('moveSearchSubmit');
const selectedUpdateListRows = document.getElementById('selectedUpdateListRows');



let moveToUpdate;


navMoveCreate.addEventListener("click", async () => {
    const createMoves = document.getElementById("createMoves");
    const listMoves = document.getElementById("listMoves");
    const updateMoves = document.getElementById("updateMoves");
    setInitialState();
    createMoves.classList.remove('hidden');
    listMoves.classList.add('hidden');
    updateMoves.classList.add('hidden');
});

getMoveTableData({
    name: "",
    orderBy: "NAME"
});

getMoveUpdateTableData({
    name: "",
    orderBy: "NAME"
});

listenForMoveTable();


document.getElementById('moveListRows').addEventListener('click', async (event) => {
    const clickedRow = event.target.closest('tr'); 
    const createMoves = document.getElementById("createMoves");
    const listMoves = document.getElementById("listMoves");
    const updateMoves = document.getElementById("updateMoves");

    if (clickedRow) {
        const id = clickedRow.querySelector('.row-id').textContent;
        setInitialState();
        createMoves.classList.add('hidden');
        listMoves.classList.add('hidden');
        updateMoves.classList.remove('hidden');

        const moveGetData = await getMove(id);
   
        const moveNameInputUpdate = document.getElementById("moveUpdateActionNameInput");
        const moveDescriptionInputUpdate = document.getElementById("moveUpdateActionDescriptionInput");

        moveNameInputUpdate.value = moveGetData[0].name;
        moveDescriptionInputUpdate.value = moveGetData[0].description;
        moveToUpdate = moveGetData;

        getMoveUpdateSelectTableDataPreLoad(moveGetData);
    }
});

async function getMoveUpdateTableData(payload) {
    moveUpdateActionListRows.innerHTML = '';
    const data = await searchActions(payload)
    data.map((rowData) => {
        row = updateMoveCreateNewRow(rowData)
        moveUpdateActionListRows.append(row)
    })
}


function updateMoveCreateNewRow(data){
    let row = document.createElement('tr');

    let idCell = document.createElement('td');
    idCell.style.display = 'none';
    idCell.textContent = data.id;
    idCell.classList.add('id');
    row.append(idCell);

    const orderedAllowedFields = ["name", "updatedAt", "seconds", "description"]
    orderedAllowedFields.forEach(key => {
        let cell = document.createElement('td');
        let text = document.createTextNode(data[key]);
        cell.append(text);
        row.append(cell);
    });
    return row;
}

function getMoveUpdateSelectTableDataPreLoad(payload) {
    selectedUpdateListRows.innerHTML = '';
    const data = payload[0].actions
  
    data.map((rowData) => {
        addToUpdateSelectTableData(rowData)
    })
}


function addToUpdateSelectTableData(data) {
    const {id, ...rest} = data.action    
    let row = document.createElement('tr');
    let idCell = document.createElement('td');
    idCell.style.display = 'none';
    idCell.textContent = id;
    idCell.classList.add('id');
    row.append(idCell);


    const augmentedData = {
        ...rest,
        loops: data.loops,
        placement: 0,
        x: "x"
    }

    const allFields = Object.keys(augmentedData)
    const orderedAllowedFields = ["name", "updatedAt", "seconds", "loops", "x"]
    allFields.forEach((key) => {
        let cell = document.createElement('td');
        cell.classList.add(`${key}`);
        
        
        if (orderedAllowedFields.includes(key)) {
            
            if ( key !== "loops" && key !== "x"){
            
                let text = document.createTextNode(augmentedData[key]);
                cell.append(text);
                row.append(cell);
            }
            else if (key === "loops") {
                let loopDiv = createUpdateLoopDiv(count, data.loops);
                cell.append(loopDiv)
                row.append(cell)
            }
            else if (key === "x") {
               let buttonRemove = document.createElement('button');
                buttonRemove.textContent = 'Delete';
                buttonRemove.className = 'custom-button tableButton';
                buttonRemove.addEventListener('click', () => {
                    const rowToRemove = buttonRemove.closest('tr');
                    rowToRemove.remove();
                });
                cell.append(buttonRemove)
                row.append(cell)
            }

        } else {
            let hiddenText = document.createTextNode(augmentedData[key]);
            cell.style.display = 'none';
            cell.append(hiddenText);
            row.append(cell)
        }


    });

    count++;
    selectedUpdateListRows.append(row);
}

document.getElementById('MoveSaveUpdate').addEventListener('click', async () => {
    const moveName = document.getElementById('moveUpdateActionNameInput')?.value;
    const moveDescription = document.getElementById('moveUpdateActionDescriptionInput')?.value;
    const move = {
        id: moveToUpdate[0].id,
        isHidden: moveToUpdate[0].isHidden,
        name: moveName,
        description: moveDescription,
        seconds: 0,
        actionLoops: []
    };

    const selectTable = document.getElementById('selectedUpdateListRows');
    const trList = Array.from(selectTable.getElementsByTagName('tr'));
    trList.forEach((tr, index) => {
        
        const actionLoop = {};
        const tdElemList = tr.getElementsByTagName('td');
        const savedLoops = Number(document.getElementById(`loopValue-${index + 1}`)?.value || 1)
        
        const tdList = Array.from(tdElemList)
        tdList.forEach((td) => {

            if (td.className === 'id') {
                actionLoop['ActionId'] = Number(td.innerText);
            }
            
            if (td.className === 'loops') {  
                actionLoop['Loops'] = savedLoops;
            }

            if (td.className === 'seconds') {
                move.seconds += Number(td.innerText) * savedLoops;
            }
        })
        move.actionLoops.push(actionLoop);
    })
    const response = await updateMove(move);
    currentMove = response[0]
    selectTable.innerHTML = "";
})

document.getElementById('MoveRunUpdate').addEventListener('click', async () => {
    prepRunWindow();
    const action = convertMoveToBigAction(moveToUpdate[0]);
    const totalWait = triggerAction(action, "run", 2000)
    pullUpWindow(totalWait, prepDemoWindow)
})

document.getElementById('MoveDelete').addEventListener('click', async () => {
    const createMoves = document.getElementById("createMoves");
    const listMoves = document.getElementById("listMoves");
    const updateMoves = document.getElementById("updateMoves");
    
    setInitialState();
    allMoves.classList.remove('hidden');
    allActions.classList.add('hidden');
    createMoves.classList.add('hidden');
    listMoves.classList.remove('hidden');
    updateMoves.classList.add('hidden');
    await deleteMove(moveToUpdate[0]?.id);
})





document.getElementById('moveUpdateActionListRows').addEventListener('click', async (event) => {
    const clickedRow = event.target.closest('tr'); 

    if (clickedRow) {
        const id = clickedRow.querySelector('.id').textContent;
        const actionGetData = await getAction(id);

        addToSelectUpdateTableData(actionGetData)
    }
});



async function addToSelectUpdateTableData(data) {
    const action = data[0];

    const {id, ...rest} = action
    
    let row = document.createElement('tr');
    let idCell = document.createElement('td');
    idCell.style.display = 'none';
    idCell.textContent = id;
    idCell.classList.add('id');
    row.append(idCell);


    const augmentedData = {
        ...rest,
        placement: 0,
        loops: 0,
        x: "x"
    }

    const allFields = Object.keys(augmentedData)
    const orderedAllowedFields = ["name", "updatedAt", "seconds", "loops", "x"]
    allFields.forEach((key) => {
        let cell = document.createElement('td');
        cell.classList.add(`${key}`);
        
        
        if (orderedAllowedFields.includes(key)) {
            
            if ( key !== "loops" && key !== "x"){
            
                let text = document.createTextNode(augmentedData[key]);
                cell.append(text);
                row.append(cell);
            }
            else if (key === "loops") {
                let loopDiv = createLoopDiv(count);
                cell.append(loopDiv)
                row.append(cell)
            }
            else if (key === "x") {
               let buttonRemove = document.createElement('button');
                buttonRemove.textContent = 'Delete';
                buttonRemove.className = 'custom-button tableButton';
                buttonRemove.addEventListener('click', () => {
                    const rowToRemove = buttonRemove.closest('tr');
                    rowToRemove.remove();
                });
                cell.append(buttonRemove)
                row.append(cell)
            }

        } else {
            let hiddenText = document.createTextNode(augmentedData[key]);
            cell.style.display = 'none';
            cell.append(hiddenText);
            row.append(cell)
        }
    });

    count++;
    selectedUpdateListRows.append(row);
}

function listenForMoveTable(){
    moveSearchSubmit.addEventListener("click", () => { 

        const moveSortOrderDropDown = document.getElementById('moveSortOrderDropDown');
        const moveOrderByDropDown = document.getElementById('moveOrderByDropDown');
        const movenSearchNameInput = document.getElementById('moveSearchNameInput');
        const searchMoveCheckbox = document.getElementById('searchMoveCheckbox');
        
        const payload = {
            name: movenSearchNameInput?.value,
            orderBy: moveOrderByDropDown?.value?.toUpperCase(),
            sortOrder: moveSortOrderDropDown?.value, 
            isHidden: searchMoveCheckbox?.checked
        };

        getMoveTableData(payload) 
    });
}

async function getMoveTableData(payload) {
    moveListRows.innerHTML = '';
    const data = await searchMoves(payload)
    data.map((rowData) => {
        row = createNewMoveRow(rowData)
        moveListRows.append(row)
    })
}

function createNewMoveRow(data){
    let row = document.createElement('tr');
    let idCell = document.createElement('td');
    idCell.style.display = 'none';
    idCell.textContent = data.id;
    idCell.classList.add('row-id');
    row.append(idCell);

    const orderedAllowedFields = ["id", "name", "updatedAt", "seconds", "description"]
    orderedAllowedFields.forEach(key => {
        let cell = document.createElement('td');
        let text = document.createTextNode(data[key]);
        cell.append(text);
        row.append(cell);
    });
    return row;
}

function createUpdateLoopDiv(id, value) {
    // Create a div element
    const divElement = document.createElement('div');

    // Create a button element for increasing value
    const buttonIncrease = document.createElement('button');
    buttonIncrease.textContent = '+';
    buttonIncrease.id = `loopInputIncrease-${id}`;
    buttonIncrease.className = 'custom-button tableButton';

    // Create an input element
    const loopElement = document.createElement('input');
    loopElement.type = 'text';
    loopElement.id = `loopValue-${id}`;
    loopElement.className = 'search-input mini-input';
    loopElement.placeholder = value || 1;

    // Create a button element for decreasing value
    const buttonDecrease = document.createElement('button');
    buttonDecrease.textContent = '-';
    buttonDecrease.id = `loopInputDecrease-${id}`;
    buttonDecrease.className = 'custom-button tableButton';

    // Append the elements to the div
    divElement.appendChild(buttonIncrease);
    divElement.appendChild(loopElement);
    divElement.appendChild(buttonDecrease);

    // Increase and decrease functionality
    let counter = 1;
    buttonIncrease.addEventListener('click', () => {
        counter++;
        loopElement.value = counter;
    });

    buttonDecrease.addEventListener('click', () => {
        counter--;
        loopElement.value = counter;
    });

    return divElement;
}