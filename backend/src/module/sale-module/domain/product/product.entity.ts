import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, } from "typeorm";
import { OrderItemEntity } from "../order-item/order-item.entity";

@Entity("product")
export class ProductEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column({
        type: "bigint",
        generated: "increment",
        unique: true,
        select: false,
    })
    id: number;

    @Column({
        type: "decimal",
        precision: 10,
        scale: 2,
        nullable: false,
        default: 1,
    })
    price: number;

    @OneToMany(() => OrderItemEntity, item => item.product)
    order_item: OrderItemEntity[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;
}   