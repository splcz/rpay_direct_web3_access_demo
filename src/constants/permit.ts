// 主网 USDC 合约配置
export const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as const
export const USDC_DECIMALS = 6

// ERC-2612 Permit 类型定义
export const PERMIT_TYPES = {
  Permit: [
    { name: 'owner', type: 'address' },
    { name: 'spender', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' },
  ],
} as const

// EIP-712 Domain
export const USDC_DOMAIN = {
  name: 'USD Coin',
  version: '2',
  chainId: 1, // 主网
  verifyingContract: USDC_ADDRESS,
} as const

// nonces 函数 ABI
export const NONCES_ABI = [
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

// Permit 签名结果类型
export interface PermitResult {
  signature: string
  v: number
  r: string
  s: string
  owner: string
  spender: string
  value: string
  nonce: string
  deadline: string
}
