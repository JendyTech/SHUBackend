import { model, Schema } from 'mongoose'

const preferencesSchema = new Schema<IPreferences>({
  name: {
    type: String,
  },
  rnc: {
    type: String,
  },
  serie: {
    type: String,
  },
  secuencial: {
    type: String,
  },
  itbs: {
    type: Number,
  },
  serieNC: {
    type: String,
  },
  secuencialNC: {
    type: String,
  },
})

export const PreferencesModel = model<IPreferences>(
  'preferences',
  preferencesSchema,
)
