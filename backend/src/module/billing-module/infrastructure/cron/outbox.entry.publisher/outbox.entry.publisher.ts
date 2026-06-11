import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OutboxRepository } from '../../repository/outbox.repository';
import { RabbitMQService } from 'src/module/billing-module/infrastructure/rabbit-mq/rabbit-mq.service';
import { OutboxStatusEnum } from 'src/module/billing-module/domain/outbox/outbox.enum';
import { runOnTransactionCommit, Transactional } from 'typeorm-transactional';

@Injectable()
export class OutboxEntryPublisherCronService {
    constructor(
        private readonly outboxRepository: OutboxRepository,
        private readonly rabbitMQService: RabbitMQService,
    ) { }

    private readonly logger = new Logger(OutboxEntryPublisherCronService.name,);

    @Cron(process.env.BILLING_OUTBOX_CRON_TIMER || CronExpression.EVERY_10_SECONDS)
    @Transactional({
        connectionName: process.env.DB_POSTGRES_BILLING_SCHEMA || 'billing_schema',
    })
    async handleCron() {
        // fecth top pending enteries
        const pendingEntries = await this.outboxRepository.findTopPendingOutBoxEntries();
        if (!pendingEntries.length) { return; }

        await Promise.all(
            pendingEntries.map(async (entry) => {
                try {
                    // make entry success
                    await this.outboxRepository.updateStatus(entry.uuid, OutboxStatusEnum.PUBLISHED,);

                    runOnTransactionCommit(async () => {
                        //push to mq
                        await this.rabbitMQService.publishToExchange(
                            entry.exchange_name,
                            '',
                            {
                                outbox_uuid: entry.uuid,
                                event_name: entry.event_name,
                                payload: entry.message_payload,
                            },
                        );
                    })
                } catch (error) {
                    this.logger.error(`Failed to publish outbox entry: ${entry.uuid}`,);

                    //make entry failed
                    await this.outboxRepository.updateStatus(entry.uuid, OutboxStatusEnum.FAILED,);
                }
            }),
        );
    }
}