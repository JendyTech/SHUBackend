import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsMongoId,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  Min,
  IsInt,
} from 'class-validator'

export class CreateCreditNotesDto {
  @ApiProperty({
    example: 'Razón de la nota de crédito',
    description: 'Razón de la nota de crédito',
  })
  @IsString({ message: 'La razón de la nota de crédito no puede estar vacía' })
  reason: string

  @ApiProperty({
    example: 'F0100000001',
    description: 'NCF de la factura',
  })
  @IsNotEmpty({ message: 'El id de la factura no puede estar vacío' })
  invoiceNumber: string

  @ApiProperty({ example: 'B02147154745', description: 'RNC de la factura' })
  @IsString({ message: 'El RNC debe ser un string' })
  @IsOptional()
  rncNumber: string

  @ApiProperty({
    example: '2021-05-25',
    description: 'Fecha de expiración de la nota de crédito',
  })
  @IsDateString()
  @IsOptional()
  expirationDate: Date

  @ApiProperty({ example: 'Cliente 1', description: 'Nombre del cliente' })
  @IsString({ message: 'El nombre del cliente debe ser un string' })
  @IsOptional()
  clientName: string

  @ApiProperty({
    default: [{ id: '1', quantity: 2, name: 'Producto 1', price: 100 }],
    description: 'Items de la nota de crédito',
  })
  @IsArray({ message: 'Los items deben ser un array' })
  @ArrayNotEmpty({ message: 'Los items no pueden estar vacíos' })
  items: {
    id: string
    quantity: number
    name: string
    price: number
  }[]
}
