import { BadRequestException, Injectable } from "@nestjs/common";
import { OrderRepository } from "src/module/shipment-module/infrastructure/repository/order.repository";
import { OrderPaidMQEventPayload } from "src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.type";
import { OrderStatusEnum } from "src/module/shipment-module/domain/order/order.enum";
import { SocketService } from "src/module/common/infrastruture/socket/socket.service";
import { SocketEventNameEnum } from "src/module/common/infrastruture/socket/socket.enum";

@Injectable()
export class OrderPaidService {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly socketService: SocketService,
    ) { }

    async handle(order: OrderPaidMQEventPayload) {
        await this.orderRepository.updateOrderStatus(order.order_uuid, OrderStatusEnum.BILLED);
        await this.socketService.emitToUser(order.user_uuid, SocketEventNameEnum.ORDER_STATUS_CHANGED, { order_uuid: order.order_uuid, order_status: OrderStatusEnum.BILLED });

        return;
    }
}