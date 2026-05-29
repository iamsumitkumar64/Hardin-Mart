import { BadRequestException, Injectable, } from "@nestjs/common";
import { UserRegisteredMQEventPayload } from "src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.type";
import { UserRepository } from "src/module/shipment-module/infrastructure/repository/user.repository";

@Injectable()
export class UserRegisterService {
    constructor(
        private readonly userRepository: UserRepository,
    ) { }

    async handle(payload: UserRegisteredMQEventPayload) {
        const isUserExists = await this.userRepository.findByEmail(payload.email);
        if (isUserExists.length) {
            console.warn(`Duplicate skipped: ${isUserExists[0].email}`);
            return;
        }

        await this.userRepository.register(payload);
        return;
    }
}