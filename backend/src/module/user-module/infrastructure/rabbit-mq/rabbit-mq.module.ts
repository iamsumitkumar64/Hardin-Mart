import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbit-mq.service';
import { UserRepository } from '../repository/user.repository';
import { OutboxRepository } from '../repository/outbox.repository';

@Module({
    providers: [
        RabbitMQService,
        OutboxRepository,
        UserRepository,
    ],
    exports: [RabbitMQService],
})
export class UserRabbitMQModule { }
