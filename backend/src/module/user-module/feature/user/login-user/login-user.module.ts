import { Module } from "@nestjs/common";
import { LoginUserController } from "./login-user.controller";
import { LoginUserService } from "./login-user.handler";
import { UserRepository } from "src/module/user-module/infrastructure/repository/user.repository";
import { JwtHelperService } from "src/module/user-module/infrastructure/services/jwt.service";
import { BcryptService } from "src/common/infrastruture/services/bcrypt.service";

@Module({
    imports: [],
    controllers: [LoginUserController],
    providers: [UserRepository, LoginUserService, JwtHelperService, BcryptService],
    exports: [],
})

export class LoginUserModule { }