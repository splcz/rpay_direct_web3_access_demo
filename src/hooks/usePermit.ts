import { useState, useCallback } from 'react'
import { useConnection, usePublicClient, useWalletClient } from 'wagmi'
import { parseUnits, type Address } from 'viem'
import {
  USDC_ADDRESS,
  USDC_DECIMALS,
  USDC_DOMAIN,
  PERMIT_TYPES,
  NONCES_ABI,
  type PermitResult,
} from '../constants/permit'

export interface PermitParams {
  /** 授权金额（USDC 数量，如 "10"） */
  amount: string
  /** 有效期（秒） */
  duration: number
  /** 被授权地址 */
  spender: Address
}

export function usePermit() {
  const { address } = useConnection()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const [isSigning, setIsSigning] = useState(false)
  const [result, setResult] = useState<PermitResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const signPermit = useCallback(async (params: PermitParams) => {
    const { amount, duration, spender } = params

    if (!address || !publicClient || !walletClient) {
      setError('请先连接钱包')
      return
    }

    setIsSigning(true)
    setError(null)
    setResult(null)

    try {
      // 1. 获取 USDC nonce
      const nonce = await publicClient.readContract({
        address: USDC_ADDRESS,
        abi: NONCES_ABI,
        functionName: 'nonces',
        args: [address],
      })

      // 2. 解析金额和计算过期时间
      const value = parseUnits(amount, USDC_DECIMALS)
      const deadline = BigInt(Math.floor(Date.now() / 1000) + duration)

      // 3. 构建签名消息
      const message = {
        owner: address,
        spender,
        value,
        nonce,
        deadline,
      }

      // 4. 请求钱包签名
      const signature = await walletClient.signTypedData({
        domain: USDC_DOMAIN,
        types: PERMIT_TYPES,
        primaryType: 'Permit',
        message,
      })

      // 5. 解析签名 (v, r, s)
      const r = `0x${signature.slice(2, 66)}`
      const s = `0x${signature.slice(66, 130)}`
      const v = parseInt(signature.slice(130, 132), 16)

      // 6. 保存结果
      const permitResult: PermitResult = {
        signature,
        v,
        r,
        s,
        owner: address,
        spender,
        value: value.toString(),
        nonce: nonce.toString(),
        deadline: deadline.toString(),
      }

      setResult(permitResult)

      console.log('Permit 签名结果:', {
        ...permitResult,
        deadlineDate: new Date(Number(deadline) * 1000).toLocaleString(),
      })

    } catch (err) {
      console.error('Permit 签名失败:', err)
      setError(err instanceof Error ? err.message : '签名失败')
    } finally {
      setIsSigning(false)
    }
  }, [address, publicClient, walletClient])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  return {
    isSigning,
    result,
    error,
    signPermit,
    reset,
  }
}
