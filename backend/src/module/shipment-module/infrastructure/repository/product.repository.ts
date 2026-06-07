import { BadRequestException, Injectable } from "@nestjs/common";
import { DataSource, Not, Repository } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { ProductEntity } from "../../domain/product/product.entity";
import { ProductListingViewEntity } from "../../domain/product/product-listing.view.entity";

@Injectable()
export class ProductRepository extends Repository<ProductEntity> {
    constructor(
        @InjectDataSource(process.env.DB_POSTGRES_SHIPMENT_SCHEMA || 'shipment_schema')
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

    async findByUuid(uuid: string) {
        const product = await this.findOne({
            where: {
                uuid: uuid
            }
        });
        return product;
    }

    async decreaseStock(productUuid: string, quantity: number) {
        const product = await this.findByUuid(productUuid);
        if (!product) {
            throw new BadRequestException(`Product ${productUuid} not found`);
        }

        if (product.stock < quantity) {
            throw new BadRequestException(`Not enough stock for product ${productUuid}`);
        }

        product.stock -= quantity;
        const shipmentSchema = process.env.DB_POSTGRES_SHIPMENT_SCHEMA || 'shipment_schema';
        const productView = process.env.DB_POSTGRES_PRODUCT_VIEW || "product_listing_mv";

        await this.dataSource.query(`REFRESH MATERIALIZED VIEW CONCURRENTLY ${shipmentSchema}.${productView}`);

        return await this.save(product);
    }

    async getProductListingFromMaterializedView(offset?: number, limit?: number) {
        const shipmentSchema = process.env.DB_POSTGRES_SHIPMENT_SCHEMA || 'shipment_schema';
        const productView = process.env.DB_POSTGRES_PRODUCT_VIEW || "product_listing_mv";
        const currOffset = Number(offset) || Number(process.env.page_offset) || 0;
        const currLimit = Number(limit) || Number(process.env.page_limit) || 10;

        await this.dataSource.query(`REFRESH MATERIALIZED VIEW CONCURRENTLY ${shipmentSchema}.${productView}`);

        const [data, total] = await this.dataSource.getRepository(ProductListingViewEntity).findAndCount({
            order: {
                created_at: 'DESC'
            },
            skip: currOffset,
            take: currLimit
        });

        return { data, total };
    }
}