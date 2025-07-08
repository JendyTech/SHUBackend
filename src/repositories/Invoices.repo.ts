import {
  CreateInvoices,
  GetInvoiceByIdWithItemsResults,
} from '@/contracts/repositories/Invoices.repo'
import { InvoiceModel } from '@/database/invoices.db'
import { MODELS_NAMES } from '@/config/constants'
import { Types } from 'mongoose'

export class InvoicesRepository {
  static async getInvoices() {
    const response = await InvoiceModel.find()
    return response
  }

  static async getInvoiceById(id: string) {
    const result = await InvoiceModel.findById(id)

    if (!result) return null

    return result.toObject()
  }

  static async getInvoiceByNCF(ncf: string) {
    const result = await InvoiceModel.findOne({
      invoiceNumber: ncf,
    })

    if (!result) return null

    return result.toObject()
  }

  static async createInvoice(data: CreateInvoices) {
    const newInvoice = new InvoiceModel(data)

    const invoice = await newInvoice.save()

    return invoice?.toObject()
  }

  static async getInvoicesWithItems(
    id: string,
  ): Promise<null | GetInvoiceByIdWithItemsResults> {
    const [invoice = null] = await InvoiceModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: MODELS_NAMES.INVOICE_ITEMS,
          as: 'items',
          localField: '_id',
          foreignField: 'invoiceId',
        },
      },
      {
        $limit: 1,
      },
    ])
    return invoice
  }

  static async findById(id: string) {
    const result = await InvoiceModel.findById(id)

    if (!result) return null

    return result.toObject()
  }

  static async findByNcf(ncf: string) {
    const result = await InvoiceModel.findOne({ invoiceNumber: ncf })

    if (!result) return null

    return result.toObject()
  }

  static async getInvoiceByRnc(rncNumber: string) {
    const result = await InvoiceModel.findOne({ rncNumber })

    if (!result) return null

    return result.toObject()
  }

  static async getLastInvoiceNumber(): Promise<string | null> {
    const lastInvoice = await InvoiceModel.findOne({})
      .sort({ createdAt: -1 })
      .select('invoiceNumber')

    return lastInvoice?.invoiceNumber || null
  }

  static async deleteItem(id: string) {
    const result = await InvoiceModel.findByIdAndDelete(id)

    if (!result) return null

    return result.toObject()
  }

  static async update(id: string, data: Partial<CreateInvoices>) {
    const result = await InvoiceModel.findByIdAndUpdate(id, data, {
      new: true,
    })

    if (!result) return null

    return result.toObject()
  }
}
