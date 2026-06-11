import { Global, Module } from '@nestjs/common';
import { OrderRepository } from '../repository/order.repository';
import { OutboxEntryPublisherCronService } from './outbox.entry.publisher/outbox.entry.publisher';
import { OutboxRepository } from '../repository/outbox.repository';
import { RabbitMQService } from '../rabbit-mq/rabbit-mq.service';

@Global()
@Module({
    providers: [
        OutboxRepository,
        OrderRepository,
        OutboxEntryPublisherCronService,
        RabbitMQService,
    ],
    exports: [],
})
export class CronModule { }