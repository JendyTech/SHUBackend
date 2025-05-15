import { ApiProperty } from '@nestjs/swagger'
import { IsPositive, IsString, Min } from 'class-validator'

export class CreateHistoryItemDto {
  @ApiProperty({
    example: 'Bocina',
  })
  @IsString()
  name: string

  @ApiProperty({
    example: 100,
  })
  @IsPositive()
  @Min(1)
  price: number
}
