import { IsUUID, IsNumber, Min } from 'class-validator';

export class OrderPlacedDto {
    @IsUUID()
    order_uuid: string;
}