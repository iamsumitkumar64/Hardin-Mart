import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class outboxMigration1778505599999 implements MigrationInterface {
    name = "outboxMigration1778505599999";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "shipment_schema"."outbox_exchange_name_enum" AS ENUM('user.exchange','order.exchange')`);
        await queryRunner.query(`CREATE TYPE "shipment_schema"."outbox_routing_key_enum" AS ENUM('user.registered','order.created','order.paid','order.refund','billing.order.created')`);
        await queryRunner.query(`CREATE TYPE "shipment_schema"."outbox_status_enum" AS ENUM('pending','published','failed')`);

        await queryRunner.createTable(
            new Table({
                name: "outbox",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, generationStrategy: "uuid", default: "uuid_generate_v4()", },
                    { name: "id", type: "bigint", isGenerated: true, generationStrategy: "increment", isUnique: true, isNullable: false, },
                    { name: "exchange_name", type: `"shipment_schema"."outbox_exchange_name_enum"`, isNullable: false, },
                    { name: "routing_key", type: `"shipment_schema"."outbox_routing_key_enum"`, isNullable: false, },
                    { name: "message_payload", type: "jsonb", isNullable: false, },
                    { name: "header_payload", type: "jsonb", isNullable: true, },
                    { name: "status", type: `"shipment_schema"."outbox_status_enum"`, default: `'pending'`, isNullable: false, },
                    { name: "created_at", type: "timestamp", default: "now()", },
                    { name: "updated_at", type: "timestamp", default: "now()", },
                    { name: "deleted_at", type: "timestamp", isNullable: true, },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("outbox", true);
        await queryRunner.query(`DROP TYPE IF EXISTS "shipment_schema"."outbox_status_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "shipment_schema"."outbox_routing_key_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "shipment_schema"."outbox_exchange_name_enum"`);
    }
}