import { ViewColumn, ViewEntity } from "typeorm";

@ViewEntity({
    name: process.env.DB_POSTGRES_PRODUCT_VIEW || "product_listing_mv",
    schema: process.env.DB_POSTGRES_SHIPMENT_SCHEMA || 'shipment_schema',
    materialized: true,
    expression: `
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
        FROM "${process.env.DB_POSTGRES_CATALOG_SCHEMA || "catalog_schema"}"."product" catalog_product
        LEFT JOIN "${process.env.DB_POSTGRES_SALE_SCHEMA || "sale_schema"}"."product" sale_product
            ON sale_product.uuid = catalog_product.uuid
            AND sale_product.deleted_at IS NULL
        LEFT JOIN "${process.env.DB_POSTGRES_SHIPMENT_SCHEMA || "shipment_schema"}"."product" shipment_product
            ON shipment_product.uuid = catalog_product.uuid
            AND shipment_product.deleted_at IS NULL
        WHERE catalog_product.deleted_at IS NULL
    `,
})
export class ProductListingViewEntity {
    @ViewColumn()
    uuid: string;

    @ViewColumn()
    name: string;

    @ViewColumn()
    description: string;

    @ViewColumn()
    image_url: string;

    @ViewColumn()
    price: string;

    @ViewColumn()
    stock: number;

    @ViewColumn()
    created_at: Date;

    @ViewColumn()
    updated_at: Date;

    @ViewColumn()
    deleted_at: Date;
}
