import INVOICE from '@/messages/Invoice.json'
import GENERAL from '@/messages/General.json'
import { Injectable } from '@nestjs/common'
import { HttpStatus } from '@nestjs/common'
import { TaxService } from '@/modules/tax/tax.service'
import { successResponse, errorResponse } from '@/shared/functions/response'
import { InvoicesRepository } from '@/repositories/Invoices.repo'
import {
  CreateInvoiceDto,
  UpdateInvoiceDto,
} from '@/modules/invoices/dto/invoice.dto'
import { IUser } from '@/interfaces/User'
import { PreferencesRepository } from '@/repositories/Preferences.repo'
import { nextNcf } from '@/shared/utils/nextNcf'

@Injectable()
export class InvoicesService {
  constructor(private readonly taxService: TaxService) {}
  async getInvoices() {
    try {
      const result = await InvoicesRepository.getInvoices()

      return successResponse({
        data: result,
        message: INVOICE.INVOICES_FETCHED,
      })
    } catch (error) {
      return errorResponse({
        message: GENERAL.ERROR_DATABASE_MESSAGE,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      })
    }
  }

  async getInvoiceByNcf(ncf: string) {
    try {
      const result = await InvoicesRepository.getInvoiceByNCF(ncf)

      return successResponse({
        data: result,
        message: INVOICE.INVOICES_FETCHED,
      })
    } catch (error) {
      return errorResponse({
        message: GENERAL.ERROR_DATABASE_MESSAGE,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      })
    }
  }

  async createInvoice(dto: CreateInvoiceDto, user: IUser) {
    const currentDate = new Date()
    const dateExpirationInvoice = dto.expirationDate
      ? new Date(dto.expirationDate)
      : (() => {
          const date = new Date()
          date.setMonth(date.getMonth() + 1)
          return date
        })()

    if (
      new Date(currentDate.getTime() - 4 * 60 * 60 * 1000) >
      dateExpirationInvoice
    ) {
      return errorResponse({
        message: INVOICE.INVOICE_DATE_VALIDATION,
        status: HttpStatus.BAD_REQUEST,
      })
    }

    const preferences = await PreferencesRepository.getPreferences()

    const ncf = `${preferences.serie}${preferences.secuencial}`

    try {
      const invoice = await InvoicesRepository.findByNcf(ncf)
      if (invoice) {
        return errorResponse({
          message: INVOICE.INVOICE_NUMBER_IN_USE,
          status: HttpStatus.CONFLICT,
        })
      }
    } catch (error) {
      return errorResponse({
        message: GENERAL.ERROR_DATABASE_MESSAGE,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      })
    }

    try {
      const newInvoice = await InvoicesRepository.createInvoice({
        ...dto,
        rncNumber: preferences.rnc,
        invoiceNumber: ncf,
        items: dto.items,
        createdBy: user._id,
        expirationDate: dateExpirationInvoice,
        clientName: dto.clientName,
        clientRnc: dto.clientRnc,
        paymentCondition: dto.paymentCondition,
      })

      try {
        const ncf = nextNcf(preferences.secuencial)
        await PreferencesRepository.updatedPreferences({
          secuencial: ncf,
        })
      } catch (error) {
        return errorResponse({
          message: GENERAL.ERROR_DATABASE_MESSAGE,
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error,
        })
      }

      return successResponse({
        data: newInvoice,
        message: INVOICE.INVOICE_CREATED,
      })
    } catch (error) {
      return errorResponse({
        message: GENERAL.ERROR_DATABASE_MESSAGE,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      })
    }
  }

  async getInvoiceById(id: string, items: boolean = false) {
    let invoice

    try {
      invoice = await (items
        ? InvoicesRepository.getInvoicesWithItems(id)
        : InvoicesRepository.getInvoiceById(id))
    } catch (error) {
      return errorResponse({
        message: GENERAL.ERROR_DATABASE_MESSAGE,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      })
    }

    if (!invoice) {
      return errorResponse({
        message: INVOICE.INVOICE_NOT_FOUND,
        status: HttpStatus.NOT_FOUND,
      })
    }

    return successResponse({
      data: invoice,
      message: INVOICE.INVOICES_FETCHED,
    })
  }

  async deleteHistoryItem(id: string) {
    try {
      const result = await InvoicesRepository.deleteItem(id)
      return successResponse({
        data: result,
        message: 'Deleted invoice item',
      })
    } catch (error) {
      return errorResponse({
        message: GENERAL.ERROR_DATABASE_MESSAGE,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      })
    }
  }

  async updateInvoice(id: string, dto: UpdateInvoiceDto) {
    try {
      const invoice = await InvoicesRepository.getInvoiceById(id)

      if (!invoice) {
        return errorResponse({
          message: 'Invoice not found',
          status: HttpStatus.NOT_FOUND,
        })
      }

      const updatedInvoice = await InvoicesRepository.update(id, dto)

      return successResponse({
        data: updatedInvoice,
        message: INVOICE.INVOICE_UPDATED,
      })
    } catch (error) {
      return errorResponse({
        message: 'Hubo un error al actualizar la factura',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      })
    }
  }
}
