import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class userAddressMigration1778505600002 implements MigrationInterface {
    name = "userAddressMigration1778505600002";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "user_address",
            columns: [
                { name: "uuid", type: "uuid", isPrimary: true, generationStrategy: "uuid", default: "uuid_generate_v4()" },
                { name: "id", type: "bigint", isGenerated: true, generationStrategy: "increment", isUnique: true, isNullable: false },
                { name: "customer_uuid", type: "uuid", isNullable: false },
                { name: "street", type: "varchar", isNullable: false },
                { name: "city", type: "varchar", isNullable: false },
                { name: "state", type: "varchar", isNullable: false },
                { name: "postalCode", type: "varchar", isNullable: false },
                { name: "country", type: "varchar", isNullable: false },
                { name: "is_default", type: "boolean", default: false },
                { name: "created_at", type: "timestamp", default: "now()" },
                { name: "updated_at", type: "timestamp", default: "now()" },
                { name: "deleted_at", type: "timestamp", isNullable: true }
            ]
        }), true);

        await queryRunner.createForeignKey(
            "user_address",
            new TableForeignKey({
                columnNames: ["customer_uuid"],
                referencedTableName: "user",
                referencedColumnNames: ["uuid"],
                name: "FK_user_address_user",
                onDelete: "CASCADE"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("user_address", "FK_user_address_user");
        await queryRunner.dropTable("user_address", true);
    }
}