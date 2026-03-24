import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class UserUpdateNameDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string
}

export class UserUpdateAvatarDto {
  @ApiProperty({ example: 'https://example.com/avatar.png' })
  @IsString()
  avatar: string
}

export class UserUpdatePasswordDto {
  @ApiProperty({ example: 'novaSenha123' })
  @IsString()
  password: string
}