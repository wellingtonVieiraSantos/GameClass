import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from "class-validator"
import { Rarity, Reason } from "src/generated/prisma/enums"

export class BadgeCreateDto {
  @ApiProperty({ example: 'Nome do badge' })
  @IsString()
  name: string

  @ApiProperty({ example: 'Descrição do badge' })
  @IsString()
  description: string

  @ApiPropertyOptional({ example: 'URL da imagem do badge' })
  @IsString()
  @IsOptional()
  icon?: string

  @ApiProperty({ enum: Rarity, example: Rarity.COMMON })
  @IsEnum(Rarity)
  rarity: Rarity
}

export class BadgeUpdateDto {
  @ApiPropertyOptional({ example: 'Nome do badge' })
  @IsString()
  @IsOptional()
  name?: string

  @ApiPropertyOptional({ example: 'Descrição do badge' })
  @IsString()
  @IsOptional()
  description?: string

  @ApiPropertyOptional({ example: 'URL da imagem do badge' })
  @IsString()
  @IsOptional()
  icon?: string

  @ApiPropertyOptional({ enum: Rarity, example: Rarity.COMMON })
  @IsEnum(Rarity)
  @IsOptional()
  rarity?: Rarity
}

export class StudentScoreDto {
  @ApiProperty({ example: 'Pontuação' })
  @IsNumber()
  score: number

  @ApiProperty({ example: 'Semana' })
  @IsNumber()
  week: number

  @ApiProperty({ example: 'Ano' })
  @IsNumber()
  year: number

  @ApiProperty({ example: 'true' })
  @IsBoolean()
  isIncrease: boolean

  @ApiPropertyOptional({ enum: Reason, example: Reason.OTHER })
  @IsEnum(Reason)
  @IsOptional()
  reason?: Reason
}
