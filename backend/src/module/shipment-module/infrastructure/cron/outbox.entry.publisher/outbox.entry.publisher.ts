import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RabbitMQService } from 'src/module/common/infrastruture/rabbit-mq/rabbit-mq.service';
import { OutboxRepository } from '../../repository/outbox.repository';
import { OutboxStatusEnum } from 'src/module/shipment-module/domain/outbox/outbox.enum';

@Injectable()
export class OutboxEntryPublisherCronService {
    constructor(
        private readonly outboxRepository: OutboxRepository,
        private readonly rabbitMQService: RabbitMQService,
    ) { }

    private readonly logger = new Logger(OutboxEntryPublisherCronService.name,);

    @Cron(process.env.SHIPMENT_OUTBOX_CRON_TIMER || CronExpression.EVERY_10_SECONDS)
    async handleCron() {
        // fecth top 10 pending enteries
        const pendingEntries = await this.outboxRepository.findTopTenPendingOutBoxEntries();
        if (!pendingEntries.length) { return; }

        await Promise.all(
            pendingEntries.map(async (entry) => {
                try {
                    //push to mq
                    await this.rabbitMQService.publishToExchange(
                        entry.exchange_name,
                        entry.routing_key,
                        {
                            outbox_uuid: entry.uuid,
                            payload: entry.message_payload,
                        },
                    );

                    // make entry success
                    await this.outboxRepository.updateStatus(entry.uuid, OutboxStatusEnum.PUBLISHED,);
                } catch (error) {
                    this.logger.error(`Failed to publish outbox entry: ${entry.uuid}`,);

                    //make entry failed
                    await this.outboxRepository.updateStatus(entry.uuid, OutboxStatusEnum.FAILED,);
                }
            }),
        );
    }
}