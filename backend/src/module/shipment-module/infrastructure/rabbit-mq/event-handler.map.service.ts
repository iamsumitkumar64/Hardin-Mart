import { Injectable, Logger } from '@nestjs/common';
import { UserRegisteredMQEventPayload, OrderPlacedMQEventPayload, OrderBilledMQEventPayload, ShipmentEventPayload, ShipmentEventHandlerMap } from './rabbit-mq.type';
import { UserRegisteredService } from 'src/module/shipment-module/feature/user/user-registered/user-registered.handler';
import { OrderPlacedService } from 'src/module/shipment-module/feature/order/order-placed/order-placed.handler';
import { OrderBilledService } from 'src/module/shipment-module/feature/order/order-billed/order-billed.handler';
import { InboxRepository } from '../repository/inbox.repository';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class EventHandlerMapService {
    constructor(
        private readonly userRegisteredService: UserRegisteredService,
        private readonly orderPlacedService: OrderPlacedService,
        private readonly orderBilledService: OrderBilledService,
        private readonly inboxRepository: InboxRepository,
    ) { }
    private readonly logger = new Logger(EventHandlerMapService.name);

    // Map event names to handlers
    public eventHandlerMap: ShipmentEventHandlerMap = {
        'user.registered': [
            (payload: UserRegisteredMQEventPayload) => this.handleUserRegistered(payload),
        ],
        'order.placed': [
            (payload: OrderPlacedMQEventPayload) => this.handleOrderPlaced(payload)
        ],
        'order.billed': [
            (payload: OrderBilledMQEventPayload) => this.handleOrderBilled(payload)
        ],
    };

    @Transactional({
        connectionName: process.env.DB_POSTGRES_SHIPMENT_SCHEMA || 'shipment_schema',
    })
    async executeHandler(eventName: string, payload: any, outbox_uuid: string) {
        const handlers = this.eventHandlerMap[eventName];
        if (!handlers || !handlers.length) {
            this.logger.debug(`No handler found for event: ${eventName} in Shipment Module`);
            return;
        }

        const alreadyProcessed = await this.inboxRepository.findByOutboxUuid(outbox_uuid);
        if (alreadyProcessed) {
            this.logger.debug(`Duplicated event: ${eventName} in Shipment Module`);
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

    async handleOrderPlaced(payload: OrderPlacedMQEventPayload) {
        await this.orderPlacedService.handle(payload);
    }

    async handleOrderBilled(payload: OrderBilledMQEventPayload) {
        await this.orderBilledService.handle(payload);
    }
}
