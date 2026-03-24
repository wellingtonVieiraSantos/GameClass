import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class RegisterDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string

  @ApiProperty({ example: 'johndoe@email.com' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'senha123' })
  @IsString()
  password: string
}


export class LoginDto {
  @ApiProperty({ example: 'johndoe@email.com' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'senha123' })
  @IsString()
  password: string
}

export class RefreshTokenDto {
  @ApiProperty({ example: 'refresh_token' })
  @IsString()
  refresh_token: string
}


