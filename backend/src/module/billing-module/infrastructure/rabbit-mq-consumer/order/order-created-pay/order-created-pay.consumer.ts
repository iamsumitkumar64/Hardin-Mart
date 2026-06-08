import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from 'src/module/common/infrastruture/rabbit-mq/rabbit-mq.service';
import { ExchangeNameEnum, ExchangeTypeEnum, QueueEnum, RoutingKeyEnum } from 'src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum';
import { RabbitMQConsumerMessage, BillingOrderCreatedPayMQEventPayload } from 'src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.type';
import { InboxRepository } from '../../../repository/inbox.repository';
import { PayOrderService } from 'src/module/billing-module/feature/wallet/pay-order/pay-order.handler';

@Injectable()
export class OrderCreatedPayConsumer implements OnModuleInit {
    private readonly logger = new Logger(OrderCreatedPayConsumer.name);

    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly inboxRepository: InboxRepository,
        private readonly payOrderService: PayOrderService,
    ) { }

    async onModuleInit() {
        await this.rabbitMQService.consumeMessages<RabbitMQConsumerMessage<BillingOrderCreatedPayMQEventPayload>>(
            QueueEnum.BILLING_ORDER_PLACED_QUEUE,
            async (data) => {
                const { outbox_uuid, payload } = data;

                this.logger.log(`Processing order paying: ${payload.order_uuid} \n ${JSON.stringify(payload)}`);

                const alreadyProcessed = await this.inboxRepository.findByOutboxUuid(outbox_uuid);
                if (alreadyProcessed) {
                    this.logger.warn(`Duplicate skipped: ${outbox_uuid}`);
                    return;
                }

                await this.payOrderService.handle(payload.user_uuid, { order_uuid: payload.order_uuid });

                await this.inboxRepository.createEntry({ outbox_uuid });
            },
        );
    }
}