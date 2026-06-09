import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "../user/user.entity";
import { OrderPaymentStatusEnum } from "./order.enum";

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

    @Column({ type: "enum", enum: OrderPaymentStatusEnum, default: OrderPaymentStatusEnum.PENDING, nullable: false })
    payment_status: OrderPaymentStatusEnum;

    @Column({ type: "decimal", precision: 12, scale: 2, nullable: false, default: 0, })
    total_price: number;

    @ManyToOne(() => UserEntity, (user) => user.orders)
    @JoinColumn({ name: "customer_uuid" })
    user: UserEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;
}