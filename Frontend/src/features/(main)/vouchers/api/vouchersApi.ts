import { api } from "@/shared/lib/axios"

export type VoucherType = "PERCENTAGE" | "FIXED_AMOUNT"

export interface Voucher {
  id: number
  name: string
  code: string
  description: string
  type: VoucherType
  value: number
  maxDiscount?: number | null
  minPurchase?: number | null
  usageLimit?: number | null
  expiry: string
  isActive: boolean
  storeId: number
  createdAt: string
  updatedAt: string
  _count?: {
    usages: number
  }
}

export interface CreateVoucherDto {
  name: string
  code: string
  description: string
  type: VoucherType
  value: number
  maxDiscount?: number
  minPurchase?: number
  usageLimit?: number
  expiry: string
  storeId: number
}

export const getVouchers = async (storeId?: number): Promise<Voucher[]> => {
  const params = storeId ? { storeId: storeId.toString() } : {}
  const response = await api.get<Voucher[]>("/vouchers", { params })
  return response.data
}

export const getSellerVouchers = async (): Promise<Voucher[]> => {
  const response = await api.get<Voucher[]>("/vouchers/seller/all")
  return response.data
}

export const createVoucher = async (data: CreateVoucherDto): Promise<Voucher> => {
  const response = await api.post<Voucher>("/vouchers", data)
  return response.data
}

export const updateVoucher = async (id: number, data: Partial<CreateVoucherDto>): Promise<Voucher> => {
  const response = await api.patch<Voucher>(`/vouchers/${id}`, data)
  return response.data
}

export const deleteVoucher = async (id: number): Promise<void> => {
  await api.delete(`/vouchers/${id}`)
}
