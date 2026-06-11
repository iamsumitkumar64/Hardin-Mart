import { Global, Module } from '@nestjs/common';
import { OutboxEntryPublisherCronService } from './outbox.entry.publisher/outbox.entry.publisher';
import { OutboxRepository } from '../repository/outbox.repository';
import { RabbitMQService } from '../rabbit-mq/rabbit-mq.service';

@Global()
@Module({
    providers: [
        OutboxEntryPublisherCronService,
        OutboxRepository,
        RabbitMQService,
    ],
    exports: [OutboxEntryPublisherCronService],
})
export class CronModule { }