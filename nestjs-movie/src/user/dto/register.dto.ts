import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: "L'email de l'utilisateur",
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Le mot de passe de l'utilisateur",
    example: 'password123',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
