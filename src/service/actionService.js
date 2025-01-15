const axios = require("axios");
const { log } = require("../util/log");
const jwt = require("jsonwebtoken");
const secretKey = "Metagross";

const contentServiceHost = "http://localhost:8080";

async function searchActions(name) {
    const params = { name, sortOrder: "DESC", orderby: "NAME", isHidden: false };
    const response = await axios.get(`${contentServiceHost}/action/search`, {
        params,
    });
    const result = parseData(response.data);
    return response.data;
}

async function createAction(data) {
    const body = prepareBody(data);
    const response = await axios.post(`${contentServiceHost}/action`, body);
    return response.data;
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
        name: data.name,
        token,
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
                createdAt: d.CreatedAt,
                isHidden: d.IsHidden,
                steps,
            };
        } catch (err) {
            return {
                id: d.Id,
                name: d.Name,
                createdAt: d.CreatedAt,
                isHidden: d.IsHidden,
                steps: null,
            };
        }
    });
}

exports.searchActions = searchActions;
exports.createAction = createAction;
exports.getAction = getAction;
exports.deleteAction = deleteAction;
