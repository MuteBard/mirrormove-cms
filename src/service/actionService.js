const axios = require("axios");
const dayjs = require('dayjs')
const { log } = require("../util/log");
const jwt = require("jsonwebtoken");
const secretKey = "Metagross";

const contentServiceHost = "http://localhost:8080";

async function searchActions(searchPayload) {
    const params = searchPayload;
    const response = await axios.get(`${contentServiceHost}/action/search`, {
        params,
    });
    const result = parseData(response.data);
    return result;
}

async function createAction(data) {
    const body = prepareBody(data);
    const response = await axios.post(`${contentServiceHost}/action`, body);
    const result = parseData(response.data);
    return result;
}

async function updateAction(data) {
    const body = prepareBody(data);
    const response = await axios.patch(`${contentServiceHost}/action`, body);
    const result = parseData(response.data);
    return result;
}

async function getAction(id) {
    const response = await axios.get(`${contentServiceHost}/action/${id}`);
    const result = parseData(response.data);
    return result;
}

async function deleteAction(id) {
    const response = await axios.delete(`${contentServiceHost}/action/${id}`);
    const result = parseData(response.data);
    return result;
}

function prepareBody(data) {
    const payload = {
        steps: data.steps,
    };

    const token = jwt.sign(payload, secretKey);
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
        const { Token } = d;
        try {
            const { steps } = jwt.verify(Token, secretKey);
            return {
                id: d.Id,
                name: d.Name,
                createdAt: formatDate(d.CreatedAt),
                isHidden: d.IsHidden,
                description: d.Description,
                seconds: d.Seconds,
                steps,
            };
        } catch (err) {
            return {
                id: d.Id,
                name: d.Name,
                createdAt: d.CreatedAt,
                isHidden: d.IsHidden,
                description: d.Description,
                seconds: d.Seconds,
                steps: null,
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
