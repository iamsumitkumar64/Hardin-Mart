import { Module } from "@nestjs/common";
import { RegisterUserController } from "./register-user.controller";
import { RegisterUserService } from "./register-user.handler";
import { UserRepository } from "src/module/user-module/infrastructure/repository/user.repository";
import { JwtHelperService } from "src/module/user-module/infrastructure/services/jwt.service";
import { BcryptService } from "src/common/infrastruture/services/bcrypt.service";
import { OutboxRepository } from "src/module/user-module/infrastructure/repository/outbox.repository";

@Module({
    imports: [],
    controllers: [RegisterUserController],
    providers: [
        UserRepository,
        RegisterUserService,
        JwtHelperService,
        BcryptService,
        OutboxRepository
    ],
    exports: [],
})

export class RegisterUserModule { }