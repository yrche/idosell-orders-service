import readline from 'node:readline';
import crypto from 'node:crypto';
import process from 'node:process';
import fs from "node:fs";

export class ApiKey {
    constructor(path, salt) {
        this.path = path
        this.salt = salt
    }

    async writeToEnv(data) {
        await fs.writeFile(this.path, `\nAPI_KEY=${data}`, {flag: 'a'}, err => {})
    }

    async generate() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: true
        });

        rl.question('Enter secret phrase: ', async (secret) => {
            if (!secret || secret.length < 8) {
                console.error('Secret phrase must be at least 8 characters');
                rl.close();
                process.exit(1);
            }

            const apiKey = crypto
                .createHmac('sha256', this.salt)
                .update(secret)
                .digest('hex');

            await this.writeToEnv(apiKey)

            console.log('\nGenerated API KEY:\n');
            console.log(apiKey);

            rl.close();
        });
    }
}