import { UserEntity } from "src/domain/user/user.entity";

declare module 'express' {
    interface Request {
        user: UserEntity;
    }
}