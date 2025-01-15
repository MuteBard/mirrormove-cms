const { log, safeExec } = require("./util/log");
const { makeFile } = require("./service/fileManager");
const { searchActions, createAction, getAction, deleteAction } = require("./service/actionService");
const { click, clickMove, keyPress } = require("./service/mirrorService");


const container = document.getElementById("container");
const canvas = document.createElement("canvas");

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

canvas.width = screenWidth - 50;
canvas.height = screenHeight - 40;
const ctx = canvas.getContext("2d");

let terminal = document.getElementById("terminal");
terminal.style.padding = '1em';
step = 0;
let isDragging = false;
let recordedData = [];
let keyPressStartTime = null;
let fileName = "saveLogs";
let isLogging = false;
let moveCount = 0;

function setInitialState() {
    isDragging = false;
    recordedData = [];
    keyPressStartTime = null;
    fileName = "saveLogs";
    isLogging = false;
}

saveRecords();
executeRecords();
// toggleButtonsState();
container.appendChild(canvas);


window.addEventListener('keydown', function(event) {
    if (event.keyCode === 27 || event.key === 'Escape') { 
        process.exit(1);
    }
});

function listenToMovement() {
    
    log(terminal, true);
    log(terminal, 3);
    log(terminal, "abc");
    log(terminal, {a:2, b:3})

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
                action : "key press",
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
        log(terminal, "Logging started")
        safeExec(terminal, listenToMovement)
    });

    saveActionButton.addEventListener("click", () => {
        isLogging = false;
        log(terminal, "Logging saved")
        const path = `./data/${fileName}.json`;

        const reversedCopy = [...recordedData].reverse();
        const index = reversedCopy.findIndex((data) => data.action === "click");
        const filteredData = [...reversedCopy.slice(index + 1)].reverse();
        const steps = filteredData;

        const actionInput = document.getElementById('actionNameInput');
        const actionName = actionInput.value;

        const data = {
            name: actionName,
            steps 
        }

        log(terminal, JSON.stringify(data))

        safeExec(terminal, async () => {
            // await searchActions(terminal, "test")
            await createAction(data)
            // await getAction(terminal, 9)
            // await deleteAction(terminal, 7)
        })
    });

    cancelActionButton.addEventListener("click", () => {
        setInitialState();
        log(terminal, "Logging canceled")
        log(terminal, isLogging)
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

    runActionButton.addEventListener("click", async () => {
        setInitialState();
        prepRunWindow();
        const action = await getAction(15);
        log(terminal, triggerAction(action[0], "run", 2000))
    });

    demoActionButton.addEventListener("click", async () => {
        setInitialState();
        prepDemoWindow();
        const action = await getAction(15);
        log(terminal, triggerAction(action[0], "demo", 2000))
    });
}

function triggerAction(action, executionType, milliOffset) {
    let wait = milliOffset;
    const timedSteps = action.steps.map((step, index, steps) => {
        const {time, position, act} = getResponse(steps[index - 1], step, steps[index + 1])
        wait += time + 500;
        return {
            step,
            wait,
            position,
            act
        }
    })

    timedSteps.map((ts) => {
        setTimeout(() => {
            let position = ts?.position;
            let action = ts?.step?.action;
            let key = ts?.step?.key;

            if (action === "key press") {
                if (executionType === "run"){
                    keyPress(key, terminal)
                }
                else if(executionType === "demo"){
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    createBoxLetter(key || "mouse")
                }
                log(terminal, ts?.step?.key);  
            } 
            else {
                if (ts?.act?.next) {
                    if (executionType === "run"){
                        clickMove(position);
                    }
                    else if(executionType === "demo"){
                        const {x, y, width, height} = createBoxLetter("");
                        ctx.clearRect(x, y, width, height);
                        drawLine(position);
                    }
                    log(terminal, position)
                }
            }
        }, ts.wait)
    })

    clickRelease(terminal)
    return wait
}

async function prepRunWindow() {
    container.style.display = "none";
	if (typeof nw !== "undefined" && nw.App) {
		const win = nw.Window.get();
        win.transparent = true; 
        win.setTransparent(win.transparent);
        win.frame = false;
        win.minimize();
        click({x: screenWidth /2, y: screenHeight/2});
	}
}

async function prepDemoWindow() {
    container.style.display = "inline";
	if (typeof nw !== "undefined" && nw.App) {
		const win = nw.Window.get();
        win.transparent = false; 
        win.setTransparent(win.transparent); 
        win.frame = true;
        click({x: screenWidth /2, y: screenHeight/2});
	}
}

function getResponse(prevStep, currStep, nextStep) {
    let currTime = currStep.time
    let prevTime = !prevStep ? currTime : prevStep.time

    let currPos = { x: currStep.x, y: currStep.y }
    let nextPos = !nextStep ? currPos : { x: nextStep.x, y: nextStep.y }

    let time = currTime - prevTime;
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

// function toggleButtonsState() {
//     const inputElement = document.getElementById('actionNameInput');
//     const buttonsToDisable = document.querySelectorAll('.disable-on-empty');
//     inputElement.addEventListener('input', () => {
//         const isInputEmpty = inputElement.value.trim() === '';

//         buttonsToDisable.forEach(button => {
//             button.disabled = isInputEmpty; 
//         });
//     });
// }
