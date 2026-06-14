import { ExchangeTypeEnum } from "../../../../common/infrastruture/rabbit-mq/rabbit-mq.type";

export const saleRabbitMQConfig = {
    queueName: 'sale.queue',
    exchanges: [
        { name: 'user.exchange', type: ExchangeTypeEnum.FANOUT, routingKey: '' },
        { name: 'billing.exchange', type: ExchangeTypeEnum.FANOUT, routingKey: '' },
        { name: 'shipping.exchange', type: ExchangeTypeEnum.FANOUT, routingKey: '' },
    ]
};
