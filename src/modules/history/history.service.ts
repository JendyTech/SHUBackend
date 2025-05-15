import { HistoryItemsRepository } from '@/repositories/HistoryItem.repo'
import { HttpStatus, Injectable } from '@nestjs/common'
import GENERAL from '@/messages/General.json'
import { errorResponse, successResponse } from '@/shared/functions/response'
import { CreateHistoryItemDto } from '@/modules/history/dtos/create-history.dto'

@Injectable()
export class HistoryService {
  constructor() {}

  async getHistoryItems() {
    try {
      const result = await HistoryItemsRepository.getAllItems()
      return successResponse({
        data: result,
        message: 'Fetched history items',
      })
    } catch (error) {
      return errorResponse({
        message: GENERAL.ERROR_DATABASE_MESSAGE,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      })
    }
  }

  async createHistoryItem(dto: CreateHistoryItemDto) {
    try {
      const result = await HistoryItemsRepository.createHisotryItems(dto)
      return successResponse({
        data: result,
        message: 'Created history item',
      })
    } catch (error) {
      return errorResponse({
        message: GENERAL.ERROR_DATABASE_MESSAGE,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      })
    }
  }

  async getHistoryItemById(match: string) {
    try {
      const result = await HistoryItemsRepository.getHistoryMatchItems(match)
      return successResponse({
        data: result.map((item) => ({
          name: item.name,
          price: item.price,
        })),
        message: 'Fetched history item',
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
      const result = await HistoryItemsRepository.deleteHistoryItem(id)
      return successResponse({
        data: result,
        message: 'Deleted history item',
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
