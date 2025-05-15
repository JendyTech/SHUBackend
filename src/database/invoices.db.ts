import { IInvoice, IInvoiceItem } from '@/interfaces/Invoice'
import { model, Schema, Types } from 'mongoose'
import { MODELS_NAMES } from '@/config/constants'

const invoiceItemSchema = new Schema<IInvoiceItem>({
  id: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
})

export const InvoiceItemModel = model<IInvoiceItem>(
  MODELS_NAMES.INVOICE_ITEMS,
  invoiceItemSchema,
)

const invoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    rncNumber: {
      type: String,
      required: true,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    clientRnc: {
      type: String,
      required: true,
    },
    paymentCondition: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      required: true,
    },
    items: {
      type: [invoiceItemSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export const InvoiceModel = model<IInvoice>(
  MODELS_NAMES.INVOICES,
  invoiceSchema,
)
