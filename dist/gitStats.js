"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUserData = void 0;
const octokit_1 = require("octokit");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: 'SECRETS.env' });
const octokit = new octokit_1.Octokit({ auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN });
function fetchUserData(username, callback) {
    console.log("yeet");
    octokit.request('GET /users/{username}', {
        username: username,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    }).then((response) => {
        callback(response.data);
    }).catch((error) => {
        console.error(error);
    });
}
exports.fetchUserData = fetchUserData;
