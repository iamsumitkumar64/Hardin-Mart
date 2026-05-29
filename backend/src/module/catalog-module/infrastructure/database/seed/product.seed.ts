import { faker } from '@faker-js/faker';
import { catalogDataSource, options } from '../data-source';
import { ProductEntity } from '../../../domain/product/product.entity';

// hardcoded products for all microservices
const products: Partial<ProductEntity>[] = [
    {
        id: 1,
        uuid: '550e8400-e29b-41d4-a716-446655440001',
        name: 'iPhone 15 Pro',
        description: 'Apple smartphone with A17 Pro chip and titanium body.',
        image_url: 'https://picsum.photos/seed/iphone15pro/640/480',
    },
    {
        id: 2,
        uuid: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Premium Android smartphone with 200MP camera.',
        image_url: 'https://picsum.photos/seed/s24ultra/640/480',
    },
    {
        id: 3,
        uuid: '550e8400-e29b-41d4-a716-446655440003',
        name: 'MacBook Air M3',
        description: 'Lightweight Apple laptop powered by M3 chip.',
        image_url: 'https://picsum.photos/seed/macbookairm3/640/480',
    },
    {
        id: 4,
        uuid: '550e8400-e29b-41d4-a716-446655440004',
        name: 'Dell XPS 15',
        description: 'High-performance ultrabook with InfinityEdge display.',
        image_url: 'https://picsum.photos/seed/dellxps15/640/480',
    },
    {
        id: 5,
        uuid: '550e8400-e29b-41d4-a716-446655440005',
        name: 'Sony WH-1000XM5',
        description: 'Industry-leading noise cancelling headphones.',
        image_url: 'https://picsum.photos/seed/sonyxm5/640/480',
    },
    {
        id: 6,
        uuid: '550e8400-e29b-41d4-a716-446655440006',
        name: 'Apple AirPods Pro 2',
        description: 'Wireless earbuds with active noise cancellation.',
        image_url: 'https://picsum.photos/seed/airpodspro2/640/480',
    },
    {
        id: 7,
        uuid: '550e8400-e29b-41d4-a716-446655440007',
        name: 'iPad Pro 12.9',
        description: 'Apple tablet with Liquid Retina XDR display.',
        image_url: 'https://picsum.photos/seed/ipadpro/640/480',
    },
    {
        id: 8,
        uuid: '550e8400-e29b-41d4-a716-446655440008',
        name: 'Samsung Galaxy Tab S9',
        description: 'Android flagship tablet with AMOLED display.',
        image_url: 'https://picsum.photos/seed/tabs9/640/480',
    },
    {
        id: 9,
        uuid: '550e8400-e29b-41d4-a716-446655440009',
        name: 'Logitech MX Master 3S',
        description: 'Advanced wireless productivity mouse.',
        image_url: 'https://picsum.photos/seed/mxmaster3s/640/480',
    },
    {
        id: 10,
        uuid: '550e8400-e29b-41d4-a716-446655440010',
        name: 'Keychron K8 Keyboard',
        description: 'Wireless mechanical keyboard for developers.',
        image_url: 'https://picsum.photos/seed/keychronk8/640/480',
    },
    {
        id: 11,
        uuid: '550e8400-e29b-41d4-a716-446655440011',
        name: 'Amazon Echo Dot 5',
        description: 'Smart speaker with Alexa voice assistant.',
        image_url: 'https://picsum.photos/seed/echodot5/640/480',
    },
    {
        id: 12,
        uuid: '550e8400-e29b-41d4-a716-446655440012',
        name: 'Google Nest Hub',
        description: 'Smart display for home automation.',
        image_url: 'https://picsum.photos/seed/nesthub/640/480',
    },
    {
        id: 13,
        uuid: '550e8400-e29b-41d4-a716-446655440013',
        name: 'Canon EOS R50',
        description: 'Mirrorless camera for creators and vloggers.',
        image_url: 'https://picsum.photos/seed/canoneosr50/640/480',
    },
    {
        id: 14,
        uuid: '550e8400-e29b-41d4-a716-446655440014',
        name: 'GoPro HERO12',
        description: 'Action camera with 5.3K video recording.',
        image_url: 'https://picsum.photos/seed/gopro12/640/480',
    },
    {
        id: 15,
        uuid: '550e8400-e29b-41d4-a716-446655440015',
        name: 'PlayStation 5',
        description: 'Next-gen gaming console from Sony.',
        image_url: 'https://picsum.photos/seed/ps5/640/480',
    },
    {
        id: 16,
        uuid: '550e8400-e29b-41d4-a716-446655440016',
        name: 'Xbox Series X',
        description: 'Powerful gaming console from Microsoft.',
        image_url: 'https://picsum.photos/seed/xboxseriesx/640/480',
    },
    {
        id: 17,
        uuid: '550e8400-e29b-41d4-a716-446655440017',
        name: 'Nintendo Switch OLED',
        description: 'Portable gaming console with OLED screen.',
        image_url: 'https://picsum.photos/seed/switcholed/640/480',
    },
    {
        id: 18,
        uuid: '550e8400-e29b-41d4-a716-446655440018',
        name: 'JBL Flip 6',
        description: 'Portable waterproof Bluetooth speaker.',
        image_url: 'https://picsum.photos/seed/jblflip6/640/480',
    },
    {
        id: 19,
        uuid: '550e8400-e29b-41d4-a716-446655440019',
        name: 'Dyson V15 Detect',
        description: 'Cordless vacuum cleaner with laser detection.',
        image_url: 'https://picsum.photos/seed/dysonv15/640/480',
    },
    {
        id: 20,
        uuid: '550e8400-e29b-41d4-a716-446655440020',
        name: 'Mi Smart Band 8',
        description: 'Affordable fitness tracking smart band.',
        image_url: 'https://picsum.photos/seed/miband8/640/480',
    },
];

async function create() {
    catalogDataSource.setOptions({
        ...options,
    });

    await catalogDataSource.initialize();

    const queryRunner = catalogDataSource.createQueryRunner();
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
        await catalogDataSource.destroy();
    }
}

void create();