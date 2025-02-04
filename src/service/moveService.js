const axios = require("axios");
const dayjs = require('dayjs')
const jwt = require("jsonwebtoken");
const { JWT, CRUD } = require("../../settings")
const { generateToken } = require('./jwtTokenService')

function getHeaders() {
    return {
      headers: {
        Authorization: `Bearer ${generateToken()}`,
      },
    };
}

const contentServiceHost = `${CRUD.host}:${CRUD.port}`;

async function searchMoves(searchPayload) {
    const params = searchPayload;
    const response = await axios.get(`${contentServiceHost}/move/search`, {
        ...getHeaders(),
        params,
    });
    const result = parseData(response.data.data);
    return result;
}

async function createMove(data) {
    const body = prepareBody(data);
    const response = await axios.post(`${contentServiceHost}/move`, body, getHeaders());
    const result = parseData(response.data.data);
    return result;
}

async function updateMove(data) {
    const body = prepareBody(data);
    const response = await axios.patch(`${contentServiceHost}/move`, body, getHeaders());
    const result = parseData(response.data.data);
    return result;
}

async function getMove(id) {
    const response = await axios.get(`${contentServiceHost}/move/id/${id}`, getHeaders());
    const result = parseData(response.data.data);
    return result;
}

async function deleteMove(id) {
    const response = await axios.delete(`${contentServiceHost}/move/id/${id}`, getHeaders());
    const result = parseData(response.data.data);
    return result;
}

function prepareBody(data) {
    return {
        id: data?.id || undefined,
        name: data.name,
        description: data.description,
        seconds: data.seconds,
        actionLoops: data?.actionLoops || undefined,
    };
}

function parseActionData(data) {
    return data.map((d) => {
        const { token } = d;
        const { steps } = jwt.verify(token, JWT.stepKey);
        return {
            id: d.id,
            name: d.name,
            createdAt: formatDate(d.createdAt),
            updatedAt: formatDate(d.updatedAt),
            isHidden: d.isHidden,
            description: d.description,
            seconds: d.seconds,
            steps
        };
    });
}

function parseData(data) {
    return data.map((d, i) => {
        try {
            const actions = d.actions.map((al) => {
                return {
                    loops: al.loops,
                    action: parseActionData([al.action])[0]
                }
            })
            return {
                id: d.id,
                name: d.name,
                createdAt: formatDate(d.createdAt),
                updatedAt: formatDate(d.updatedAt),
                isHidden: d.isHidden,
                description: d.description,
                seconds: d.seconds,
                actions
            };
        } catch (err) {
            console.log(err)
            return null
        }
    }).filter(_ => _);
}

function formatDate(date) {    
    return dayjs(date).format('ddd, MM-DD-YYYY h:mm A');
}

exports.searchMoves = searchMoves;
exports.createMove = createMove;
exports.getMove = getMove;
exports.deleteMove = deleteMove;
exports.updateMove = updateMove;
