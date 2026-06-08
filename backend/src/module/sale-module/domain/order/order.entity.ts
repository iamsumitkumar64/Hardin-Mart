import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "../user/user.entity";
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

    @Column({ type: "decimal", precision: 12, scale: 2, nullable: false, default: 0, })
    total_price: number;

    @ManyToOne(() => UserEntity, (user) => user.orders)
    @JoinColumn({ name: "user_uuid" })
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