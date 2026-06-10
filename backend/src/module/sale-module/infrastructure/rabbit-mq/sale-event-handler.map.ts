import { Injectable } from '@nestjs/common';
import { RabbitMQConsumerMessage, UserRegisteredMQEventPayload, OrderBilledMQEventPayload, OrderRefundMQEventPayload, OrderPaymentFailedMQEventPayload, OrderShippingLabelCreatedMQEventPayload } from './rabbit-mq.type';
import { UserRegisterService as SaleUserRegisterService } from 'src/module/sale-module/feature/user/user-register/user-register.handler';
import { OrderBilledService } from 'src/module/sale-module/feature/order/order-billed/order-billed.handler';
import { OrderRefundService } from 'src/module/sale-module/feature/order/order-refund/order-refund.handler';
import { OrderPaymentFailedService } from 'src/module/sale-module/feature/order/order-payment-failed/order-payment-failed.handler';
import { OrderShippingLabelCreatedService } from 'src/module/sale-module/feature/order/order-shipping-label-created/order-shipping-label-created.handler';
import { InboxRepository } from '../repository/inbox.repository';

@Injectable()
export class SaleEventHandlerMap {
    constructor(
        private readonly userRegisterService: SaleUserRegisterService,
        private readonly orderBilledService: OrderBilledService,
        private readonly orderRefundService: OrderRefundService,
        private readonly orderPaymentFailedService: OrderPaymentFailedService,
        private readonly orderShippingLabelCreatedService: OrderShippingLabelCreatedService,
        private readonly inboxRepository: InboxRepository,
    ) { }

    async handleUserRegistered(payload: UserRegisteredMQEventPayload, outbox_uuid: string, event_name: string) {
        const alreadyProcessed = await this.inboxRepository.findByOutboxUuid(outbox_uuid);
        if (alreadyProcessed) {
            return;
        }

        await this.userRegisterService.handle(payload);
        await this.inboxRepository.createEntry({ outbox_uuid, event_name });
    }

    async handleOrderBilled(payload: OrderBilledMQEventPayload, outbox_uuid: string, event_name: string) {
        const alreadyProcessed = await this.inboxRepository.findByOutboxUuid(outbox_uuid);
        if (alreadyProcessed) {
            return;
        }

        await this.orderBilledService.handle(payload);
        await this.inboxRepository.createEntry({ outbox_uuid, event_name });
    }

    async handleOrderRefund(payload: OrderRefundMQEventPayload, outbox_uuid: string, event_name: string) {
        const alreadyProcessed = await this.inboxRepository.findByOutboxUuid(outbox_uuid);
        if (alreadyProcessed) {
            return;
        }

        await this.orderRefundService.handle(payload);
        await this.inboxRepository.createEntry({ outbox_uuid, event_name });
    }

    async handleOrderPaymentFailed(payload: OrderPaymentFailedMQEventPayload, outbox_uuid: string, event_name: string) {
        const alreadyProcessed = await this.inboxRepository.findByOutboxUuid(outbox_uuid);
        if (alreadyProcessed) {
            return;
        }

        await this.orderPaymentFailedService.handle(payload);
        await this.inboxRepository.createEntry({ outbox_uuid, event_name });
    }

    async handleOrderShippingLabelCreated(payload: OrderShippingLabelCreatedMQEventPayload, outbox_uuid: string, event_name: string) {
        const alreadyProcessed = await this.inboxRepository.findByOutboxUuid(outbox_uuid);
        if (alreadyProcessed) {
            return;
        }

        await this.orderShippingLabelCreatedService.handle(payload);
        await this.inboxRepository.createEntry({ outbox_uuid, event_name });
    }

    // Map event names to handlers
    public eventHandlerMap: Record<string, (payload: any, outbox_uuid: string, event_name: string) => Promise<void>> = {
        'user.registered': (payload: UserRegisteredMQEventPayload, outbox_uuid: string, event_name: string) =>
            this.handleUserRegistered(payload, outbox_uuid, event_name),
        'order.billed': (payload: OrderBilledMQEventPayload, outbox_uuid: string, event_name: string) =>
            this.handleOrderBilled(payload, outbox_uuid, event_name),
        'order.refund': (payload: OrderRefundMQEventPayload, outbox_uuid: string, event_name: string) =>
            this.handleOrderRefund(payload, outbox_uuid, event_name),
        'payment.failed': (payload: OrderPaymentFailedMQEventPayload, outbox_uuid: string, event_name: string) =>
            this.handleOrderPaymentFailed(payload, outbox_uuid, event_name),
        'shipping.label.created': (payload: OrderShippingLabelCreatedMQEventPayload, outbox_uuid: string, event_name: string) =>
            this.handleOrderShippingLabelCreated(payload, outbox_uuid, event_name),
    };

    async executeHandler(eventName: string, payload: any, outbox_uuid: string) {
        const handler = this.eventHandlerMap[eventName];
        if (!handler) {
            throw new Error(`No handler found for event: ${eventName}`);
        }
        await handler.call(this, payload, outbox_uuid, eventName);
    }
}
