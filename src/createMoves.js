

const moveCreateActionListRows = document.getElementById('moveCreateActionListRows');
const moveCreateActionSearchSubmit = document.getElementById('moveCreateActionSearchSubmit');


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

        logger(actionGetData)
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
