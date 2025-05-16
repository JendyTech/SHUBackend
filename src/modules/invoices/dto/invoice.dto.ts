import { PAYMENT_CONDITIONS } from '@/shared/enums/payment.enum'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsDateString,
  IsInt,
  IsMongoId,
  Min,
  IsArray,
  ArrayNotEmpty,
  IsOptional,
  IsEnum,
} from 'class-validator'

export class CreateInvoiceItemDto {
  @ApiProperty({
    example: '60d9b7e1b5f0c9a4b4e1f1b0',
    description: 'Id de la factura',
  })
  @IsNotEmpty({ message: 'El id de la factura no puede estar vacío' })
  @IsString()
  id: string

  @ApiProperty({ example: 5, description: 'Cantidad de productos' })
  @IsInt()
  @Min(1, { message: 'La cantidad de productos no puede estar vacía' })
  quantity: number

  @ApiProperty({ example: 'Producto 1', description: 'Nombre del producto' })
  @IsString({ message: 'El nombre del producto debe ser un string' })
  @IsNotEmpty({ message: 'El nombre del producto no puede estar vacío' })
  name: string

  //price
  @ApiProperty({ example: 10, description: 'Precio unitario' })
  @IsInt()
  @Min(1, { message: 'El precio unitario no puede estar vacío' })
  price: number
}

export class CreateInvoiceDto {
  @ApiProperty({ example: '2021-05-25', description: 'Fecha de expiración' })
  @IsDateString()
  expirationDate: Date

  @ApiProperty({ example: 'Cliente 1', description: 'Nombre del cliente' })
  @IsString({ message: 'El nombre del cliente debe ser un string' })
  @IsNotEmpty({ message: 'El nombre del cliente no puede estar vacío' })
  clientName: string

  @ApiProperty({ example: 'B12141414852', description: 'RNC del cliente' })
  @IsString({ message: 'El RNC del cliente debe ser un string' })
  @IsNotEmpty({ message: 'El RNC del cliente no puede estar vacío' })
  @MinLength(9, { message: 'El RNC del cliente debe tener al menos 9 digitos' })
  clientRnc: string

  @ApiProperty({ example: 'AL_CONTADO', description: 'Condición de pago' })
  @IsString({ message: 'La condición de pago debe ser un string' })
  @IsNotEmpty({ message: 'La condición de pago no puede estar vacía' })
  paymentCondition: string

  @ApiProperty({ default: [], description: 'Items de la factura' })
  @IsArray({ message: 'Los items deben ser un array' })
  @ArrayNotEmpty({ message: 'Los items no pueden estar vacíos' })
  @Type(() => CreateInvoiceItemDto)
  items: CreateInvoiceItemDto[]
}
