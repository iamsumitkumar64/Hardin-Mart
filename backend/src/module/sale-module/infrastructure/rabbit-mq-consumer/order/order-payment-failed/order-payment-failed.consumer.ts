import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from 'src/common/infrastruture/rabbit-mq/rabbit-mq.service';
import { ExchangeNameEnum, ExchangeTypeEnum, QueueEnum, RoutingKeyEnum } from 'src/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum';
import { RabbitMQConsumerMessage, OrderPaymentFailedMQEventPayload } from 'src/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.type';
import { InboxRepository } from '../../../repository/inbox.repository';
import { OrderPaymentFailedService } from 'src/module/sale-module/feature/order/order-payment-failed/order-payment-failed.handler';

@Injectable()
export class OrderPaymentFailedConsumer implements OnModuleInit {
    private readonly logger = new Logger(OrderPaymentFailedConsumer.name);

    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly inboxRepository: InboxRepository,
        private readonly orderPaymentFailedService: OrderPaymentFailedService,
    ) { }

    async onModuleInit() {
        await this.rabbitMQService.consumeMessages<RabbitMQConsumerMessage<OrderPaymentFailedMQEventPayload>>(
            QueueEnum.SALE_PAYMENT_FAILED_QUEUE,
            async (data) => {
                const { outbox_uuid, payload, event_name } = data;

                this.logger.log(`Processing order Payment Failed: ${payload.order_uuid} \n ${JSON.stringify(payload)}`);

                const alreadyProcessed = await this.inboxRepository.findByOutboxUuid(outbox_uuid);
                if (alreadyProcessed) {
                    this.logger.warn(`Duplicate skipped: ${outbox_uuid}`);
                    return;
                }

                await this.orderPaymentFailedService.handle(payload);

                await this.inboxRepository.createEntry({ outbox_uuid, event_name });
            },
        );
    }
}