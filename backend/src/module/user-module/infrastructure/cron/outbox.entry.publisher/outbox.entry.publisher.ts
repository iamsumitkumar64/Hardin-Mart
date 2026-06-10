import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OutboxRepository } from '../../repository/outbox.repository';
import { OutboxStatusEnum } from 'src/module/user-module/domain/outbox/outbox.enum';

@Injectable()
export class OutboxEntryPublisherCronService {
    constructor(
        private readonly outboxRepository: OutboxRepository,
    ) { }

    private readonly logger = new Logger(OutboxEntryPublisherCronService.name,);

    @Cron(process.env.USER_OUTBOX_CRON_TIMER || CronExpression.EVERY_5_SECONDS)
    async handleCron() {
        // User module publishes events, so it doesn't need to consume them
        // This is kept as a placeholder for any future needs
        return;
    }
}