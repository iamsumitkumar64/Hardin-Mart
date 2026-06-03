import { IsUUID, IsNumber, Min } from 'class-validator';

export class GetrazorPayLinkDto {
    @IsNumber()
    @Min(1)
    total_price: number;
}