

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
        const id = clickedRow.querySelector('.id').textContent;
        const actionGetData = await getAction(id);

        addToSelectTableData(actionGetData)
    }
});

document.getElementById('MoveSave').addEventListener('click', async () => {
    console.log("SAVED")

    
    const moveName = document.getElementById('moveCreateActionNameInput')?.value;
    const moveDescription = document.getElementById('moveCreateActionDescriptionInput')?.value;
    const move = {
        name: moveName,
        description: moveDescription,
        actionLoops: []
    };

    const selectTable = document.getElementById('selectedListRows');
    const trList = Array.from(selectTable.getElementsByTagName('tr'));
    trList.forEach((tr) => {
        
        const actionLoop = {};
        const tdElemList = tr.getElementsByTagName('td');
        
        const tdList = Array.from(tdElemList)
        tdList.forEach((td) => {

            if (td.className === 'id') {
                actionLoop['ActionId'] = Number(td.innerText);
            }
            
            if (td.className === 'loops') {
                loopInput = td.getElementsByTagName('input')[0]
                loops = loopInput?.value <= 0 ? 1 : Number(loopInput?.value);
                actionLoop['Loops'] = loops;
            }
        })
        move.actionLoops.push(actionLoop);
    })
    await createMove(move)

})



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
    selectedListRows.append(row);
}


function createMoveCreateNewRow(data){
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