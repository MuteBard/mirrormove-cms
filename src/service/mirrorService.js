const { mouse, straightTo, keyboard, Point, Button } = require("@nut-tree-fork/nut-js");
const { log } = require("../util/log");

async function click(position) {
	const point = new Point(position.x, position.y);
	await mouse.setPosition(point);
	await mouse.click(Button.LEFT);
}

async function clickMove(position) {
    const startPoint = { x: position.x1, y: position.y1 }; // Starting point of the drag
    const endPoint = { x: position.x2, y: position.y2 }; // Ending point of the drag
  
    await mouse.move(straightTo(startPoint));
    await mouse.pressButton(Button.LEFT);
    await mouse.move(straightTo(endPoint));
    await mouse.releaseButton(Button.LEFT);
}

async function keyPress(key) {
    await keyboard.type(key);
}

exports.click = click;
exports.clickMove = clickMove;
exports.keyPress = keyPress;