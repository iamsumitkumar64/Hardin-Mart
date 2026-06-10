import { Injectable } from '@nestjs/common';
import { RabbitMQConsumerMessage, UserRegisteredMQEventPayload } from './rabbit-mq.type';
import { UserRegisterService } from 'src/module/catalog-module/feature/user/user-register/user-register.handler';
import { InboxRepository } from '../repository/inbox.repository';

@Injectable()
export class CatalogEventHandlerMap {
    constructor(
        private readonly userRegisterService: UserRegisterService,
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

    // Map event names to handlers
    public eventHandlerMap: Record<string, (payload: any, outbox_uuid: string, event_name: string) => Promise<void>> = {
        'user.registered': (payload: UserRegisteredMQEventPayload, outbox_uuid: string, event_name: string) =>
            this.handleUserRegistered(payload, outbox_uuid, event_name),
    };

    async executeHandler(eventName: string, payload: any, outbox_uuid: string) {
        const handler = this.eventHandlerMap[eventName];
        if (!handler) {
            throw new Error(`No handler found for event: ${eventName}`);
        }
        await handler.call(this, payload, outbox_uuid, eventName);
    }
}
