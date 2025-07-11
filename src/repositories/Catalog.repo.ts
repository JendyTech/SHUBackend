import { PaginationDTO } from '@/shared/dto/Pagination.dto'
import { ProductModel } from '@/database/products.db'
import { mongoosePagination } from '@/shared/functions/pagination'
import { FilterQuery, Types } from 'mongoose'
import { IProduct } from '@/interfaces/Product'
import { MODELS_NAMES } from '@/config/constants'
import { CatalogPaginationDTO } from '@/shared/dto/CatalogPagination.dto'

export class CatalogRepository {
  static async getCatalog(
    pagination: CatalogPaginationDTO,
    minPrice?: number,
    maxPrice?: number,
  ) {
    const filters: FilterQuery<IProduct> = {}

    if (pagination.search) {
      filters.$or = [
        {
          name: { $regex: new RegExp(pagination.search, 'i') },
        },
        {
          code: { $regex: new RegExp(pagination.search, 'i') },
        },
      ]

      const pricing = Number(pagination.search)
      if (!isNaN(pricing)) {
        filters.$or.push({
          price: pricing,
        })
      }
    }

    if (
      pagination.minPrice !== undefined ||
      pagination.maxPrice !== undefined
    ) {
      filters.price = {}
      if (pagination.minPrice !== undefined) {
        filters.price.$gte = Number(pagination.minPrice)
      }
      if (pagination.maxPrice !== undefined) {
        filters.price.$lte = Number(pagination.maxPrice)
      }
    }

    if (pagination.category) {
      try {
        filters.categoryName = pagination.category
      } catch (error) {
        console.error('Error al convertir la categoría a ObjectId:', error)
      }
    }

    return mongoosePagination({
      ...pagination,
      Model: ProductModel,
      filter: filters,
      pipeline: [
        {
          $sort: { createdAt: -1 },
        },
        {
          $lookup: {
            from: MODELS_NAMES.PRODUCTS_IMAGES,
            as: 'imageData',
            localField: '_id',
            foreignField: 'productId',
            pipeline: [
              {
                $limit: 1,
              },
            ],
          },
        },
        {
          $unwind: {
            path: '$imageData',
            preserveNullAndEmptyArrays: true, // Para productos sin imágenes
          },
        },
        {
          $addFields: {
            image: '$imageData.url', // Agregar campo imagen sin eliminar otros
          },
        },
        {
          $unset: 'imageData', // Remover el objeto imageData temporal
        },
      ],
    })
  }

  static async getCatalogBySlug(slug: string) {
    const [result = null] = await ProductModel.aggregate([
      {
        $match: {
          slug: slug,
        },
      },
      {
        $lookup: {
          from: MODELS_NAMES.PRODUCTS_IMAGES,
          as: 'images',
          localField: '_id',
          foreignField: 'productId',
        },
      },
      {
        $limit: 1,
      },
    ])

    return result
  }
}
