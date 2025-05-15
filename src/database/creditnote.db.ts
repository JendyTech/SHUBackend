import { ICreditNote } from '@/interfaces/CreditNote'
import { model, Schema, Types } from 'mongoose'
import { MODELS_NAMES } from '@/config/constants'

const creditNoteSchema = new Schema<ICreditNote>(
  {
    creditNoteNumber: {
      type: String,
      required: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    clientName: {
      type: String,
      required: false,
    },
    reason: {
      type: String,
      required: true,
    },
    clientRnc: {
      type: String,
      required: false,
    },
    items: [
      {
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
      },
    ],
    createdBy: {
      type: Types.ObjectId,
      required: true,
    },
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

export const CreditNoteModel = model<ICreditNote>(
  MODELS_NAMES.CREDIT_NOTES,
  creditNoteSchema,
)
