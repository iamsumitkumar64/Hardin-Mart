import { Injectable } from '@nestjs/common';
import { RabbitMQConsumerMessage, UserRegisteredMQEventPayload, OrderPlacedMQEventPayload, OrderBilledMQEventPayload } from './rabbit-mq.type';
import { UserRegisterService as ShipmentUserRegisterService } from 'src/module/shipment-module/feature/user/user-register/user-register.handler';
import { OrderPlacedService } from 'src/module/shipment-module/feature/order/order-placed/order-placed.handler';
import { OrderBilledService } from 'src/module/shipment-module/feature/order/order-billed/order-billed.handler';
import { InboxRepository } from '../repository/inbox.repository';

@Injectable()
export class ShipmentEventHandlerMap {
    constructor(
        private readonly userRegisterService: ShipmentUserRegisterService,
        private readonly orderPlacedService: OrderPlacedService,
        private readonly orderBilledService: OrderBilledService,
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

        await this.orderPlacedService.handle(payload);
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

    // Map event names to handlers
    public eventHandlerMap: Record<string, (payload: any, outbox_uuid: string, event_name: string) => Promise<void>> = {
        'user.registered': (payload: UserRegisteredMQEventPayload, outbox_uuid: string, event_name: string) =>
            this.handleUserRegistered(payload, outbox_uuid, event_name),
        'order.placed': (payload: OrderPlacedMQEventPayload, outbox_uuid: string, event_name: string) =>
            this.handleOrderPlaced(payload, outbox_uuid, event_name),
        'order.billed': (payload: OrderBilledMQEventPayload, outbox_uuid: string, event_name: string) =>
            this.handleOrderBilled(payload, outbox_uuid, event_name),
    };

    async executeHandler(eventName: string, payload: any, outbox_uuid: string) {
        const handler = this.eventHandlerMap[eventName];
        if (!handler) {
            throw new Error(`No handler found for event: ${eventName}`);
        }
        await handler.call(this, payload, outbox_uuid, eventName);
    }
}
