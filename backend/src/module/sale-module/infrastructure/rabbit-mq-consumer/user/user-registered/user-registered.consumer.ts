import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UserRepository } from '../../../repository/user.repository';
import { RabbitMQService } from 'src/common/infrastruture/rabbit-mq/rabbit-mq.service';
import { ExchangeNameEnum, ExchangeTypeEnum, QueueEnum, RoutingKeyEnum } from 'src/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum';
import { RabbitMQConsumerMessage, UserRegisteredMQEventPayload } from 'src/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.type';
import { InboxRepository } from '../../../repository/inbox.repository';
import { UserRegisterService } from 'src/module/sale-module/feature/user/user-register/user-register.handler';

@Injectable()
export class UserRegisteredConsumer implements OnModuleInit {
    private readonly logger = new Logger(UserRegisteredConsumer.name);

    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly userRegisterService: UserRegisterService,
        private readonly inboxRepository: InboxRepository,
    ) { }

    async onModuleInit() {
        await this.rabbitMQService.consumeMessages<RabbitMQConsumerMessage<UserRegisteredMQEventPayload>>(
            QueueEnum.SALE_USER_REGISTERED_QUEUE,
            async (data) => {
                const { outbox_uuid, payload, event_name } = data;

                this.logger.log(`Processing registered user: ${payload.email} \n ${JSON.stringify(payload)}`);

                const alreadyProcessed = await this.inboxRepository.findByOutboxUuid(outbox_uuid);
                if (alreadyProcessed) {
                    this.logger.warn(`Duplicate skipped: ${outbox_uuid}`);
                    return;
                }

                await this.userRegisterService.handle(payload);

                await this.inboxRepository.createEntry({ outbox_uuid, event_name });
            },
        );
    }
}