import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbit-mq.service';
import { EventHandlerMapService } from './event-handler.map.service';
import { CatalogRabbitMQConsumerInitializer } from './rabbit-mq-consumer-initializer';
import { UserRegisteredService } from '../../feature/user/user-registered/user-registered.handler';
import { InboxRepository } from '../repository/inbox.repository';
import { UserRepository } from '../repository/user.repository';

@Module({
    providers: [
        RabbitMQService,
        CatalogRabbitMQConsumerInitializer,
        EventHandlerMapService,
        UserRegisteredService,
        InboxRepository,
        UserRepository,
    ],
    exports: [RabbitMQService, EventHandlerMapService],
})
export class CatalogRabbitMQModule { }
