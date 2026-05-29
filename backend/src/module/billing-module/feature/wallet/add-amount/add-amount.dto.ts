import { IsUUID, IsNumber, Min } from 'class-validator';

export class AddAmountWalletDto {
    @IsNumber()
    @Min(1)
    amount: number;
}