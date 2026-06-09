import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from 'src/module/common/infrastruture/rabbit-mq/rabbit-mq.service';
import { ExchangeNameEnum, ExchangeTypeEnum, QueueEnum, RoutingKeyEnum } from 'src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum';
import { RabbitMQConsumerMessage, OrderBilledMQEventPayload } from 'src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.type';
import { InboxRepository } from '../../../repository/inbox.repository';
import { OrderBilledService } from 'src/module/sale-module/feature/order/order-billed/order-billed.handler';

@Injectable()
export class OrderBilledConsumer implements OnModuleInit {
    private readonly logger = new Logger(OrderBilledConsumer.name);

    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly inboxRepository: InboxRepository,
        private readonly orderBilledService: OrderBilledService,
    ) { }

    async onModuleInit() {
        await this.rabbitMQService.consumeMessages<RabbitMQConsumerMessage<OrderBilledMQEventPayload>>(
            QueueEnum.SALE_ORDER_BILLED_QUEUE,
            async (data) => {
                const { outbox_uuid, payload } = data;

                this.logger.log(`Processing order Billed: ${payload.order_uuid} \n ${JSON.stringify(payload)}`);

                const alreadyProcessed = await this.inboxRepository.findByOutboxUuid(outbox_uuid);
                if (alreadyProcessed) {
                    this.logger.warn(`Duplicate skipped: ${outbox_uuid}`);
                    return;
                }

                await this.orderBilledService.handle(payload);

                await this.inboxRepository.createEntry({ outbox_uuid });
            },
        );
    }
}