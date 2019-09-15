"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const os_1 = require("os");
const path_1 = require("path");
const util_1 = require("util");
const ask = __importStar(require("./ask"));
const env_1 = require("./env");
const logger_1 = require("./logger");
const logger = logger_1.create('auth');
const read = util_1.promisify(fs_1.readFile);
const write = util_1.promisify(fs_1.writeFile);
const DEFAULT_CONFIG = path_1.join(os_1.homedir(), '.verse');
const getConfigPath = (filepath = DEFAULT_CONFIG) => {
    logger.log(`resolving path for '${filepath}'`);
    const normalized = filepath.startsWith('~')
        ? filepath.replace(/^~/, os_1.homedir())
        : filepath;
    return path_1.resolve(normalized);
};
exports.get = async (filepath) => {
    if (env_1.NODE_ENV === 'development' && env_1.GENIUS_ACCESS_TOKEN) {
        logger.log('using genius token from environment');
        return env_1.GENIUS_ACCESS_TOKEN;
    }
    const configPath = getConfigPath(filepath);
    try {
        logger.log('reading token from config');
        const config = await read(configPath);
        if (config) {
            logger.log('genius token found');
            return config.toString();
        }
        logger.log('no config found');
    }
    catch (error) {
        logger.error('failed to read config');
    }
    logger.warn(`no genius token found`);
    return null;
};
exports.set = async (filepath, token) => {
    const configPath = getConfigPath(filepath);
    try {
        logger.log(`writing token to '${configPath}'`);
        await write(configPath, token);
    }
    catch (error) {
        logger.error(`failed to write config`);
    }
};
exports.reset = async (filepath) => {
    logger.log(`clearing genius token`);
    await exports.set(filepath, '');
};
exports.ensure = async (filepath) => {
    logger.log(`ensuring genius token`);
    const cached = await exports.get(filepath);
    if (cached) {
        logger.log(`using cached genius token`);
        return cached;
    }
    const token = await ask.token();
    await exports.set(filepath, token);
    return token;
};
