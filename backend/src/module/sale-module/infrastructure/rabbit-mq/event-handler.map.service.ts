import { Injectable, Logger } from '@nestjs/common';
import { UserRegisteredMQEventPayload, OrderBilledMQEventPayload, OrderRefundMQEventPayload, OrderPaymentFailedMQEventPayload, OrderShippingLabelCreatedMQEventPayload, SaleEventHandlerMap } from './rabbit-mq.type';
import { UserRegisteredService } from 'src/module/sale-module/feature/user/user-registered/user-registered.handler';
import { OrderBilledService } from 'src/module/sale-module/feature/order/order-billed/order-billed.handler';
import { OrderRefundService } from 'src/module/sale-module/feature/order/order-refund/order-refund.handler';
import { OrderPaymentFailedService } from 'src/module/sale-module/feature/order/order-payment-failed/order-payment-failed.handler';
import { OrderShippingLabelCreatedService } from 'src/module/sale-module/feature/order/order-shipping-label-created/order-shipping-label-created.handler';
import { InboxRepository } from '../repository/inbox.repository';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class EventHandlerMapService {
    constructor(
        private readonly userRegisteredService: UserRegisteredService,
        private readonly orderBilledService: OrderBilledService,
        private readonly orderRefundService: OrderRefundService,
        private readonly orderPaymentFailedService: OrderPaymentFailedService,
        private readonly orderShippingLabelCreatedService: OrderShippingLabelCreatedService,
        private readonly inboxRepository: InboxRepository,
    ) { }
    private readonly logger = new Logger(EventHandlerMapService.name);

    // Map event names to handlers
    public eventHandlerMap: SaleEventHandlerMap = {
        'user.registered': [
            (payload: UserRegisteredMQEventPayload) => this.handleUserRegistered(payload),
        ],
        'order.billed': [
            (payload: OrderBilledMQEventPayload) => this.handleOrderBilled(payload),
        ],
        'order.refund': [
            (payload: OrderRefundMQEventPayload) => this.handleOrderRefund(payload),
        ],
        'payment.failed': [
            (payload: OrderPaymentFailedMQEventPayload) => this.handleOrderPaymentFailed(payload),
        ],
        'shipping.label.created': [
            (payload: OrderShippingLabelCreatedMQEventPayload) => this.handleOrderShippingLabelCreated(payload),
        ],
    };

    @Transactional({
        connectionName: process.env.DB_POSTGRES_SALE_SCHEMA || 'sale_schema',
    })
    async executeHandler(eventName: string, payload: any, outbox_uuid: string) {
        const handlers = this.eventHandlerMap[eventName];
        if (!handlers || !handlers.length) {
            this.logger.debug(`No handler found for event: ${eventName} in Sale Module`);
            return;
        }

        const alreadyProcessed = await this.inboxRepository.findByOutboxUuid(outbox_uuid);
        if (alreadyProcessed) {
            this.logger.debug(`Duplicated event: ${eventName} in Sale Module`);
            return;
        }
        for (const handler of handlers) {
            await handler(payload, outbox_uuid, eventName);
        }
        await this.inboxRepository.createEntry({ outbox_uuid, event_name: eventName });
    }

    async handleUserRegistered(payload: UserRegisteredMQEventPayload) {
        await this.userRegisteredService.handle(payload);
    }

    async handleOrderBilled(payload: OrderBilledMQEventPayload) {
        await this.orderBilledService.handle(payload);
    }

    async handleOrderRefund(payload: OrderRefundMQEventPayload) {
        await this.orderRefundService.handle(payload);
    }

    async handleOrderPaymentFailed(payload: OrderPaymentFailedMQEventPayload) {
        await this.orderPaymentFailedService.handle(payload);
    }

    async handleOrderShippingLabelCreated(payload: OrderShippingLabelCreatedMQEventPayload) {
        await this.orderShippingLabelCreatedService.handle(payload);
    }
}
