import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class orderMigration1778505600002 implements MigrationInterface {
    name = "orderMigration1778505600002";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "shipment_schema"."order_status_type_enum" AS ENUM('pending','placed','billed','payment_failed','ready_to_ship','cancelled');`);

        await queryRunner.createTable(new Table({
            name: "order",
            columns: [
                { name: "uuid", type: "uuid", isPrimary: true, generationStrategy: "uuid", default: "uuid_generate_v4()" },
                { name: "id", type: "bigint", isGenerated: true, generationStrategy: "increment", isUnique: true, isNullable: false },
                { name: "customer_uuid", type: "uuid", isNullable: false },
                { name: "order_status", type: `"shipment_schema"."order_status_type_enum"`, default: `'pending'` },
                { name: "total_price", type: "decimal", precision: 12, scale: 2, default: 0, isNullable: false, },
                { name: "created_at", type: "timestamp", default: "now()" },
                { name: "updated_at", type: "timestamp", default: "now()" },
                { name: "deleted_at", type: "timestamp", isNullable: true }
            ]
        }), true);

        await queryRunner.createForeignKey(
            "order",
            new TableForeignKey({
                columnNames: ["customer_uuid"],
                referencedTableName: "user",
                referencedColumnNames: ["uuid"],
                name: "FK_order_user",
                onDelete: "CASCADE"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("order", "FK_order_user");
        await queryRunner.dropTable("order", true);
    }
}