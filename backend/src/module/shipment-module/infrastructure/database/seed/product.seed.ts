import { faker } from '@faker-js/faker';
import { shipmentDataSource, options } from '../data-source';
import { ProductEntity } from '../../../domain/product/product.entity';

// hardcoded products for all microservices
const products: Partial<ProductEntity>[] = [
    {
        id: 1,
        uuid: '550e8400-e29b-41d4-a716-446655440001',
        stock: 5,
    },
    {
        id: 2,
        uuid: '550e8400-e29b-41d4-a716-446655440002',
        stock: 8,
    },
    {
        id: 3,
        uuid: '550e8400-e29b-41d4-a716-446655440003',
        stock: 12,
    },
    {
        id: 4,
        uuid: '550e8400-e29b-41d4-a716-446655440004',
        stock: 3,
    },
    {
        id: 5,
        uuid: '550e8400-e29b-41d4-a716-446655440005',
        stock: 2,
    },
    {
        id: 6,
        uuid: '550e8400-e29b-41d4-a716-446655440006',
        stock: 5,
    },
    {
        id: 7,
        uuid: '550e8400-e29b-41d4-a716-446655440007',
        stock: 11,
    },
    {
        id: 8,
        uuid: '550e8400-e29b-41d4-a716-446655440008',
        stock: 8,
    },
    {
        id: 9,
        uuid: '550e8400-e29b-41d4-a716-446655440009',
        stock: 6,
    },
    {
        id: 10,
        uuid: '550e8400-e29b-41d4-a716-446655440010',
        stock: 7,
    },
    {
        id: 11,
        uuid: '550e8400-e29b-41d4-a716-446655440011',
        stock: 5,
    },
    {
        id: 12,
        uuid: '550e8400-e29b-41d4-a716-446655440012',
        stock: 10,
    },
    {
        id: 13,
        uuid: '550e8400-e29b-41d4-a716-446655440013',
        stock: 23,
    },
    {
        id: 14,
        uuid: '550e8400-e29b-41d4-a716-446655440014',
        stock: 1,
    },
    {
        id: 15,
        uuid: '550e8400-e29b-41d4-a716-446655440015',
        stock: 23,
    },
    {
        id: 16,
        uuid: '550e8400-e29b-41d4-a716-446655440016',
        stock: 3,
    },
    {
        id: 17,
        uuid: '550e8400-e29b-41d4-a716-446655440017',
        stock: 9,
    },
    {
        id: 18,
        uuid: '550e8400-e29b-41d4-a716-446655440018',
        stock: 3,
    },
    {
        id: 19,
        uuid: '550e8400-e29b-41d4-a716-446655440019',
        stock: 7,
    },
    {
        id: 20,
        uuid: '550e8400-e29b-41d4-a716-446655440020',
        stock: 3,
    },
];

async function create() {
    shipmentDataSource.setOptions({
        ...options,
    });

    await shipmentDataSource.initialize();

    const queryRunner = shipmentDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        // use same hardcoded products across all services
        const createdProducts = await queryRunner.manager.save(
            ProductEntity,
            products,
        );

        console.log(createdProducts);

        /*
        // faker random products (keep for future use if needed)
        const products: Partial<ProductEntity>[] = [];

        for (let i = 0; i < 50; i++) {
            const category = faker.commerce.product();

            products.push({
                name: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                image_url: faker.image.urlLoremFlickr({
                    category,
                    width: 640,
                    height: 480,
                }),
                stock: Number(
                    faker.commerce.stock({
                        min: 100,
                        max: 10000,
                        dec: 2,
                    }),
                ),
            });
        }

        await queryRunner.manager.save(ProductEntity, products);
        */

        await queryRunner.commitTransaction();

        console.info('✅ Products seeded successfully');
    } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error('❌ Something went wrong:', error);
    } finally {
        await queryRunner.release();
        await shipmentDataSource.destroy();
    }
}

void create();