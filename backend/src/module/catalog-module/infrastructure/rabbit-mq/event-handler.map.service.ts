import { Injectable, Logger } from '@nestjs/common';
import { CatalogEventHandlerMap, UserRegisteredMQEventPayload } from './rabbit-mq.type';
import { UserRegisteredService } from 'src/module/catalog-module/feature/user/user-registered/user-registered.handler';
import { InboxRepository } from '../repository/inbox.repository';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class EventHandlerMapService {
    constructor(
        private readonly userRegisteredService: UserRegisteredService,
        private readonly inboxRepository: InboxRepository,
    ) { }
    private readonly logger = new Logger(EventHandlerMapService.name);

    // Map event names to handlers
    public eventHandlerMap: CatalogEventHandlerMap = {
        'user.registered': [
            (payload: UserRegisteredMQEventPayload) => this.handleUserRegistered(payload),
        ]
    };

    @Transactional({
        connectionName: process.env.DB_POSTGRES_CATALOG_SCHEMA || 'catalog_schema',
    })
    async executeHandler(eventName: string, payload: any, outbox_uuid: string) {
        const handlers = this.eventHandlerMap[eventName];
        if (!handlers || !handlers.length) {
            this.logger.verbose(`No handler found for event: ${eventName} in Catalog Module`);
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
}
