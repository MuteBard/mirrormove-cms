function log(terminal, data, type) {
    terminal.style.backgroundColor = "black";
    terminal.style.fontFamily = "Roboto, sans-serif";

    type = !type ? typeof data : type;

    const heading = document.createElement("h3");

    switch (type) {
        case "boolean":
            heading.style.color = "#ff85a2";
            heading.textContent = data;
            break;
        case "number":
            heading.style.color = "#ffc862";
            heading.textContent = data;
            break;
        case "string":
            heading.style.color = "#91dd77";
            heading.textContent = data;
            break;
        case "error":
            heading.style.color = "#ff6e61";
            heading.textContent = data;
            break;
        case "object":
            heading.style.color = "#00cd99";
            heading.textContent = JSON.stringify(data, null, 4)
            break;
        default:
            heading.style.color = "#ffffff";
            heading.textContent = data;
    }

    heading.style.margin = '1em';
    terminal.appendChild(heading);
}

async function safeExec(terminal, func) {
    try {
        await func()
    } catch(e){
        log(terminal, e.toString(), "error")
    }
}

exports.log = log;
exports.safeExec = safeExec;
