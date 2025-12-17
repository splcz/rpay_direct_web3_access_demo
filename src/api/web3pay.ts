import { apiClient } from './client'
import { type TokenType } from '@/constants/enums'

// ============ URL ============
export const WEB3PAY_API = {
  getConfig: '/api/v2/user/web3pay/getConfig',
} as const

// ============ Types ============
export interface GetConfigParams {
  coin: TokenType | string
}

export interface GetConfigResponse {
  [key: string]: unknown
}

// ============ Request ============
export const getWeb3PayConfig = (params: GetConfigParams): Promise<GetConfigResponse> => {
  return apiClient.post(WEB3PAY_API.getConfig, params)
}

