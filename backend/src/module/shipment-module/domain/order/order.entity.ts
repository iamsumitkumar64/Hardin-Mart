import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "../user/user.entity";
import { OrderStatusEnum } from "./order.enum";
import { UserAddressEntity } from "../user_address/user.address.entity";
import { OrderItemEntity } from "../order-item/order-item.entity";

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
    user_uuid: string;

    @Column({ type: "uuid", nullable: false })
    address_uuid: string;

    @Column({ type: "enum", enum: OrderStatusEnum, default: OrderStatusEnum.PLACED, nullable: false })
    order_status: OrderStatusEnum;

    @ManyToOne(() => UserEntity, (user) => user.orders)
    @JoinColumn({ name: "user_uuid" })
    user: UserEntity;

    @ManyToOne(() => UserAddressEntity, (address) => address.orders)
    @JoinColumn({ name: "address_uuid" })
    address: UserAddressEntity;

    @OneToMany(() => OrderItemEntity, item => item.order)
    items: OrderItemEntity[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;
}
