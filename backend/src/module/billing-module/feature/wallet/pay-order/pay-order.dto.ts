import { IsUUID, IsNumber, Min } from 'class-validator';

export class PayOrderDto {
    @IsUUID()
    order_uuid: string;
}