import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
    constructor() { }

    async hashPassword(password: string) {
        const saltOrRounds = process.env.BCRYPT_SALT_ROUNDS;
        const rounds = Number(saltOrRounds) || 10;
        const hashedPassword = await bcrypt.hash(password, rounds);

        return hashedPassword;
    }

    async verifyPassword(password: string, hash: string) {
        const isMatch = await bcrypt.compare(password, hash);
        return isMatch;
    }
}
