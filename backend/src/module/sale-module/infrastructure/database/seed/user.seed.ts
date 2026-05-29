import { faker } from '@faker-js/faker';
import { saleDataSource, options } from '../data-source';
import { BcryptService } from '../../../../common/infrastruture/services/bcrypt.service';
import { UserEntity } from '../../../domain/user/user.entity';

// hardcoded users for all microservices
const users = [
    {
        id: 1,
        uuid: 'c0a80101-7b1d-4a9f-8c1a-123456789001',
        email: 'user1@gmail.com',
        name: 'user 1',
    },
    {
        id: 2,
        uuid: 'c0a80102-7b1d-4a9f-8c1a-123456789002',
        email: 'user2@gmail.com',
        name: 'user 2',
    },
];

async function create() {
    saleDataSource.setOptions({
        ...options,
    });

    await saleDataSource.initialize();

    // const bcryptService = new BcryptService();
    // const hashedPassword = await bcryptService.hashPassword("123");

    const queryRunner = saleDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars

        // use same users across all services
        for (const user of users) {
            const created_user = await queryRunner.manager.save(UserEntity, {
                id: user.id,
                uuid: user.uuid,
                email: user.email,// faker.internet.email(),
                // password: hashedPassword,
                name: user.name,// faker.person.fullName(),
            });

            console.log(created_user);
        }

        await queryRunner.commitTransaction();
        console.info('✅ Seeded successfully');
    } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error('❌ Something went wrong:', error);
    } finally {
        await queryRunner.release();
        await saleDataSource.destroy();
    }
}

void create();