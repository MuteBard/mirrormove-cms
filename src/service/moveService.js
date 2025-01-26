const axios = require("axios");
const dayjs = require('dayjs')
const { log } = require("../util/log");
const jwt = require("jsonwebtoken");
const secretKey = "Metagross";

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
        try {
            const { steps } = jwt.verify(Token, secretKey);
            return {
                id: d.Id,
                name: d.Name,
                createdAt: formatDate(d.CreatedAt),
                updateAt: formatDate(d.UpdatedAt),
                isHidden: d.IsHidden,
                description: d.Description,
                seconds: d.Seconds,
                steps
            };
        } catch (err) {
            console.log(err)
            return {
                id: d.Id,
                name: d.Name,
                createdAt: d.CreatedAt,
                updatedAt: d.UpdatedAt,
                isHidden: d.IsHidden,
                description: d.Description,
                seconds: d.Seconds,
                steps: null,
            };
        }
    });
}


function parseData(data) {
    return data.map((d, i) => {
        try {
            const actions = d.Actions.map((al) => {
                return {
                    loops: al.Loops,
                    action: parseActionData([al.Action])
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
                id: d.Id,
                name: d.Name,
                createdAt: formatDate(d.CreatedAt),
                updatedAt: formatDate(d.UpdatedAt),
                isHidden: d.IsHidden,
                description: d.Description,
                seconds: d.Seconds,
                actions: null
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
