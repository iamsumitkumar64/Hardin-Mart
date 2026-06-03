import { BadRequestException, Injectable } from "@nestjs/common";
import { DataSource, Not, Repository } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { ProductEntity } from "../../domain/product/product.entity";

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
        return await this.save(product);
    }
}