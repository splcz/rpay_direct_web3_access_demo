import { apiClient } from './client'
import { type TokenType } from '@/constants/enums'

// ============ URL ============
export const WEB3PAY_API = {
  getConfig: '/api/v2/user/web3pay/getConfig',
  permit: '/api/v2/user/web3pay/permit',
  getPermit: '/api/v2/user/web3pay/getPermit',
  payOrder: '/api/v1/pay/web3pay/payOrder'
} as const



// ============ Types ============
export interface GetConfigParams {
  coin: TokenType | string
}

export interface GetConfigResponse {
  proxyAddress: string
  [key: string]: unknown
}

export interface PermitParams {
  uid?: number
  coin?: string
  wallet?: string
  owner?: string
  spender?: string
  value?: string
  deadline?: string
  v?: string
  r?: string
  s?: string
}

export interface PermitResponse {
  sn: string,
  [key: string]: unknown
}

export interface GetPermitParams {
  sn?: string
}

export const PERMIT_STATUS = {
  NEW: 0,
  SIGNING: 1,
  SUCCESS: 2,
  FAILED: 3,
  CANCELLED: 4,
  EXPIRED: 5,
} as const

export type PermitStatusType = typeof PERMIT_STATUS[keyof typeof PERMIT_STATUS]
export interface GetPermitResponse {
  status: PermitStatusType
  [key: string]: unknown
}

export interface PayOrderParams {
  uid?: number
  varietyCode: string
  payOrderSn: string
  businessType?: number
  businessSn?: string
  tid?: string
  amount: string
}

export interface PayOrderResponse {
  [key: string]: unknown
}

// ============ Request ============
export const getWeb3PayConfig = (params: GetConfigParams): Promise<GetConfigResponse> => {
  return apiClient.post(WEB3PAY_API.getConfig, params)
}

export const submitPermit = (params: PermitParams): Promise<PermitResponse> => {
  return apiClient.post(WEB3PAY_API.permit, params)
}

export const getPermit = (params: GetPermitParams): Promise<GetPermitResponse> => {
  return apiClient.post(WEB3PAY_API.getPermit, params)
}

export const payOrder = (params: PayOrderParams): Promise<PayOrderResponse> => {
  return apiClient.post(WEB3PAY_API.payOrder, params)
}