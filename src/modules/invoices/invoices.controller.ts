import {
  Controller,
  Query,
  Get,
  Post,
  Body,
  Param,
  Delete,
} from '@nestjs/common'
import { InvoicesService } from '@/modules/invoices/invoices.service'
import { PaginationDTO } from '@/shared/dto/Pagination.dto'
import { CreateInvoiceDto } from '@/modules/invoices/dto/invoice.dto'
import { IUser } from '@/interfaces/User'
import { User } from '@/shared/decorators/Session'

@Controller('/api/invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get('/')
  getInvoices() {
    return this.invoicesService.getInvoices()
  }

  @Post('/')
  createInvoice(@Body() dto: CreateInvoiceDto, @User() user: IUser) {
    return this.invoicesService.createInvoice(dto, user)
  }

  @Get('/:id')
  getInvoiceById(
    @Param('id') id: string,
    @Query('items') items: boolean = false,
  ) {
    return this.invoicesService.getInvoiceById(id, String(items) === 'true')
  }

  @Get('by-ncf/:ncf')
  getInvoiceByNCF(@Param('ncf') ncf: string) {
    return this.invoicesService.getInvoiceByNcf(ncf)
  }

  @Delete('/:id')
  deleteInvoice(@Param('id') id: string) {
    return this.invoicesService.deleteHistoryItem(id)
  }
}
