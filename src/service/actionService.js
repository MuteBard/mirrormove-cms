const axios = require("axios");
const dayjs = require('dayjs')
const jwt = require("jsonwebtoken");

let secretKey = "";
try {
    const { key } = require("./env") // create your own 
    secretKey = key
} catch(e) {
    console.log(e)
    secretKey = ""
}

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

    const Token = jwt.sign(payload, secretKey);
    return {
        Id: data?.id || undefined,
        Name: data.name,
        Description: data.description,
        Seconds: data.seconds,
        Token
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
                updatedAt: formatDate(d.UpdatedAt),
                isHidden: d.IsHidden,
                description: d.Description,
                seconds: d.Seconds,
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
