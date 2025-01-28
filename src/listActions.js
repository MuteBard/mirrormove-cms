

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

const canvasContainerUpdate = document.getElementById("canvasContainerUpdate");
const canvasUpdate = document.createElement("canvas");

canvasUpdate.width = screenWidth - 50;
canvasUpdate.height = screenHeight - 40;

const ctxUpdate = canvasUpdate.getContext("2d");

const actionName = actionInput.value;

let actionToUpdate;
canvasContainerUpdate.appendChild(canvasUpdate);


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
listenForTable();
(() => {
    updateRecords();


})()
executeRecordsUpdate()


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

async function updateRecords() {
    const saveActionButton = document.getElementById("saveActionUpdate");
    const deleteActionButton = document.getElementById("deleteActionUpdate");
    const createActions = document.getElementById("createActions");
    const listActions = document.getElementById("listActions");
    const updateActions = document.getElementById("updateActions");

    saveActionButton.addEventListener("click", async () => {
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
        await updateAction(data);
    });

    deleteActionButton.addEventListener("click", async () => {
        createActions.classList.add('hidden');
        listActions.classList.remove('hidden');
        updateActions.classList.add('hidden');

        await deleteAction(actionToUpdate[0]?.id);
    
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

    const orderedAllowedFields = ["name", "updatedAt", "seconds", "description"]
    orderedAllowedFields.forEach(key => {
        let cell = document.createElement('td');
        let text = document.createTextNode(data[key]);
        cell.append(text);
        row.append(cell);
    });
    return row;
}

function executeRecordsUpdate(){
    const runActionButton = document.getElementById("runActionUpdate");
    const demoActionButton = document.getElementById("demoActionUpdate");
    const updateName = actionToUpdate;

    runActionButton.addEventListener("click", async () => {
        setInitialState();
        prepRunWindowUpdate();
        const action = await searchActions(updateName);
        const totalWait = triggerActionUpdate(action[0], "run", 2000)
        pullUpWindowUpdate(totalWait, prepDemoWindowUpdate)
    });

    demoActionButton.addEventListener("click", async () => {
        setInitialState();
        prepDemoWindowUpdate();
        const action = await searchActions(updateName);
        triggerActionUpdate(action[0], "demo", 2000)
    });
}
function triggerActionUpdate(action, executionType, milliOffset) {
    let totalWait = milliOffset;
    const timedSteps = action.steps.map((step, index, steps) => {
        const {time, position, act} = getResponseUpdate(steps[index - 1], step, steps[index + 1])
        totalWait += time;
        return {
            step,
            wait: totalWait,
            position,
            act
        }
    })
    timedSteps.map((ts) => {
        setTimeout(async () => {
            let position = ts?.position;
            let action = ts?.step?.action;
            let key = ts?.step?.key;

            if (action === "key_press") {
                if (executionType === "run"){
                    await keyPress(key)
                }
                else if(executionType === "demo"){
                    ctxUpdate.clearRect(0, 0, canvas.width, canvas.height);
                    createBoxLetterUpdate(key)
                }
            }
            else if (action === "click" || action === "click_move" ){
                if (executionType === "run"){
                    await clickMove(position);
                }
                else if(executionType === "demo"){
                    const {x, y, width, height} = createBoxLetterUpdate("");
                    ctxUpdate.clearRect(x, y, width, height);
                    drawLineUpdate(position);
                }
            }
            
        }, ts.wait)
    })


    return totalWait;
}
function pullUpWindowUpdate(wait, desiredWindow) {
    setTimeout(() => {
        desiredWindow();
    }, wait)
}

async function prepRunWindowUpdate() {
    window.scrollTo({
        top: 0
    });
	if (typeof nw !== "undefined" && nw.App) {
		const win = nw.Window.get();
        win.minimize();
        click({x: screenWidth /2, y: screenHeight/2});
	}
}

async function prepDemoWindowUpdate() {
    window.scrollTo({
        top: 0
    });
	if (typeof nw !== "undefined" && nw.App) {
		const win = nw.Window.get();
        win.enterFullscreen();
        click({x: screenWidth /2, y: screenHeight/2});
	}
}

function getResponseUpdate(prevStep, currStep, nextStep) {
    let currTime = currStep.time
    let prevTime = !prevStep ? currTime : prevStep.time

    let currPos = { x: currStep.x, y: currStep.y }
    let nextPos = !nextStep ? currPos : { x: nextStep.x, y: nextStep.y }

    let duration = currStep?.duration || 0;
    let time = currTime - prevTime + (duration + 700);
    let position = {x1 : currPos.x, y1: currPos.y, x2: nextPos.x, y2: nextPos.y, }

    let prevAction = !prevStep ? null : prevStep.action;
    let nextAction = !nextStep ? null : nextStep.action;

    return { 
        time, 
        position, 
        act: {
            prev: prevAction,
            next: nextAction
        }
    }
}

function drawLineUpdate(position){
    ctxUpdate.strokeStyle = 'red';
    ctxUpdate.lineWidth = 2; 
    ctxUpdate.beginPath();
    ctxUpdate.moveTo(position.x1, position.y1); 
    ctxUpdate.lineTo(position.x2, position.y2);
    ctxUpdate.stroke();
}

function createBoxLetterUpdate(letter) {
	const width = 50;
	const height = 50;

    const x = Number(screenWidth * 0.425);
	const y = Number(screenHeight * .4);
    const mx = x + 17;
    const my = y + 33;

    //fill box color
    ctxUpdate.fillStyle = "#454b60";
	ctxUpdate.fillRect(x, y, width, height);

	//write letter
	ctxUpdate.fillStyle = "#d9c9ce";
	ctxUpdate.font = "bold 30px Roboto, sans-serif";
	ctxUpdate.fillText(`${letter}`, mx, my);

	return {
		letter,
		x,
		y,
		width,
		height
	};
}


