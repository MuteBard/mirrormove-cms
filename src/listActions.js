

window.addEventListener('keydown', function(event) {
    if (event.keyCode === 27 || event.key === 'Escape') { 
        process.exit(1);
    }
});


const actionListRows = document.getElementById('actionListRows');
const actionSearchSubmit = document.getElementById('actionSearchSubmit');

getTableData({
    name: "css",
    orderBy: "NAME"
});
listenForTable()


document.getElementById('actionListRows').addEventListener('click', (event) => {
    const clickedRow = event.target.closest('tr'); // Find the closest 'tr' element

    if (clickedRow) {
        const id = clickedRow.querySelector('.row-id').textContent;
    }
});

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

