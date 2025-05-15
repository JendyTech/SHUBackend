import { IInvoice, IInvoiceItem } from '@/interfaces/Invoice'

export interface CreateInvoices
  extends Omit<IInvoice, '_id' | 'createdAt' | 'updatedAt'> {
  items: CreateInvoiceItem[]
}

export interface CreateInvoiceItem {
  id: string
  quantity: number
  name: string
  price: number
}

export interface GetInvoiceByIdWithItemsResults extends IInvoice {
  items: IInvoiceItem[]
}
