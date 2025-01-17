

window.addEventListener('keydown', function(event) {
    if (event.keyCode === 27 || event.key === 'Escape') { 
        process.exit(1);
    }
});



getTableData("css")



async function getTableData(searchTerm){
   
    const actionListRows = document.getElementById('actionListRows');
    
    const data = await searchActions(searchTerm)
   
    data.map((rowData) => {
        row = createNewRow(rowData)
        actionListRows.append(row)
    })
}

function createNewRow(data){
    let row = document.createElement('tr');
    logger(data)

    const orderedAllowedFields = ["name", "description", "seconds", "createdAt"]
    orderedAllowedFields.forEach(key => {
        let cell = document.createElement('td');
        let text = document.createTextNode(data[key]);
        cell.append(text);
        row.append(cell);
    })
    return row;
}

function logger(data){
    typeof data === "object" ? JSON.stringify(data) : data
    log(terminal, data)
}

