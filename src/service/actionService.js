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

async function searchActions(searchPayload) {
    const params = searchPayload;
    const response = await axios.get(`${contentServiceHost}/action/search`, {
        ...getHeaders(),
        params,
    });
    const result = parseData(response.data.data);
    return result;
}

async function createAction(data) {
    const body = prepareBody(data);
    const response = await axios.post(`${contentServiceHost}/action`, body, getHeaders());
    const result = parseData(response.data.data);
    return result;
}

async function updateAction(data) {
    const body = prepareBody(data);
    const response = await axios.patch(`${contentServiceHost}/action`, body, getHeaders());
    const result = parseData(response.data.data);
    return result;
}

async function getAction(id) {
    const response = await axios.get(`${contentServiceHost}/action/id/${id}`, getHeaders());
    const result = parseData(response.data.data);
    return result;
}

async function deleteAction(id) {
    const response = await axios.delete(`${contentServiceHost}/action/id/${id}`, getHeaders());
    const result = parseData(response.data.data);
    return result;
}

function prepareBody(data) {
    const payload = {
        steps: data.steps,
    };

    const token = jwt.sign(payload, JWT.stepKey);
    return {
        id: data?.id || undefined,
        name: data.name,
        description: data.description,
        seconds: data.seconds,
        token
    };
}
function parseData(data) {
    return data.map((d) => {
        const { token } = d;
        try {
            const { steps } = jwt.verify(token, JWT.stepKey);

            return {
                id: d.id,
                name: d.name,
                createdAt: formatDate(d.createdAt),
                updatedAt: formatDate(d.updatedAt),
                isHidden: d.isHidden,
                description: d.description,
                seconds: d.seconds,
                steps,
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
                steps: "hidden",
            };
        }
    });
}

function formatDate(date) {    
    return dayjs(date).format('ddd, MM-DD-YYYY h:mm A');
}

exports.searchActions = searchActions;
exports.createAction = createAction;
exports.getAction = getAction;
exports.deleteAction = deleteAction;
exports.updateAction = updateAction;
