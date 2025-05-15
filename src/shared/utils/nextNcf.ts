export function nextNcf(ncfActual: string): string {
  const serie = ncfActual.slice(0, 3) // "B01"
  const numero = ncfActual.slice(3) // "00000783"
  const siguiente = parseInt(numero, 10) + 1
  const nuevoNumero = siguiente.toString().padStart(numero.length, '0')
  return `${serie}${nuevoNumero}`
}
