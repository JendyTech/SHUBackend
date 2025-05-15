import { CreateHistoryItem } from '@/contracts/repositories/HistoryItems'
import { HistoryItemModel } from '@/database/history_item.db'

export class HistoryItemsRepository {
  static async getAllItems() {
    const response = await HistoryItemModel.find()
    return response
  }

  static async getHistoryMatchItems(match: string) {
    const result = await HistoryItemModel.find({
      name: {
        $regex: match,
        $options: 'i',
      },
    })

    if (!result) return null

    return result.map((item) => item.toObject())
  }

  static async createHisotryItems(data: CreateHistoryItem) {
    const model = new HistoryItemModel(data)

    const item = await model.save()

    return item?.toObject()
  }

  static async deleteHistoryItem(id: string) {
    const result = await HistoryItemModel.findByIdAndDelete(id)

    if (!result) return null

    return result.toObject()
  }
}
