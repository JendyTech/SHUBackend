import { PreferencesModel } from '@/database/preferences.db'
import { Types } from 'mongoose'

export class PreferencesRepository {
  static async updatedPreferences(data: Partial<IUpdatePreferences>) {
    const result = await PreferencesModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId('681396234ae84cf3bc34ff9a'),
      },
      data,
      {
        new: true,
      },
    )

    if (!result) return null

    return result.toObject()
  }

  static async getPreferences() {
    const result = await PreferencesModel.findOne({
      _id: new Types.ObjectId('681396234ae84cf3bc34ff9a'),
    })
    return result.toObject()
  }
}
