import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, } from "typeorm";
import { ExchangeNameEnum, RoutingKeyEnum } from "src/module/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum";
import { OutboxStatusEnum } from "./outbox.enum";

@Entity("outbox")
export class OutboxEntity {
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
        type: "enum",
        enum: ExchangeNameEnum,
        nullable: false,
    })
    exchange_name: ExchangeNameEnum;

    @Column({
        type: "enum",
        enum: RoutingKeyEnum,
        nullable: false,
    })
    routing_key: RoutingKeyEnum;

    @Column({ type: "jsonb" })
    message_payload: Record<string, any>;

    @Column({ type: "jsonb", nullable: true })
    header_payload: Record<string, any>;

    @Column({
        type: "enum",
        enum: OutboxStatusEnum,
        default: OutboxStatusEnum.PENDING,
        nullable: false,
    })
    status: OutboxStatusEnum;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at: Date;
}