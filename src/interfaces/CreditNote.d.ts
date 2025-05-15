import { ObjectId } from 'mongoose'

interface ICreditNoteItem {
  id: string
  quantity: number
  name: string
  price: number
}

export interface ICreditNote {
  _id: string
  creditNoteNumber: string
  invoiceNumber: string
  expirationDate: Date
  clientName: string
  reason: string
  clientRnc: string
  items: ICreditNoteItem[]
  createdBy: ObjectId | string
  createdAt: Date
  updatedAt: Date
}
