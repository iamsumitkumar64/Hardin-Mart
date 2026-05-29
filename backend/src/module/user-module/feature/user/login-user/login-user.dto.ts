import { IsString, IsEmail, IsNotEmpty, MinLength, IsEnum } from 'class-validator';

export class LoginUserDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}