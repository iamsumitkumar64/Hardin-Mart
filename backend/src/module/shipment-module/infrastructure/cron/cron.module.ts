import { Global, Module } from '@nestjs/common';
import { OrderRepository } from '../repository/order.repository';
import { OutboxEntryPublisherCronService } from './outbox.entry.publisher/outbox.entry.publisher';
import { OutboxRepository } from '../repository/outbox.repository';

@Global()
@Module({
    providers: [
        OutboxRepository,
        OrderRepository,
        OutboxEntryPublisherCronService
    ],
    exports: [],
})
export class CronModule { }