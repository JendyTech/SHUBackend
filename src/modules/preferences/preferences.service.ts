import { HttpStatus, Injectable } from '@nestjs/common'
import { UpdatePreferenceDto } from './dto/update-preference.dto'
import { errorResponse, successResponse } from '@/shared/functions/response'
import { PreferencesRepository } from '@/repositories/Preferences.repo'
import GENERAL from '@/messages/General.json'
import PREFERENCES from '@/messages/Preferences.json'

@Injectable()
export class PreferencesService {
  constructor() {}

  async updatePreferences(dto: UpdatePreferenceDto) {
    try {
      const prefrences = await PreferencesRepository.updatedPreferences(dto)

      return successResponse({
        data: prefrences,
        message: PREFERENCES.PREFERENCES_UPDATED,
      })
    } catch (error) {
      console.error(error)
      return errorResponse({
        message: 'Error interno al actualizar preferencias',
        status: 500,
      })
    }
  }

  async getPreferences() {
    try {
      const preferences = await PreferencesRepository.getPreferences()

      return successResponse({
        data: preferences,
        message: PREFERENCES.PREFERENCES_FETCHED,
      })
    } catch (error) {
      return errorResponse({
        message: GENERAL.ERROR_DATABASE_MESSAGE,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      })
    }
  }
}
