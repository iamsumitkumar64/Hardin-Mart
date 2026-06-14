import { Injectable, Logger } from '@nestjs/common';
import { UserRegisteredMQEventPayload, OrderPlacedMQEventPayload, OrderBilledMQEventPayload, ShipmentEventHandlerMap } from './rabbit-mq.type';
import { UserRegisteredService } from 'src/module/shipment-module/feature/user/user-registered/user-registered.handler';
import { InboxRepository } from '../repository/inbox.repository';
import { Transactional } from 'typeorm-transactional';
import { ShippingPolicyService } from '../policy/shipping/shipping.policy.service';

@Injectable()
export class EventHandlerMapService {
    constructor(
        private readonly userRegisteredService: UserRegisteredService,
        private readonly shippingPolicyService: ShippingPolicyService,
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
            this.logger.verbose(`No handler found for event: ${eventName} in Shipment Module`);
            return;
        }

        const alreadyProcessed = await this.inboxRepository.findByOutboxUuid(outbox_uuid);
        if (alreadyProcessed) {
            return;
        }
        for (const handler of handlers) {
            await handler.call(this, payload, outbox_uuid, eventName);
        }
        await this.inboxRepository.createEntry({ outbox_uuid, event_name: eventName });
    }

    async handleUserRegistered(payload: UserRegisteredMQEventPayload) {
        await this.userRegisteredService.handle(payload);
    }

    async handleOrderPlaced(payload: OrderPlacedMQEventPayload) {
        await this.shippingPolicyService.handleOrderPlaced(payload);
    }

    async handleOrderBilled(payload: OrderBilledMQEventPayload) {
        await this.shippingPolicyService.handleOrderBilled(payload);
    }
}
