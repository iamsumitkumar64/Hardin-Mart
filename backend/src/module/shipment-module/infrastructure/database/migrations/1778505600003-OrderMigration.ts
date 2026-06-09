import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class orderMigration1778505600003 implements MigrationInterface {
    name = "orderMigration1778505600003";

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(new Table({
            name: "order",
            columns: [
                { name: "uuid", type: "uuid", isPrimary: true, generationStrategy: "uuid", default: "uuid_generate_v4()" },
                { name: "id", type: "bigint", isGenerated: true, generationStrategy: "increment", isUnique: true, isNullable: false },
                { name: "customer_uuid", type: "uuid", isNullable: false },
                { name: "address_uuid", type: "uuid", isNullable: false },
                { name: "is_placed", type: "boolean", default: false },
                { name: "is_billed", type: "boolean", default: false },
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
            }),
        );

        await queryRunner.createForeignKey(
            "order",
            new TableForeignKey({
                columnNames: ["address_uuid"],
                referencedTableName: "user_address",
                referencedColumnNames: ["uuid"],
                name: "FK_order_user_address",
                onDelete: "CASCADE"
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("order", "FK_order_user");
        await queryRunner.dropForeignKey("order", "FK_order_user_address");
        await queryRunner.dropTable("order", true);
    }
}
