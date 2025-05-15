import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { HistoryService } from './history.service'
import { CreateHistoryItemDto } from '@/modules/history/dtos/create-history.dto'

@Controller('/api/history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}
  @Get('/')
  getItems() {
    return this.historyService.getHistoryItems()
  }

  @Post('/')
  createItem(@Body() dto: CreateHistoryItemDto) {
    return this.historyService.createHistoryItem(dto)
  }

  @Get('/:match')
  getItemByMatch(@Param('match') match: string) {
    return this.historyService.getHistoryItemById(match)
  }

  @Delete('/:id')
  deleteItem(@Param('id') id: string) {
    return this.historyService.deleteHistoryItem(id)
  }
}
