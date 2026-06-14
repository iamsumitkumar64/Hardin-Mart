import { ExchangeTypeEnum } from "../../../../common/infrastruture/rabbit-mq/rabbit-mq.type";

export const shipmentRabbitMQConfig = {
    queueName: 'shipment.queue',
    exchanges: [
        { name: 'user.exchange', type: ExchangeTypeEnum.FANOUT, routingKey: '' },
        { name: 'sale.exchange', type: ExchangeTypeEnum.FANOUT, routingKey: '' },
        { name: 'billing.exchange', type: ExchangeTypeEnum.FANOUT, routingKey: '' },
    ]
};
