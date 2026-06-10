import { BadRequestException, Injectable } from "@nestjs/common";
import { RegisterUserDto } from "./register-user.dto";
import type { Request } from "express";
import { RabbitMQService } from "src/common/infrastruture/rabbit-mq/rabbit-mq.service";
import { UserRepository } from "src/module/user-module/infrastructure/repository/user.repository";
import { BcryptService } from "src/common/infrastruture/services/bcrypt.service";
import { JwtHelperService } from "src/module/user-module/infrastructure/services/jwt.service";
import { ExchangeNameEnum, RoutingKeyEnum } from "src/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum";
import { OutboxRepository } from "src/module/user-module/infrastructure/repository/outbox.repository";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class RegisterUserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly bcryptService: BcryptService,
        private readonly jwtHelperService: JwtHelperService,
        private readonly rabbitMQService: RabbitMQService,
        private readonly outboxRepository: OutboxRepository,
    ) { }

    @Transactional({
        connectionName: process.env.DB_POSTGRES_USER_SCHEMA || 'user_schema',
    })
    async handle(req: Request, body: RegisterUserDto) {
        //check if already exists using this email
        const isUserExists = await this.userRepository.findByEmail(body.email);
        if (isUserExists.length) {
            throw new BadRequestException('User Already Exists with this Email');
        }

        //hashed password using bcrypt
        body.password = await this.bcryptService.hashPassword(body.password);

        //register user in DB
        const RegisteredUser = await this.userRepository.register(body);

        // generate token for accessing resources
        const token = await this.jwtHelperService.generateJwtToken(RegisteredUser);

        // not publish direct to mq-queue
        // await this.rabbitMQService.publishToExchange(
        //     ExchangeNameEnum.USER_EXCHANGE,
        //     RoutingKeyEnum.USER_REGISTERED,
        //     RegisteredUser,
        // );

        // make entry of publish exchange
        await this.outboxRepository.createOutboxEntry({
            exchange_name: ExchangeNameEnum.USER_EXCHANGE,
            routing_key: RoutingKeyEnum.USER_REGISTERED,
            event_name: RoutingKeyEnum.USER_REGISTERED,
            message_payload: RegisteredUser,
        });

        return;
    }
}