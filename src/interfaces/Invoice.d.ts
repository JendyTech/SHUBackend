import { PAYMENT_CONDITIONS } from '@/shared/enums/payment.enum'
import { ObjectId } from 'mongoose'

export interface IInvoice {
  _id: string
  invoiceNumber: string
  rncNumber: string
  expirationDate: Date
  clientName: string
  clientRnc: string
  paymentCondition: string
  createdBy: ObjectId | string
  createdAt: Date
  updatedAt: Date
  items: IInvoiceItem[]
}

export interface IInvoiceItem {
  id: string
  quantity: number
  name: string
  price: number
}
