import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductListingMaterializedViewMigration1778505600002 implements MigrationInterface {
    name = "ProductListingMaterializedViewMigration1778505600002";

    public async up(queryRunner: QueryRunner): Promise<void> {
        const catalogSchema = this.quoteIdentifier(process.env.DB_POSTGRES_CATALOG_SCHEMA || "catalog_schema");
        const saleSchema = this.quoteIdentifier(process.env.DB_POSTGRES_SALE_SCHEMA || "sale_schema");
        const shipmentSchema = this.quoteIdentifier(process.env.DB_POSTGRES_SHIPMENT_SCHEMA || "shipment_schema");
        const catalogProductTable = this.escapeLiteral(`${catalogSchema}."product"`);
        const saleProductTable = this.escapeLiteral(`${saleSchema}."product"`);
        const shipmentProductTable = this.escapeLiteral(`${shipmentSchema}."product"`);

        await queryRunner.query(`
            DO $$
            BEGIN
                IF to_regclass('${catalogProductTable}') IS NOT NULL
                    AND to_regclass('${saleProductTable}') IS NOT NULL
                    AND to_regclass('${shipmentProductTable}') IS NOT NULL
                THEN
                    EXECUTE '
                        CREATE MATERIALIZED VIEW IF NOT EXISTS ${catalogSchema}."product_listing_mv" AS
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
                        ON ${catalogSchema}."product_listing_mv" ("uuid")
                    ';
                END IF;
            END $$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const catalogSchema = this.quoteIdentifier(process.env.DB_POSTGRES_CATALOG_SCHEMA || "catalog_schema");

        await queryRunner.query(`DROP MATERIALIZED VIEW IF EXISTS ${catalogSchema}."product_listing_mv"`);
    }

    private quoteIdentifier(identifier: string) {
        return `"${identifier.replace(/"/g, '""')}"`;
    }

    private escapeLiteral(value: string) {
        return value.replace(/'/g, "''");
    }
}
