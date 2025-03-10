const { searchActions, createAction, getAction, deleteAction, updateAction } = require("./service/actionService");
const { searchMoves, createMove, getMove, deleteMove, updateMove } = require("./service/moveService");
const { click, clickMove, keyPress } = require("./service/mirrorService");


const canvasContainer = document.getElementById("canvasContainer");
const canvas = document.createElement("canvas");

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

canvas.width = screenWidth - 50;
canvas.height = screenHeight - 40;
const ctx = canvas.getContext("2d");


step = 0;
let isDragging = false;
let recordedData = [];
let keyPressStartTime = null;
let isLogging = false;
let moveCount = 0;

function setInitialState() {
    isDragging = false;
    recordedData = [];
    keyPressStartTime = null;
    isLogging = false;
}

saveRecords();
executeRecords();
hideContainersOnStart()
toggleButtonsState();
canvasContainer.appendChild(canvas);

function hideContainersOnStart() {
    const recordActionContainer = document.getElementById("record-action-container");
    const runActionContainer = document.getElementById("run-action-container");
    recordActionContainer.style.display = 'none';
    runActionContainer.style.display = 'none';
}
 
function toggleButtonsState() {
    const inputElement = document.getElementById('actionNameInput');
    const containersToHide = document.querySelectorAll('.inputToggled');
    inputElement.addEventListener('input', () => {
        const isInputEmpty = inputElement.value.trim() === '';
        containersToHide.forEach(container => {
                if (isInputEmpty) {
                    container.style.display = 'none';
                } else {
                    container.style.display = 'flex';
                }
            });
    });
}

window.addEventListener('keydown', function(event) {
    if (event.keyCode === 27 || event.key === 'Escape') { 
        process.exit(1);
    }
});

function listenToMovement() {
    
    window.addEventListener('keydown', function(event) {
        // Check if the pressed key is the spacebar (key code 32)
        if (event.keyCode === 32) {
            // Prevent the default behavior of scrolling down when the spacebar is pressed
            event.preventDefault();
        }
    });

    // Add mousedown event listener to start tracking mouse drag
    document.addEventListener('mousedown', function(event) {
        if (!isLogging) return;
        isDragging = true;
        step++;
        moveCount = 0;
        const data = {
            steps: step,
            action : "click",
            x: event.clientX,
            y: event.clientY,
            key: null,
            time: Date.now(),
            duration: null
        }
        recordedData.push(data);
    });

    // Add mousemove event listener to track mouse coordinates during drag
    document.addEventListener("mousemove", function (event) {
        if (!isLogging) return;

        if (isDragging) {
            moveCount++;
            if (moveCount % 10 == 0) {
                step++;
                const data = {
                    steps: step,
                    action: "click_move",
                    x: event.clientX,
                    y: event.clientY,
                    key: null,
                    time: Date.now(),
                    duration: null,
                };
                recordedData.push(data);
            }
        }
    });

    // Add mouseup event listener to stop tracking mouse drag
    document.addEventListener('mouseup', function() {
        if (!isLogging) return;
        isDragging = false;
        moveCount = 0;
    });

    // Add a keydown event listener to the document
    document.addEventListener('keydown', function(event) {
        if (!isLogging) return;
        if (!keyPressStartTime) {
            step++;
            keyPressStartTime = Date.now();
        }
    });

    // Add a keyup event listener to the document
    document.addEventListener('keyup', function(event) {
        if (!isLogging) return;
        if (keyPressStartTime) {
            const data = {
                steps: step,
                action : "key_press",
                x: null,
                y: null,
                key: event.key,
                time: Date.now(),
                duration: Date.now() - keyPressStartTime
            }
            keyPressStartTime = null;
            recordedData.push(data)
        }
    });
    
}

function saveRecords() {
    const logActionButton = document.getElementById("logAction");
    const saveActionButton = document.getElementById("saveAction");
    const cancelActionButton = document.getElementById("cancelAction");

    logActionButton.addEventListener("click", () => {
        isLogging = true
        window.scrollTo({
            top: 0
        });
        listenToMovement()

    });

    saveActionButton.addEventListener("click", async () => {
        isLogging = false;

        const reversedCopy = [...recordedData].reverse();
        const index = reversedCopy.findIndex((data) => data.action === "click");
        const filteredData = [...reversedCopy.slice(index + 1)].reverse();
        const steps = filteredData;
        const seconds = getTotalStepDuration(steps)

        steps.push(actionEndCap())

        const actionNameInput = document.getElementById('actionNameInput');
        const name = actionNameInput.value;

        const actionDescriptionInput = document.getElementById('actionDescriptionInput');
        const description = actionDescriptionInput.value;

        const data = {
            name,
            description,
            seconds,
            steps
        }
      
        await createAction(data);

        const containersToShow = document.querySelectorAll('.saveToggled');
        containersToShow.forEach(container => container.style.display = 'flex');
    });

    cancelActionButton.addEventListener("click", () => {
        setInitialState();
        
        const actionNameInput = document.getElementById('actionNameInput');
        actionNameInput.value = "";

        const actionDescriptionInput = document.getElementById('actionDescriptionInput');
        actionDescriptionInput.value = "";

        document.removeEventListener('mousedown');
        document.removeEventListener('mousemove');
        document.removeEventListener('mouseup');
        document.removeEventListener('keydown');
        document.removeEventListener('keyup');
    });
}

function executeRecords(){
    const runActionButton = document.getElementById("runAction");
    const demoActionButton = document.getElementById("demoAction");
    const inputElement = document.getElementById('actionNameInput');
    const actionName = inputElement.value;

    

    runActionButton.addEventListener("click", async () => {
        setInitialState();
        prepRunWindow();
        const action = await searchActions(actionName);
        const totalWait = triggerAction(action[0], "run", 2000)
        pullUpWindow(totalWait, prepDemoWindow)
    });

    demoActionButton.addEventListener("click", async () => {
        setInitialState();
        prepDemoWindow();
        const action = await searchActions(actionName);
        triggerAction(action[0], "demo", 2000)
    });
}
function triggerAction(action, executionType, milliOffset) {
    let totalWait = milliOffset;
    const timedSteps = action.steps.map((step, index, steps) => {
        const {time, position, act} = getResponse(steps[index - 1], step, steps[index + 1])
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
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    createBoxLetter(key)
                }
            }
            else if (action === "click" || action === "click_move" ){
                if (executionType === "run"){
                    await clickMove(position);
                }
                else if(executionType === "demo"){
                    const {x, y, width, height} = createBoxLetter("");
                    ctx.clearRect(x, y, width, height);
                    drawLine(position);
                }

            }
            
        }, ts.wait)
    })


    return totalWait;
}
function pullUpWindow(wait, desiredWindow) {
    setTimeout(() => {
        desiredWindow();
    }, wait)
}

async function prepRunWindow() {
    window.scrollTo({
        top: 0
    });
	if (typeof nw !== "undefined" && nw.App) {
		const win = nw.Window.get();
        win.minimize();
        click({x: screenWidth /2, y: screenHeight/2});
	}
}

async function prepDemoWindow() {
    window.scrollTo({
        top: 0
    });
	if (typeof nw !== "undefined" && nw.App) {
		const win = nw.Window.get();
        win.enterFullscreen();
        click({x: screenWidth /2, y: screenHeight/2});
	}
}

function getResponse(prevStep, currStep, nextStep) {
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

function drawLine(position){
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2; 
    ctx.beginPath();
    ctx.moveTo(position.x1, position.y1); 
    ctx.lineTo(position.x2, position.y2);
    ctx.stroke();
}

function createBoxLetter(letter) {
	const width = 50;
	const height = 50;

    const x = Number(screenWidth * 0.425);
	const y = Number(screenHeight * .4);
    const mx = x + 17;
    const my = y + 33;

    //fill box color
    ctx.fillStyle = "#454b60";
	ctx.fillRect(x, y, width, height);

	//write letter
	ctx.fillStyle = "#d9c9ce";
	ctx.font = "bold 30px Roboto, sans-serif";
	ctx.fillText(`${letter}`, mx, my);

	return {
		letter,
		x,
		y,
		width,
		height
	};
}

function actionEndCap() {
    const data = {
        steps: -1,
        action : "no_op",
        x: null,
        y: null,
        key: null,
        time: Date.now(),
        duration: 500
    }
    return data
}

function getTotalStepDuration(steps) {
    return steps.reduce((sum, step, index, list) => {
        const prev = list[index - 1]?.time
        const curr = step.time;
        if (!prev) return 0;
        const diff = curr - prev
        sum += diff;
        return sum;
    }, 0) / 1000
}