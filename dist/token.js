"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const inquirer_1 = require("inquirer");
const keytar_1 = require("keytar");
const { env: { GENIUS_CLIENT_ACCESS_TOKEN } } = process;
const service = 'Genius API token';
const account = 'verse-cli';
const question = {
    message: 'Please enter Genius API client token:',
    type: 'password',
    name: 'token',
    mask: '*'
};
exports.clear = async () => {
    await keytar_1.deletePassword(service, account);
    console.log(chalk_1.cyan('✔ Genius API access token cleared'));
};
exports.get = async () => {
    if (GENIUS_CLIENT_ACCESS_TOKEN) {
        return Promise.resolve(GENIUS_CLIENT_ACCESS_TOKEN);
    }
    const cached = await keytar_1.findPassword(service);
    return cached
        ? keytar_1.getPassword(service, account)
        : inquirer_1.prompt(question).then(async ({ token }) => {
            await keytar_1.setPassword(service, account, token);
            return token;
        });
};
//# sourceMappingURL=token.js.map