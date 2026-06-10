import { Injectable } from '@nestjs/common';
import { RabbitMQConsumerMessage, UserRegisteredMQEventPayload, OrderPlacedMQEventPayload, BackOrderedMQEventPayload } from './rabbit-mq.type';
import { UserRegisterService as BillingUserRegisterService } from 'src/module/billing-module/feature/user/user-register/user-register.handler';
import { OrderPlacedService } from 'src/module/billing-module/feature/order/order-placed/order-placed.handler';
import { OrderRefundService } from 'src/module/billing-module/feature/order/order-refund/order-refund.handler';
import { InboxRepository } from '../repository/inbox.repository';

@Injectable()
export class BillingEventHandlerMap {
    constructor(
        private readonly userRegisterService: BillingUserRegisterService,
        private readonly orderPlacedService: OrderPlacedService,
        private readonly orderRefundService: OrderRefundService,
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

    async handleOrderPlaced(payload: OrderPlacedMQEventPayload, outbox_uuid: string, event_name: string) {
        const alreadyProcessed = await this.inboxRepository.findByOutboxUuid(outbox_uuid);
        if (alreadyProcessed) {
            return;
        }

        await this.orderPlacedService.handle(payload.customer_uuid, { order_uuid: payload.order_uuid });
        await this.inboxRepository.createEntry({ outbox_uuid, event_name });
    }

    async handleBackOrdered(payload: BackOrderedMQEventPayload, outbox_uuid: string, event_name: string) {
        const alreadyProcessed = await this.inboxRepository.findByOutboxUuid(outbox_uuid);
        if (alreadyProcessed) {
            return;
        }

        await this.orderRefundService.handle(payload);
        await this.inboxRepository.createEntry({ outbox_uuid, event_name });
    }

    // Map event names to handlers
    public eventHandlerMap: Record<string, (payload: any, outbox_uuid: string, event_name: string) => Promise<void>> = {
        'user.registered': (payload: UserRegisteredMQEventPayload, outbox_uuid: string, event_name: string) =>
            this.handleUserRegistered(payload, outbox_uuid, event_name),
        'order.placed': (payload: OrderPlacedMQEventPayload, outbox_uuid: string, event_name: string) =>
            this.handleOrderPlaced(payload, outbox_uuid, event_name),
        'back.ordered': (payload: BackOrderedMQEventPayload, outbox_uuid: string, event_name: string) =>
            this.handleBackOrdered(payload, outbox_uuid, event_name),
    };

    async executeHandler(eventName: string, payload: any, outbox_uuid: string) {
        const handler = this.eventHandlerMap[eventName];
        if (!handler) {
            throw new Error(`No handler found for event: ${eventName}`);
        }
        await handler.call(this, payload, outbox_uuid, eventName);
    }
}
