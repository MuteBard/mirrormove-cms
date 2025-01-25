

const moveCreateActionListRows = document.getElementById('moveCreateActionListRows');
const moveCreateActionSearchSubmit = document.getElementById('moveCreateActionSearchSubmit');
const selectedListRows = document.getElementById('selectedListRows');

getMoveCreateTableData({
    name: "",
    orderBy: "NAME"
});
listenMoveCreateForTable()


document.getElementById('moveCreateActionListRows').addEventListener('click', async (event) => {
    const clickedRow = event.target.closest('tr'); 

    if (clickedRow) {
        const id = clickedRow.querySelector('.row-id').textContent;
        const actionGetData = await getAction(id);

        addToSelectTableData(actionGetData)
    }
});



document.getElementById('selectedListRows').addEventListener('click', async (event) => {
    const clickedRow = event.target.closest('tr'); 

    if (clickedRow) {
        const id = clickedRow.querySelector('.row-id').textContent;
        const actionGetData = await getAction(id);

        addToSelectTableData(actionGetData)
    }
});

async function getMoveCreateTableData(payload) {
    moveCreateActionListRows.innerHTML = '';
    const data = await searchActions(payload)
    data.map((rowData) => {
        row = createMoveCreateNewRow(rowData)
        moveCreateActionListRows.append(row)
    })
}


function listenMoveCreateForTable(){
    moveCreateActionSearchSubmit.addEventListener("click", () => { 

        const moveCreateActionSortOrderDropDown = document.getElementById('moveCreateActionSortOrderDropDown');
        const moveCreateActionOrderByDropDown = document.getElementById('moveCreateActionOrderByDropDown');
        const moveCreateActionSearchNameInput = document.getElementById('moveCreateActionSearchNameInput');
        
        const payload = {
            name: moveCreateActionSearchNameInput?.value,
            orderBy: moveCreateActionOrderByDropDown?.value?.toUpperCase(),
            sortOrder: moveCreateActionSortOrderDropDown?.value?.toUpperCase(),
        };
        getMoveCreateTableData(payload) 
    });
}



async function addToSelectTableData(data) {
    const action = data[0];
    

    let row = document.createElement('tr');
    let idCell = document.createElement('td');
    idCell.style.display = 'none';
    idCell.textContent = data.id;
    idCell.classList.add('row-id');
    row.append(idCell);


    const augmentedData = {
        ...action,
        placement: 0,
        loops: 0,
        x: "x"
    }

    logger(augmentedData)

    const orderedAllowedFields = ["name", "updatedAt", "seconds", "loops", "x"]
    orderedAllowedFields.forEach((key) => {
        let cell = document.createElement('td');
        if ( key !== "loops" && key !== "x"){
            
            let text = document.createTextNode(augmentedData[key]);
            cell.append(text);
            row.append(cell);
        }
        else if (key === "loops") {
            let loopDiv = createLoopDiv();
            cell.append(loopDiv)
            row.append(cell)
        }
        else if (key === "x") {
           let buttonRemove = document.createElement('button');
            buttonRemove.textContent = 'Delete';
            buttonRemove.className = 'custom-button tableButton';
            cell.append(buttonRemove)
            row.append(cell)
        }
    });

    selectedListRows.append(row);
}


function createMoveCreateNewRow(data){
    let row = document.createElement('tr');

    let idCell = document.createElement('td');
    idCell.style.display = 'none';
    idCell.textContent = data.id;
    idCell.classList.add('row-id');
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


function createLoopDiv() {
    // Create a div element
    const divElement = document.createElement('div');

    // Create a button element for increasing value
    const buttonIncrease = document.createElement('button');
    buttonIncrease.textContent = '+';
    // buttonIncrease.id = 'loopInputIncrease';
    buttonIncrease.className = 'custom-button tableButton';

    // Create an input element
    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    // inputElement.id = 'loopValue';
    inputElement.className = 'search-input mini-input';
    inputElement.placeholder = "0";

    // Create a button element for decreasing value
    const buttonDecrease = document.createElement('button');
    buttonDecrease.textContent = '-';
    // buttonDecrease.id = 'loopInputDecrease';
    buttonDecrease.className = 'custom-button tableButton';

    // Append the elements to the div
    divElement.appendChild(buttonIncrease);
    divElement.appendChild(inputElement);
    divElement.appendChild(buttonDecrease);

    return divElement;
}