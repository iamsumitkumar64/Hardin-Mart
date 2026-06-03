import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { ProductListingViewEntity } from "../../domain/product/product-listing.view.entity";
import { ProductEntity } from "../../domain/product/product.entity";

@Injectable()
export class ProductRepository extends Repository<ProductEntity> {
    constructor(
        @InjectDataSource(process.env.DB_POSTGRES_CATALOG_SCHEMA || 'catalog_schema')
        private readonly dataSource: DataSource,
    ) {
        super(ProductEntity, dataSource.createEntityManager());
    }

    async createProduct(body: Partial<ProductEntity>) {
        const entry = this.create(body);
        return await this.save(entry);
    }

    async getProductListing(offset?: number, limit?: number) {
        const [data, total] = await this.findAndCount({
            order: {
                created_at: 'DESC'
            },
            skip: offset || Number(process.env.page_offset) || 0,
            take: limit || Number(process.env.page_limit) || 10
        });

        return { data, total };
    }

    async getProductListingFromMaterializedView(offset?: number, limit?: number) {
        const catalogSchema = this.quoteIdentifier(process.env.DB_POSTGRES_CATALOG_SCHEMA || 'catalog_schema');
        const currOffset = Number(offset) || Number(process.env.page_offset) || 0;
        const currLimit = Number(limit) || Number(process.env.page_limit) || 10;

        await this.dataSource.query(`REFRESH MATERIALIZED VIEW ${catalogSchema}."product_listing_mv"`);

        const [data, total] = await this.dataSource.getRepository(ProductListingViewEntity).findAndCount({
            order: {
                created_at: 'DESC'
            },
            skip: currOffset,
            take: currLimit
        });

        return { data, total };
    }

    async findByUuid(uuid: string) {
        const product = await this.findOne({
            where: {
                uuid: uuid
            }
        });
        return product;
    }

    private quoteIdentifier(identifier: string) {
        return `"${identifier.replace(/"/g, '""')}"`;
    }

}
