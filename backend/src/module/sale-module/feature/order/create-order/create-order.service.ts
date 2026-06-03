import { BadRequestException, Injectable } from "@nestjs/common";
import { UserEntity } from "src/module/user-module/domain/user/user.entity";
import { CreateOrderDto } from "./create-order.dto";
import { ExchangeNameEnum, RoutingKeyEnum } from "src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum";
import { OrderRepository } from "src/module/sale-module/infrastructure/repository/order.repository";
import { OrderItemRepository } from "src/module/sale-module/infrastructure/repository/order.item.repository";
import { OutboxRepository } from "src/module/sale-module/infrastructure/repository/outbox.repository";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class CreateOrderService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly orderItemRepository: OrderItemRepository,
        private readonly outboxRepository: OutboxRepository,
    ) { }

    @Transactional({
        connectionName: process.env.DB_POSTGRES_SALE_SCHEMA || 'sale_schema',
    })
    async createOrder(user: UserEntity, body: CreateOrderDto) {
        const { items } = body;

        const order = await this.orderRepository.createOrder({ user_uuid: user.uuid, });
        const orderItems = await Promise.all(
            items.map(item =>
                this.orderItemRepository.createOrderItem({
                    order_uuid: order.uuid,
                    product_uuid: item.product_uuid,
                    quantity: item.quantity
                })
            )
        );
        order.items = orderItems;

        // not publish direct to mq-queue
        // await this.rabbitMQService.publishToExchange(
        //     ExchangeNameEnum.ORDER_EXCHANGE,
        //     RoutingKeyEnum.ORDER_CREATED,
        //     {
        //         order_uuid: order.uuid,
        //         user_uuid: user.uuid,
        //         total_price,
        //         created_at: new Date(),
        //     }
        // );

        // make entry of publish exchange
        await this.outboxRepository.createOutboxEntry({
            exchange_name: ExchangeNameEnum.ORDER_EXCHANGE,
            routing_key: RoutingKeyEnum.ORDER_CREATED,
            message_payload: {
                order_id: order.id,
                order_uuid: order.uuid,
                user_uuid: user.uuid,
                total_price: body.total_price,
                address_uuid: body.address_uuid,
                items: items.map((item, index) => ({
                    uuid: orderItems[index].uuid,
                    id: orderItems[index].id,
                    product_uuid: item.product_uuid,
                    quantity: item.quantity,
                    created_at: orderItems[index].created_at,
                })),
                created_at: order.created_at,
            },
        });

        return {
            data: order
        };
    }
}