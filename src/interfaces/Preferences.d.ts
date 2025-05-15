interface IPreferences {
  name: string
  rnc: string
  serie?: string
  secuencial?: string
  serieNC?: string
  secuencialNC?: string
  itbs: number
}

interface IUpdatePreferences {
  name?: string
  rnc?: string
  serie?: string
  secuencial?: string
  serieNC?: string
  secuencialNC?: string
  itbs?: number
}
