import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "../user/user.entity";
import { OrderItemEntity } from "../order-item/order-item.entity";
import { OrderStatusEnum } from "./order.enum";

@Entity('order')
export class OrderEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column({
        type: "bigint",
        generated: "increment",
        unique: true,
        select: false,
    })
    id: number;

    @Column({ type: "uuid", nullable: false })
    customer_uuid: string;

    @Column({ type: "decimal", precision: 12, scale: 2, nullable: false, default: 0, })
    total_price: number;

    @Column({ type: "enum", enum: OrderStatusEnum, default: OrderStatusEnum.PENDING, nullable: false })
    order_status: OrderStatusEnum;

    @ManyToOne(() => UserEntity, (user) => user.orders)
    @JoinColumn({ name: "customer_uuid" })
    user: UserEntity;

    @OneToMany(() => OrderItemEntity, item => item.order)
    items: OrderItemEntity[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;
}