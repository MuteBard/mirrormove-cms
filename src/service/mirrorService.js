const { mouse, straightTo, keyboard, Point, Button } = require("@nut-tree-fork/nut-js");
const { log } = require("../util/log");

async function click(position, terminal) {
	const point = new Point(position.x1, position.y1);
	await mouse.setPosition(point);
	await mouse.click(Button.LEFT);
}

async function clickMove(position, terminal) {
    log(terminal, "clickMove IN")
    const startPoint = { x: position.x1, y: position.y1 }; // Starting point of the drag
    const endPoint = { x: position.x1, y: position.y2 }; // Ending point of the drag
  
    await mouse.move(straightTo(startPoint));
    await mouse.pressButton(mouse.Button.LEFT);
    await mouse.move(straightTo(endPoint));
    await mouse.releaseButton(mouse.Button.LEFT);
}

async function clickPress(terminal) {
    log(terminal, "clickPress IN")
    await mouse.pressButton(Button.LEFT)
}

async function clickRelease(terminal) {
    log(terminal, "clickRelease IN")
    await mouse.releaseButton(Button.LEFT); 
}

async function keyPress(key, terminal) {
    log(terminal, "keyPress IN")
    await keyboard.type(key);
}

exports.click = click;
exports.clickMove = clickMove;
exports.clickPress = clickPress;
exports.clickRelease = clickRelease;
exports.keyPress = keyPress;