import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "../user/user.entity";
import { OrderStatusEnum } from "../../../sale-module/domain/order/order.enum";
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
    customer_uuid: string;

    @Column({ type: "uuid", nullable: false })
    address_uuid: string;

    @Column({ type: "boolean", default: false })
    is_placed: boolean;

    @Column({ type: "boolean", default: false })
    is_billed: boolean;

    @ManyToOne(() => UserEntity, (user) => user.orders)
    @JoinColumn({ name: "customer_uuid" })
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
