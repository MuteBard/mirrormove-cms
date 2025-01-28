const axios = require("axios");
const dayjs = require('dayjs')
const jwt = require("jsonwebtoken");
let secretKey = "";
try {
    const { key } = require("./env")
    secretKey = key
} catch(e) {
    console.log(e)
    secretKey = ""
}


const contentServiceHost = "http://localhost:8080";

async function searchMoves(searchPayload) {
    const params = searchPayload;
    const response = await axios.get(`${contentServiceHost}/move/search`, {
        params,
    });
    const result = parseData(response.data);
    return result;
}

async function createMove(data) {
    const body = prepareBody(data);
    const response = await axios.post(`${contentServiceHost}/move`, body);
    const result = parseData(response.data);
    return result;
}

async function updateMove(data) {
    const body = prepareBody(data);
    const response = await axios.patch(`${contentServiceHost}/move`, body);
    const result = parseData(response.data);
    return result;
}

async function getMove(id) {
    const response = await axios.get(`${contentServiceHost}/move/${id}`);
    const result = parseData(response.data);
    return result;
}

async function deleteMove(id) {
    const response = await axios.delete(`${contentServiceHost}/move/${id}`);
    const result = parseData(response.data);
    return result;
}

function prepareBody(data) {
    return {
        Id: data?.id || undefined,
        Name: data.name,
        Description: data.description,
        Seconds: data.seconds,
        ActionLoops: data?.actionLoops || undefined,
    };
}

function parseActionData(data) {
    return data.map((d) => {
        const { Token } = d;
        const { steps } = jwt.verify(Token, secretKey);
        return {
            id: d.Id,
            name: d.Name,
            createdAt: formatDate(d.CreatedAt),
            updatedAt: formatDate(d.UpdatedAt),
            isHidden: d.IsHidden,
            description: d.Description,
            seconds: d.Seconds,
            steps
        };
    });
}


function parseData(data) {
    return data.map((d, i) => {
        try {
            const actions = d.Actions.map((al) => {
                return {
                    loops: al.Loops,
                    action: parseActionData([al.Action])[0]
                }
            })
            return {
                id: d.Id,
                name: d.Name,
                createdAt: formatDate(d.CreatedAt),
                updatedAt: formatDate(d.UpdatedAt),
                isHidden: d.IsHidden,
                description: d.Description,
                seconds: d.Seconds,
                actions
            };
        } catch (err) {
            console.log(err)
            return {
                id: "hidden",
                name: "hidden",
                createdAt: "hidden",
                updatedAt: "hidden",
                isHidden: "hidden",
                description: "hidden",
                seconds: "hidden",
                actions: "hidden",
            };
        }
    });
}

function formatDate(date) {    
    return dayjs(date).format('ddd, MM-DD-YYYY h:mm A');
}

exports.searchMoves = searchMoves;
exports.createMove = createMove;
exports.getMove = getMove;
exports.deleteMove = deleteMove;
exports.updateMove = updateMove;
