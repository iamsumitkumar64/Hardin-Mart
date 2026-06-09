import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "../user/user.entity";
import { OrderEntity } from "../order/order.entity";

@Entity('user_address')
export class UserAddressEntity {
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

    @Column()
    street: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @Column()
    postalCode: string;

    @Column()
    country: string;

    @Column({ default: false })
    isDefault: boolean;

    @ManyToOne(() => UserEntity, (user) => user.addresses)
    @JoinColumn({ name: "customer_uuid" })
    user: UserEntity;

    @OneToMany(() => OrderEntity, (order) => order.address)
    orders: OrderEntity[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;
}