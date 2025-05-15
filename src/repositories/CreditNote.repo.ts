import {
  CreateCreditNotes,
  GetCreditNoteByIdWithItemsResults,
} from '@/contracts/repositories/CreditNote.repo'
import { CreditNoteModel } from '@/database/creditnote.db'
import { PaginationDTO } from '@/shared/dto/Pagination.dto'
import { MODELS_NAMES } from '@/config/constants'
import { Types } from 'mongoose'
import { ICreditNote } from '@/interfaces/CreditNote'

export class CreditNoteRepository {
  static async getCreditNotes(pagination: PaginationDTO) {
    const response = await CreditNoteModel.find()
    return response
  }

  static async getCreditNotesById(id: string) {
    const result = await CreditNoteModel.findById(id)

    if (!result) return null

    return result.toObject()
  }

  static async getCreditNoteWithItems(
    id: string,
  ): Promise<null | GetCreditNoteByIdWithItemsResults> {
    const [creditNote = null] = await CreditNoteModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: MODELS_NAMES.CREDIT_NOTE_ITEMS,
          as: 'items',
          localField: '_id',
          foreignField: 'creditNoteId',
        },
      },
      {
        $limit: 1,
      },
    ])
    return creditNote
  }

  static async findById(id: string) {
    const result = await CreditNoteModel.findById(id)

    if (!result) return null

    return result.toObject()
  }

  static async findByNcf(ncf: string) {
    const result = await CreditNoteModel.findOne({
      creditNoteNumber: ncf,
    })

    if (!result) return null

    return result.toObject()
  }

  static async createCreditNotes(data: Partial<ICreditNote>) {
    const newCreditNote = new CreditNoteModel(data)

    const creditNote = await newCreditNote.save()

    return creditNote?.toObject()
  }

  static async deleteItem(id: string) {
    const result = await CreditNoteModel.findByIdAndDelete(id)

    if (!result) return null

    return result.toObject()
  }
}
