import { JoinColumn, ManyToOne, OneToMany, PrimaryColumn, ViewColumn, ViewEntity } from "typeorm";
import { OrderItemEntity } from "../order-item/order-item.entity";
import { UserAddressEntity } from "../user_address/user.address.entity";

@ViewEntity({
    name: process.env.DB_POSTGRES_ORDER_VIEW || "order_listing_mv",
    schema: process.env.DB_POSTGRES_SHIPMENT_SCHEMA || 'shipment_schema',
    materialized: true,
    expression: `
        SELECT
            sale_order.uuid,
            sale_order.user_uuid,
            sale_order.total_price,
            shipment_order.address_uuid,
            shipment_order.order_status,
            billing_order.payment_status,
            sale_order.created_at,
            sale_order.updated_at,
            sale_order.deleted_at
        FROM "${process.env.DB_POSTGRES_SALE_SCHEMA || "sale_schema"}"."order" sale_order
        LEFT JOIN "${process.env.DB_POSTGRES_BILLING_SCHEMA || "billing_schema"}"."order" billing_order
            ON billing_order.uuid = sale_order.uuid
            AND billing_order.deleted_at IS NULL
        LEFT JOIN "${process.env.DB_POSTGRES_SHIPMENT_SCHEMA || "shipment_schema"}"."order" shipment_order
            ON shipment_order.uuid = sale_order.uuid
            AND shipment_order.deleted_at IS NULL
        WHERE sale_order.deleted_at IS NULL
    `,
})
export class OrderListingViewEntity {
    @PrimaryColumn()
    uuid: string;

    @ViewColumn()
    user_uuid: string;

    @ViewColumn()
    total_price: number;

    @ViewColumn()
    address_uuid: string;

    @OneToMany(() => OrderItemEntity, (item) => item.order)
    items: OrderItemEntity[];

    @ManyToOne(() => UserAddressEntity, (address) => address.orders)
    @JoinColumn({ name: "address_uuid" })
    address: UserAddressEntity;

    @ViewColumn()
    order_status: string;

    @ViewColumn()
    payment_status: string;

    @ViewColumn()
    created_at: Date;

    @ViewColumn()
    updated_at: Date;

    @ViewColumn()
    deleted_at: Date;
}
