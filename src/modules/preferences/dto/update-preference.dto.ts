import { ApiProperty } from '@nestjs/swagger'
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  MinLength,
} from 'class-validator'

export class UpdatePreferenceDto {
  @ApiProperty({
    example: 'SHU',
  })
  @IsOptional()
  @IsString()
  name: string

  @ApiProperty({
    example: '33322244',
  })
  @IsOptional()
  @IsString()
  @MinLength(9, { message: 'El RNC debe tener minimo 9 caracteres' })
  rnc: string

  @ApiProperty({
    example: 'B01',
  })
  @IsOptional()
  @IsString()
  @MinLength(3, {
    message: 'La serie de facturación debe ser una serie valida',
  })
  serie: string

  @ApiProperty({
    example: '00000001',
  })
  @IsOptional()
  @IsString()
  @MinLength(8, {
    message: 'El secuencial de facturación debe tener minimo 8 caracteres',
  })
  secuencial: string

  @ApiProperty({
    example: 'B04',
  })
  @IsOptional()
  @IsString()
  @MinLength(3, {
    message: 'La serie de nota de crédito debe ser una serie valida',
  })
  serieNC: string

  @ApiProperty({
    example: '00000001',
  })
  @IsOptional()
  @IsString()
  @MinLength(8, {
    message: 'El secuencial de nota de crédito debe tener minimo 8 caracteres',
  })
  secuencialNC: string

  @ApiProperty({
    example: 18,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(1)
  itbs: number
}
