import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class WalletHistoryMigration1778505600002 implements MigrationInterface {
    name = "WalletHistoryMigration1778505600002";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "billing_schema"."wallet_history_type_enum" AS ENUM('credit', 'debit', 'topup', 'refund');`);

        await queryRunner.createTable(
            new Table({
                name: "wallet_history",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, generationStrategy: "uuid", default: "uuid_generate_v4()", },
                    { name: "id", type: "bigint", isGenerated: true, generationStrategy: "increment", isUnique: true, isNullable: false, },
                    { name: "customer_uuid", type: "uuid", isNullable: false, },
                    { name: "order_uuid", type: "uuid", isNullable: true, },
                    { name: "amount", type: "float", isNullable: false, },
                    { name: "type", type: `"billing_schema"."wallet_history_type_enum"`, default: `'debit'` },
                    { name: "description", type: "varchar", length: "255", isNullable: true, },
                    { name: "created_at", type: "timestamp", default: "now()", },
                    { name: "updated_at", type: "timestamp", default: "now()", },
                    { name: "deleted_at", type: "timestamp", isNullable: true, },
                ],
            }),
            true
        );
        await queryRunner.createForeignKey(
            "wallet_history",
            new TableForeignKey({
                columnNames: ["customer_uuid"],
                referencedTableName: "user",
                referencedColumnNames: ["uuid"],
                name: "FK_wallet_history_user",
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("wallet_history", "FK_wallet_history_user");
        await queryRunner.dropForeignKey("wallet_history", "FK_wallet_history_card");
        await queryRunner.dropTable("wallet_history", true);
        await queryRunner.query(`DROP TYPE "billing_schema"."wallet_history_type_enum"`);
    }
}