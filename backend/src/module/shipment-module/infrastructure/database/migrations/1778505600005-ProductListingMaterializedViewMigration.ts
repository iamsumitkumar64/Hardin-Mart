import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductListingMaterializedViewMigration177850560005 implements MigrationInterface {
    name = "ProductListingMaterializedViewMigration1778505600005";

    public async up(queryRunner: QueryRunner): Promise<void> {
        // schemas
        const catalogSchema = (process.env.DB_POSTGRES_CATALOG_SCHEMA || "catalog_schema");
        const saleSchema = (process.env.DB_POSTGRES_SALE_SCHEMA || "sale_schema");
        const shipmentSchema = (process.env.DB_POSTGRES_SHIPMENT_SCHEMA || "shipment_schema");

        // tables
        const catalogProductTable = (`${catalogSchema}."product"`);
        const saleProductTable = (`${saleSchema}."product"`);
        const shipmentProductTable = (`${shipmentSchema}."product"`);

        // view
        const productView = process.env.DB_POSTGRES_PRODUCT_VIEW || "product_listing_mv";

        await queryRunner.query(`
            DO $$
            BEGIN
                IF to_regclass('${catalogProductTable}') IS NOT NULL
                    AND to_regclass('${saleProductTable}') IS NOT NULL
                    AND to_regclass('${shipmentProductTable}') IS NOT NULL
                THEN
                    EXECUTE '
                        CREATE MATERIALIZED VIEW IF NOT EXISTS ${shipmentSchema}.${productView} AS
                        SELECT
                            catalog_product.uuid,
                            catalog_product.name,
                            catalog_product.description,
                            catalog_product.image_url,
                            sale_product.price,
                            shipment_product.stock,
                            catalog_product.created_at,
                            catalog_product.updated_at,
                            catalog_product.deleted_at
                        FROM ${catalogSchema}."product" catalog_product
                        LEFT JOIN ${saleSchema}."product" sale_product
                            ON sale_product.uuid = catalog_product.uuid
                            AND sale_product.deleted_at IS NULL
                        LEFT JOIN ${shipmentSchema}."product" shipment_product
                            ON shipment_product.uuid = catalog_product.uuid
                            AND shipment_product.deleted_at IS NULL
                        WHERE catalog_product.deleted_at IS NULL
                    ';

                    EXECUTE '
                        CREATE UNIQUE INDEX IF NOT EXISTS "IDX_product_listing_mv_uuid"
                        ON ${shipmentSchema}.${productView} ("uuid")
                    ';
                END IF;
            END $$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // schemas
        const shipmentSchema = process.env.DB_POSTGRES_SHIPMENT_SCHEMA || "shipment_schema";

        // view
        const productView = process.env.DB_POSTGRES_PRODUCT_VIEW || "product_listing_mv";

        await queryRunner.query(`DROP MATERIALIZED VIEW IF EXISTS ${shipmentSchema}.${productView}`);
    }
}
