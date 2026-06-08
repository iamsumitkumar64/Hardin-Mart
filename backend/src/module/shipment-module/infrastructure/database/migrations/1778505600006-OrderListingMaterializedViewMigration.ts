import { MigrationInterface, QueryRunner } from "typeorm";

export class OrderListingMaterializedViewMigration1778505600006 implements MigrationInterface {
    name = "OrderListingMaterializedViewMigration1778505600006";

    public async up(queryRunner: QueryRunner): Promise<void> {
        // schemas
        const saleSchema = (process.env.DB_POSTGRES_SALE_SCHEMA || "sale_schema");
        const billingSchema = (process.env.DB_POSTGRES_BILLING_SCHEMA || "billing_schema");
        const shipmentSchema = (process.env.DB_POSTGRES_SHIPMENT_SCHEMA || "shipment_schema");

        // tables
        const saleorderTable = (`${saleSchema}."order"`);
        const billingorderTable = (`${billingSchema}."order"`);
        const shipmentorderTable = (`${shipmentSchema}."order"`);

        // view
        const orderView = process.env.DB_POSTGRES_ORDER_VIEW || "order_listing_mv";

        await queryRunner.query(`
            DO $$
            BEGIN
                IF to_regclass('${saleorderTable}') IS NOT NULL
                    AND to_regclass('${billingorderTable}') IS NOT NULL
                    AND to_regclass('${shipmentorderTable}') IS NOT NULL
                THEN
                    EXECUTE '
                        CREATE MATERIALIZED VIEW IF NOT EXISTS ${shipmentSchema}.${orderView} AS
                        SELECT
                            sale_order.uuid,
                            sale_order.user_uuid,
                            sale_order.total_price,
                            shipment_order.order_status,
                            billing_order.payment_status,
                            sale_order.created_at,
                            sale_order.updated_at,
                            sale_order.deleted_at
                        FROM "sale_schema"."order" sale_order
                        LEFT JOIN "billing_schema"."order" billing_order
                            ON billing_order.uuid = sale_order.uuid
                            AND billing_order.deleted_at IS NULL
                        LEFT JOIN "shipment_schema"."order" shipment_order
                            ON shipment_order.uuid = sale_order.uuid
                            AND shipment_order.deleted_at IS NULL
                        WHERE sale_order.deleted_at IS NULL
                    ';

                    EXECUTE '
                        CREATE UNIQUE INDEX IF NOT EXISTS "IDX_order_listing_mv_uuid"
                        ON ${shipmentSchema}.${orderView} ("uuid")
                    ';
                END IF;
            END $$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // schemas
        const shipmentSchema = process.env.DB_POSTGRES_SHIPMENT_SCHEMA || "shipment_schema";

        // view
        const OrderView = process.env.DB_POSTGRES_ORDER_VIEW || "order_listing_mv";

        await queryRunner.query(`DROP MATERIALIZED VIEW IF EXISTS ${shipmentSchema}.${OrderView}`);
    }
}