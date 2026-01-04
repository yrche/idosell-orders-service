import readline from 'node:readline';
import crypto from 'node:crypto';
import process from 'node:process';
import fs from "node:fs";

// TODO: modernize functionality
export class ApiKey {
    #logger;
    constructor({ path, logger}) {
        this.path = path;
        this.#logger = logger;
    }

    async writeToEnv(value) {
        const readStream = fs.createReadStream(this.path, {encoding: 'utf8'})
        const writeStream = fs.createWriteStream(this.path, {encoding: 'utf-8', flags: 'r+'})

        readStream.on("data", (chunk) => {
            if (chunk.match(/^API_KEY=[a-zA-Z0-9]+$/gm)) {
                this.#logger.warn('Api Key already exists')
            }
            writeStream.write(chunk.replace(/^API_KEY=[a-zA-Z0-9]+$/gm, " "))
            // writeStream.write(chunk.replace(/^API_KEY=[a-zA-Z0-9]+$/gm, `API_KEY=${value}`))
            // console.log(chunk.replace(/^API_KEY=[a-zA-Z0-9]+$/gm, `API_KEY=${value}`))
        })
    }

    async generate() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: true
        });

        rl.question('Enter secret phrase: ', async (secret) => {
            if (!secret || secret.length < 8) {
                this.#logger.error('Secret phrase must be at least 8 characters');
                rl.close();
                process.exit(1);
            }

            const apiKey = crypto

            await this.writeToEnv(apiKey)
            this.#logger.info('Api Key successfully generated')

            rl.close();
        });
    }
}

