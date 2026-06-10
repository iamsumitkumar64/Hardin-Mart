import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from 'src/common/infrastruture/rabbit-mq/rabbit-mq.service';
import { ExchangeNameEnum, ExchangeTypeEnum, QueueEnum, RoutingKeyEnum } from 'src/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum';
import { BackOrderedMQEventPayload, RabbitMQConsumerMessage, } from 'src/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.type';
import { InboxRepository } from '../../../repository/inbox.repository';
import { OrderRefundService } from 'src/module/billing-module/feature/order/order-refund/order-refund.handler';

@Injectable()
export class BackOrderedConsumer implements OnModuleInit {
    private readonly logger = new Logger(BackOrderedConsumer.name);

    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly inboxRepository: InboxRepository,
        private readonly orderRefundService: OrderRefundService,
    ) { }

    async onModuleInit() {
        await this.rabbitMQService.consumeMessages<RabbitMQConsumerMessage<BackOrderedMQEventPayload>>(
            QueueEnum.BILLING_BACK_ORDERED_QUEUE,
            async (data) => {
                const { outbox_uuid, payload, event_name } = data;

                this.logger.log(`Processing back ordered: ${payload.order_uuid} \n ${JSON.stringify(payload)}`);

                const alreadyProcessed = await this.inboxRepository.findByOutboxUuid(outbox_uuid);
                if (alreadyProcessed) {
                    this.logger.warn(`Duplicate skipped: ${outbox_uuid}`);
                    return;
                }

                await this.orderRefundService.handle(payload);

                await this.inboxRepository.createEntry({ outbox_uuid, event_name });
            },
        );
    }
}