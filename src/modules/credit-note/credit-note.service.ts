import { CreateCreditNoteItem } from '@/contracts/repositories/CreditNote.repo'
import { IUser } from '@/interfaces/User'
import CREDIT_NOTE from '@/messages/CreditNotes.json'
import GENERAL from '@/messages/General.json'
import { CreateCreditNotesDto } from '@/modules/credit-note/dto/creditnote.dto'
import { HttpStatus, Injectable } from '@nestjs/common'
import { CreditNoteRepository } from '@/repositories/CreditNote.repo'
import { ProductRepository } from '@/repositories/Products.repo'
import { InvoicesRepository } from '@/repositories/Invoices.repo'
import { PaginationDTO } from '@/shared/dto/Pagination.dto'
import { errorResponse, successResponse } from '@/shared/functions/response'
import INVOICE from '@/messages/Invoice.json'
import { PreferencesRepository } from '@/repositories/Preferences.repo'
import { nextNcf } from '@/shared/utils/nextNcf'

@Injectable()
export class CreditNoteService {
  async getCreditNotes(pagination: PaginationDTO) {
    try {
      const result = await CreditNoteRepository.getCreditNotes(pagination)

      return successResponse({
        data: result,
        message: CREDIT_NOTE.CREDIT_NOTES_FETCHED,
      })
    } catch (error) {
      return errorResponse({
        message: GENERAL.ERROR_DATABASE_MESSAGE,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      })
    }
  }

  async getCreditNoteById(id: string, items: boolean = false) {
    let creditnote

    try {
      creditnote = await (items
        ? CreditNoteRepository.getCreditNoteWithItems(id)
        : CreditNoteRepository.getCreditNotesById(id))
    } catch (error) {
      return errorResponse({
        message: GENERAL.ERROR_DATABASE_MESSAGE,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      })
    }

    if (!creditnote) {
      return errorResponse({
        message: CREDIT_NOTE.CREDIT_NOTE_NOT_FOUND,
        status: HttpStatus.NOT_FOUND,
      })
    }

    return successResponse({
      data: creditnote,
      message: CREDIT_NOTE.CREDIT_NOTES_FETCHED,
    })
  }

  async createCreditNote(dto: CreateCreditNotesDto, user: IUser) {
    const { clientName, invoiceNumber, items, reason, rncNumber } = dto

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
    const ncf = `${preferences.serieNC}${preferences.secuencialNC}`

    try {
      const credit_note = await CreditNoteRepository.findByNcf(ncf)
      if (credit_note) {
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
      const newCreditNote = await CreditNoteRepository.createCreditNotes({
        ...dto,
        creditNoteNumber: ncf,
        items: items,
        createdBy: user._id,
        expirationDate: dto.expirationDate || dateExpirationInvoice,
        clientRnc: rncNumber,
        reason: dto.reason,
      })

      try {
        const ncf = nextNcf(preferences.secuencialNC)
        await PreferencesRepository.updatedPreferences({
          secuencialNC: ncf,
        })
      } catch (error) {
        return errorResponse({
          message: GENERAL.ERROR_DATABASE_MESSAGE,
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error,
        })
      }

      return successResponse({
        data: newCreditNote,
        message: CREDIT_NOTE.CREDIT_NOTE_CREATED,
      })
    } catch (error) {
      return errorResponse({
        message: GENERAL.ERROR_DATABASE_MESSAGE,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      })
    }
  }

  async deleteHistoryItem(id: string) {
    try {
      const result = await CreditNoteRepository.deleteItem(id)
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
}
