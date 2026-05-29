import { Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { WalletEntity } from "../wallet/wallet.entity";
import { WalletHistoryEntity } from "../wallet-history/wallet-history.entity";
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

    @OneToOne(() => WalletEntity, wallet => wallet.user)
    wallet: WalletEntity;

    @OneToMany(() => WalletHistoryEntity, wallet_history => wallet_history.user)
    wallet_histories: WalletHistoryEntity[];

    @OneToMany(() => OrderEntity, order => order.user)
    orders: OrderEntity[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;
}