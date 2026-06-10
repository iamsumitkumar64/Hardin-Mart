import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from 'src/common/infrastruture/rabbit-mq/rabbit-mq.service';
import { ExchangeNameEnum, ExchangeTypeEnum, QueueEnum, RoutingKeyEnum } from 'src/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum';
import { RabbitMQConsumerMessage, OrderShippingLabelCreatedMQEventPayload } from 'src/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.type';
import { InboxRepository } from '../../../repository/inbox.repository';
import { OrderShippingLabelCreatedService } from 'src/module/sale-module/feature/order/order-shipping-label-created/order-shipping-label-created.handler';

@Injectable()
export class OrderShippingLabelCreatedConsumer implements OnModuleInit {
    private readonly logger = new Logger(OrderShippingLabelCreatedConsumer.name);

    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly inboxRepository: InboxRepository,
        private readonly orderShippingLabelCreatedService: OrderShippingLabelCreatedService,
    ) { }

    async onModuleInit() {
        await this.rabbitMQService.consumeMessages<RabbitMQConsumerMessage<OrderShippingLabelCreatedMQEventPayload>>(
            QueueEnum.SALE_SHIPPING_LABEL_CREATED_QUEUE,
            async (data) => {
                const { outbox_uuid, payload, event_name } = data;

                this.logger.log(`Processing shipping label created: ${payload.order_uuid} \n ${JSON.stringify(payload)}`);

                const alreadyProcessed = await this.inboxRepository.findByOutboxUuid(outbox_uuid);
                if (alreadyProcessed) {
                    this.logger.warn(`Duplicate skipped: ${outbox_uuid}`);
                    return;
                }

                await this.orderShippingLabelCreatedService.handle(payload);

                await this.inboxRepository.createEntry({ outbox_uuid, event_name });
            },
        );
    }
}