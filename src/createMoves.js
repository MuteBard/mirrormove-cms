

const moveCreateActionListRows = document.getElementById('moveCreateActionListRows');
const moveCreateActionSearchSubmit = document.getElementById('moveCreateActionSearchSubmit');
const selectedListRows = document.getElementById('selectedListRows');

getMoveCreateTableData({
    name: "",
    orderBy: "NAME"
});
listenMoveCreateForTable()
let count = 1;


document.getElementById('moveCreateActionListRows').addEventListener('click', async (event) => {
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
    });

    count++;
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

function createLoopDiv(id) {
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
    loopElement.placeholder = 0;

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
    let counter = 0;
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