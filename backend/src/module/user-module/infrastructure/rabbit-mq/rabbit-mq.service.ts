import { Injectable } from "@nestjs/common";
import { ExchangeTypeEnum } from "../../../../common/infrastruture/rabbit-mq/rabbit-mq.type";
import { RabbitMQAbstractService } from "../../../../common/infrastruture/rabbit-mq/rabbit-mq.abstract.service";

@Injectable()
export class RabbitMQService extends RabbitMQAbstractService {
    protected readonly queueName = 'user.queue';
    private readonly USER_EXCHANGE = 'user.exchange';

    protected async setupInitialCreation() {
        const channel = this.channel;
        if (!channel) return;

        await this.setupExchangeQueueAndBind(this.queueName, this.USER_EXCHANGE, '', ExchangeTypeEnum.FANOUT);

        await this.setupRetryQueue(this.queueName);
    }
}
