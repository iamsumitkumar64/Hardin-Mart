import { Global, Module } from '@nestjs/common';
import { OutboxEntryPublisherCronService } from './outbox.entry.publisher/outbox.entry.publisher';
import { OutboxRepository } from '../repository/outbox.repository';

@Global()
@Module({
    providers: [
        OutboxEntryPublisherCronService,
        OutboxRepository,
    ],
    exports: [OutboxEntryPublisherCronService],
})
export class CronModule { }