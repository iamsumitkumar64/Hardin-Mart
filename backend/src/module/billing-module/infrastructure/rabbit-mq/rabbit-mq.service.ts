import { Injectable } from "@nestjs/common";
import { ExchangeTypeEnum } from "../../../../common/infrastruture/rabbit-mq/rabbit-mq.type";
import { RabbitMQAbstractService } from "../../../../common/infrastruture/rabbit-mq/rabbit-mq.abstract.service";

@Injectable()
export class RabbitMQService extends RabbitMQAbstractService {
    protected readonly queueName = 'billing.queue';

    private readonly USER_EXCHANGE = 'user.exchange';
    private readonly SALE_EXCHANGE = 'sale.exchange';
    private readonly SHIPPING_EXCHANGE = 'shipping.exchange';

    protected async setupInitialCreation() {
        const channel = this.channel;
        if (!channel) return;

        await this.setupExchangeQueueAndBind(this.queueName, this.USER_EXCHANGE, '', ExchangeTypeEnum.FANOUT);
        await this.setupExchangeQueueAndBind(this.queueName, this.SALE_EXCHANGE, '', ExchangeTypeEnum.FANOUT);
        await this.setupExchangeQueueAndBind(this.queueName, this.SHIPPING_EXCHANGE, '', ExchangeTypeEnum.FANOUT);

        await this.setupRetryQueue(this.queueName);
    }
}
