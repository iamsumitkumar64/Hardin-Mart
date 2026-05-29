import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserAddressEntity } from "../user_address/user.address.entity";
import { OrderEntity } from "../order/order.entity";

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column({
        type: "bigint",
        generated: "increment",
        unique: true,
        select: false,
    })
    id: number;

    @Column({ type: "varchar", nullable: false, })
    name: string;

    @Column({ type: "varchar", nullable: false, unique: true })
    email: string;

    @OneToMany(() => UserAddressEntity, (address) => address.user, { cascade: true })
    addresses: UserAddressEntity[];

    @OneToMany(() => OrderEntity, (order) => order.user, { cascade: true })
    orders: OrderEntity[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;
}