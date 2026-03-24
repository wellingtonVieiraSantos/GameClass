import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Role } from "src/generated/prisma/enums"
import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator"

export class UserCreateDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string

  @ApiProperty({ example: 'johndoe@email.com' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'senha123' })
  @IsString()
  password: string
  
  @ApiPropertyOptional({ enum: Role, example: Role.TEACHER })
  @IsEnum(Role)
  @IsOptional()
  role?: Role
}

export class UserUpdateDto {
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsString()
  @IsOptional()
  name?: string

  @ApiPropertyOptional({ example: 'johndoe@email.com' })
  @IsEmail()
  @IsOptional()
  email?: string

  @ApiPropertyOptional({ example: 'senha123' })
  @IsString()
  @IsOptional()
  password?: string

  @ApiPropertyOptional({ enum: Role, example: Role.TEACHER })
  @IsEnum(Role)
  @IsOptional()
  role?: Role
}