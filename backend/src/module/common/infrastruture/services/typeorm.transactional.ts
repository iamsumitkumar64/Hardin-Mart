import { DataSource, DataSourceOptions } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

export const createTransactionalDataSource = async (
    name: string,
    options: any,
) => {
    const dataSource = new DataSource(options);
    await dataSource.initialize();

    return addTransactionalDataSource({
        name,
        dataSource,
    });
};