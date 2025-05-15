import { MODELS_NAMES } from '@/config/constants'
import { model, Schema } from 'mongoose'

const historySchema = new Schema<HistoryItem>(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export const HistoryItemModel = model<HistoryItem>(
  MODELS_NAMES.HISTORY_ITEMS,
  historySchema,
)
