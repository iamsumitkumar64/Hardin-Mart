import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { WalletHistoryTypeEnum } from "./wallet.enum";
import { UserEntity } from "../user/user.entity";

@Entity("wallet_history")
export class WalletHistoryEntity {
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

    @Column({ type: "uuid", nullable: true })
    order_uuid: string;

    @Column({ type: "float", nullable: false })
    amount: number;

    @Column({ type: "enum", enum: WalletHistoryTypeEnum, default: WalletHistoryTypeEnum.DEBIT })
    type: WalletHistoryTypeEnum;

    @Column({ type: "varchar", length: 255, nullable: true })
    description: string;

    @ManyToOne(() => UserEntity, (user) => user.wallet_histories)
    @JoinColumn({ name: "customer_uuid" })
    user: UserEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;
}
