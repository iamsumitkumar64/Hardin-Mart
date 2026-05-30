import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class orderItemMigration1778505600004 implements MigrationInterface {
    name = "orderItemMigration1778505600004";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "order_item",
            columns: [
                { name: "uuid", type: "uuid", isPrimary: true, generationStrategy: "uuid", default: "uuid_generate_v4()" },
                { name: "id", type: "bigint", isGenerated: true, generationStrategy: "increment", isUnique: true, isNullable: false },
                { name: "order_uuid", type: "uuid", isNullable: false },
                { name: "product_uuid", type: "uuid", isNullable: false },
                { name: "quantity", type: "integer", default: 1, isNullable: false },
                { name: "created_at", type: "timestamp", default: "now()" },
                { name: "updated_at", type: "timestamp", default: "now()" },
                { name: "deleted_at", type: "timestamp", isNullable: true }
            ]
        }), true);

        await queryRunner.createForeignKey(
            "order_item",
            new TableForeignKey({
                columnNames: ["order_uuid"],
                referencedTableName: "order",
                referencedColumnNames: ["uuid"],
                name: "FK_order_item_order",
                onDelete: "CASCADE"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("order_item", "FK_order_item_order");
        await queryRunner.dropTable("order_item", true);
    }
}
