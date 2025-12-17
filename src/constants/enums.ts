// ============ Token ============
export const TOKEN = {
  USDC_ERC20: 'usdc_erc20',
} as const

export type TokenType = typeof TOKEN[keyof typeof TOKEN]

