import { faker } from '@faker-js/faker';
import { saleDataSource, options } from '../data-source';
import { ProductEntity } from '../../../domain/product/product.entity';

// hardcoded products for all microservices
const products: Partial<ProductEntity>[] = [
    {
        id: 1,
        uuid: '550e8400-e29b-41d4-a716-446655440001',
        price: 13,
    },
    {
        id: 2,
        uuid: '550e8400-e29b-41d4-a716-446655440002',
        price: 12,
    },
    {
        id: 3,
        uuid: '550e8400-e29b-41d4-a716-446655440003',
        price: 1549,
    },
    {
        id: 4,
        uuid: '550e8400-e29b-41d4-a716-446655440004',
        price: 17,
    },
    {
        id: 5,
        uuid: '550e8400-e29b-41d4-a716-446655440005',
        price: 2,
    },
    {
        id: 6,
        uuid: '550e8400-e29b-41d4-a716-446655440006',
        price: 249,
    },
    {
        id: 7,
        uuid: '550e8400-e29b-41d4-a716-446655440007',
        price: 11,
    },
    {
        id: 8,
        uuid: '550e8400-e29b-41d4-a716-446655440008',
        price: 8,
    },
    {
        id: 9,
        uuid: '550e8400-e29b-41d4-a716-446655440009',
        price: 32,
    },
    {
        id: 10,
        uuid: '550e8400-e29b-41d4-a716-446655440010',
        price: 84,
    },
    {
        id: 11,
        uuid: '550e8400-e29b-41d4-a716-446655440011',
        price: 54,
    },
    {
        id: 12,
        uuid: '550e8400-e29b-41d4-a716-446655440012',
        price: 89,
    },
    {
        id: 13,
        uuid: '550e8400-e29b-41d4-a716-446655440013',
        price: 749,
    },
    {
        id: 14,
        uuid: '550e8400-e29b-41d4-a716-446655440014',
        price: 449,
    },
    {
        id: 15,
        uuid: '550e8400-e29b-41d4-a716-446655440015',
        price: 549,
    },
    {
        id: 16,
        uuid: '550e8400-e29b-41d4-a716-446655440016',
        price: 529,
    },
    {
        id: 17,
        uuid: '550e8400-e29b-41d4-a716-446655440017',
        price: 329,
    },
    {
        id: 18,
        uuid: '550e8400-e29b-41d4-a716-446655440018',
        price: 119,
    },
    {
        id: 19,
        uuid: '550e8400-e29b-41d4-a716-446655440019',
        price: 649,
    },
    {
        id: 20,
        uuid: '550e8400-e29b-41d4-a716-446655440020',
        price: 39,
    },
];

async function create() {
    saleDataSource.setOptions({
        ...options,
    });

    await saleDataSource.initialize();

    const queryRunner = saleDataSource.createQueryRunner();
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
                price: Number(
                    faker.commerce.price({
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
        await saleDataSource.destroy();
    }
}

void create();