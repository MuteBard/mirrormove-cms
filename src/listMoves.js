

// window.addEventListener('keydown', function(event) {
//     if (event.keyCode === 27 || event.key === 'Escape') { 
//         process.exit(1);
//     }
// });

const moveUpdateActionListRows = document.getElementById('moveUpdateActionListRows');
const moveListRows = document.getElementById('moveListRows');
const moveSearchSubmit = document.getElementById('moveSearchSubmit');
const selectedUpdateListRows = document.getElementById('selectedUpdateListRows');

// const navMoveCreate = document.getElementById("navMoveCreate");
// const demoMoveButton = document.getElementById("demoMove");
// const actionInput = document.getElementById('actionNameInput');

// const canvasContainerUpdate = document.getElementById("canvasContainerUpdate");
// const canvasUpdate = document.createElement("canvas");

// canvasUpdate.width = screenWidth - 50;
// canvasUpdate.height = screenHeight - 40;

// const ctxUpdate = canvasUpdate.getContext("2d");

// const actionName = actionInput.value;

let moveToUpdate;
// canvasContainerUpdate.appendChild(canvasUpdate);


navMoveCreate.addEventListener("click", async () => {
    const createMoves = document.getElementById("createMoves");
    const listMoves = document.getElementById("listMoves");
    // const updateMoves = document.getElementById("updateMoves");
    setInitialState();
    createMoves.classList.remove('hidden');
    listMoves.classList.add('hidden');
    // updateMoves.classList.add('hidden');
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
// updateRecords();
// executeRecordsUpdate()


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
    console.log(data)
    const {id, ...rest} = data.action

    console.log(data)
    
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

    console.log('augmentedData', augmentedData)

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


// function updateRecords() {
//     const saveMoveButton = document.getElementById("saveMoveUpdate");
//     const deleteMoveButton = document.getElementById("deleteMoveUpdate");
//     const createMoves = document.getElementById("createMoves");
//     const listMoves = document.getElementById("listMoves");
//     const updateMoves = document.getElementById("updateMoves");

//     saveMoveButton.addEventListener("click", () => {
//         createMoves.classList.add('hidden');
//         listMoves.classList.remove('hidden');
//         updateMoves.classList.add('hidden');
//         const actionNameInput = document.getElementById('actionNameInputUpdate');
//         const name = actionNameInput.value;

//         const actionDescriptionInput = document.getElementById('actionDescriptionInputUpdate');
//         const description = actionDescriptionInput.value;

//         const data = {
//             ...actionToUpdate[0],
//             name,
//             description
//         }

//         safeExec(terminal, async () => {
//             await updateMove(data);
//         });
//     });

//     deleteMoveButton.addEventListener("click", () => {
//         createMoves.classList.add('hidden');
//         listMoves.classList.remove('hidden');
//         updateMoves.classList.add('hidden');

//         logger(actionToUpdate[0])

//         safeExec(terminal, async () => {
//             await deleteMove(actionToUpdate[0]?.id);
//         });
//     });
// }

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

    const orderedAllowedFields = ["name", "updatedAt", "seconds", "description"]
    orderedAllowedFields.forEach(key => {
        let cell = document.createElement('td');
        let text = document.createTextNode(data[key]);
        cell.append(text);
        row.append(cell);
    });
    return row;
}

// function logger(data){
//     typeof data === "object" ? JSON.stringify(data) : data
//     log(terminal, data)
// }

// function executeRecordsUpdate(){
//     const runActionButton = document.getElementById("runActionUpdate");
//     const demoActionButton = document.getElementById("demoActionUpdate");
//     const updateName = actionToUpdate;

//     runActionButton.addEventListener("click", async () => {
//         setInitialState();
//         prepRunWindowUpdate();
//         const action = await searchActions(updateName);
//         const totalWait = triggerActionUpdate(action[0], "run", 2000)
//         pullUpWindowUpdate(totalWait, prepDemoWindowUpdate)
//     });

//     demoActionButton.addEventListener("click", async () => {
//         setInitialState();
//         prepDemoWindowUpdate();
//         const action = await searchActions(updateName);
//         logger(action)
//         triggerActionUpdate(action[0], "demo", 2000)
//     });
// }
// function triggerActionUpdate(action, executionType, milliOffset) {
//     let totalWait = milliOffset;
//     const timedSteps = action.steps.map((step, index, steps) => {
//         const {time, position, act} = getResponseUpdate(steps[index - 1], step, steps[index + 1])
//         totalWait += time;
//         return {
//             step,
//             wait: totalWait,
//             position,
//             act
//         }
//     })
//     timedSteps.map((ts) => {
//         setTimeout(async () => {
//             let position = ts?.position;
//             let action = ts?.step?.action;
//             let key = ts?.step?.key;

//             if (action === "key_press") {
//                 if (executionType === "run"){
//                     await keyPress(key)
//                 }
//                 else if(executionType === "demo"){
//                     ctxUpdate.clearRect(0, 0, canvas.width, canvas.height);
//                     createBoxLetterUpdate(key)
//                 }
//                 log(terminal, ts?.step?.key);  
//             }
//             else if (action === "click" || action === "click_move" ){
//                 if (executionType === "run"){
//                     await clickMove(position);
//                 }
//                 else if(executionType === "demo"){
//                     const {x, y, width, height} = createBoxLetterUpdate("");
//                     ctxUpdate.clearRect(x, y, width, height);
//                     drawLineUpdate(position);
//                 }
//                 log(terminal, position)
//             }
            
//         }, ts.wait)
//     })


//     return totalWait;
// }
// function pullUpWindowUpdate(wait, desiredWindow) {
//     setTimeout(() => {
//         desiredWindow();
//     }, wait)
// }

// async function prepRunWindowUpdate() {
//     window.scrollTo({
//         top: 0
//     });
// 	if (typeof nw !== "undefined" && nw.App) {
// 		const win = nw.Window.get();
//         win.minimize();
//         click({x: screenWidth /2, y: screenHeight/2});
// 	}
// }

// async function prepDemoWindowUpdate() {
//     window.scrollTo({
//         top: 0
//     });
// 	if (typeof nw !== "undefined" && nw.App) {
// 		const win = nw.Window.get();
//         win.enterFullscreen();
//         click({x: screenWidth /2, y: screenHeight/2});
// 	}
// }

// function getResponseUpdate(prevStep, currStep, nextStep) {
//     let currTime = currStep.time
//     let prevTime = !prevStep ? currTime : prevStep.time

//     let currPos = { x: currStep.x, y: currStep.y }
//     let nextPos = !nextStep ? currPos : { x: nextStep.x, y: nextStep.y }

//     let duration = currStep?.duration || 0;
//     let time = currTime - prevTime + (duration + 700);
//     let position = {x1 : currPos.x, y1: currPos.y, x2: nextPos.x, y2: nextPos.y, }

//     let prevAction = !prevStep ? null : prevStep.action;
//     let nextAction = !nextStep ? null : nextStep.action;

//     return { 
//         time, 
//         position, 
//         act: {
//             prev: prevAction,
//             next: nextAction
//         }
//     }
// }

// function drawLineUpdate(position){
//     ctxUpdate.strokeStyle = 'red';
//     ctxUpdate.lineWidth = 2; 
//     ctxUpdate.beginPath();
//     ctxUpdate.moveTo(position.x1, position.y1); 
//     ctxUpdate.lineTo(position.x2, position.y2);
//     ctxUpdate.stroke();
// }

// function createBoxLetterUpdate(letter) {
// 	const width = 50;
// 	const height = 50;

//     const x = Number(screenWidth * 0.425);
// 	const y = Number(screenHeight * .4);
//     const mx = x + 17;
//     const my = y + 33;

//     //fill box color
//     ctxUpdate.fillStyle = "#454b60";
// 	ctxUpdate.fillRect(x, y, width, height);

// 	//write letter
// 	ctxUpdate.fillStyle = "#d9c9ce";
// 	ctxUpdate.font = "bold 30px Roboto, sans-serif";
// 	ctxUpdate.fillText(`${letter}`, mx, my);

// 	return {
// 		letter,
// 		x,
// 		y,
// 		width,
// 		height
// 	};
// }


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