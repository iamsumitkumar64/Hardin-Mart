import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from './rabbit-mq.service';
import { EventHandlerMapService } from './event-handler.map.service';
import { RabbitMQConsumerMessage } from '../../../../common/infrastruture/rabbit-mq/rabbit-mq.type';

@Injectable()
export class CatalogRabbitMQConsumerInitializer implements OnModuleInit {
    private readonly logger = new Logger(CatalogRabbitMQConsumerInitializer.name);

    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly eventHandlerMapService: EventHandlerMapService,
    ) { }

    async onModuleInit() {
        this.logger.log('Initializing Catalog RabbitMQ Consumer...');

        await this.rabbitMQService.consumeMessages<RabbitMQConsumerMessage<any>>(
            async (data) => {
                const { outbox_uuid, event_name, payload } = data;

                this.logger.log(`Processing event: ${event_name} (${outbox_uuid})`);

                try {
                    await this.eventHandlerMapService.executeHandler(event_name, payload, outbox_uuid);
                } catch (error) {
                    this.logger.error(`Error executing handler for event ${event_name}:`, error);
                    throw error;
                }
            },
        );
    }
}
