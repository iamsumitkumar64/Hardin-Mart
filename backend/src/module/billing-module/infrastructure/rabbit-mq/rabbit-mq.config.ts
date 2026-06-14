import { ExchangeTypeEnum } from "../../../../common/infrastruture/rabbit-mq/rabbit-mq.type";

export const billingRabbitMQConfig = {
    queueName: 'billing.queue',
    exchanges: [
        { name: 'user.exchange', type: ExchangeTypeEnum.FANOUT, routingKey: '' },
        { name: 'sale.exchange', type: ExchangeTypeEnum.FANOUT, routingKey: '' },
        { name: 'shipping.exchange', type: ExchangeTypeEnum.FANOUT, routingKey: '' },
    ]
};
