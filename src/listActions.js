

window.addEventListener('keydown', function(event) {
    if (event.keyCode === 27 || event.key === 'Escape') { 
        process.exit(1);
    }
});


const actionListRows = document.getElementById('actionListRows');

getTableData("css")


document.getElementById('actionListRows').addEventListener('click', (event) => {
    const clickedRow = event.target.closest('tr'); // Find the closest 'tr' element

    if (clickedRow) {
        const id = clickedRow.querySelector('.row-id').textContent;
        logger(id)
    }
});

async function getTableData(searchTerm){
    const data = await searchActions(searchTerm)
   
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

    const orderedAllowedFields = ["name", "description", "seconds", "createdAt"]
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

