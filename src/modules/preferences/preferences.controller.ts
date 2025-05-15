import { Controller, Get, Body, Patch } from '@nestjs/common'
import { PreferencesService } from './preferences.service'
import { UpdatePreferenceDto } from './dto/update-preference.dto'

@Controller('/api/preferences')
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Get('/')
  getPreferences() {
    return this.preferencesService.getPreferences()
  }

  @Patch('/')
  update(@Body() updatePreferenceDto: UpdatePreferenceDto) {
    return this.preferencesService.updatePreferences(updatePreferenceDto)
  }
}
