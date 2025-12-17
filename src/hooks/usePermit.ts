import { useState, useCallback } from 'react'
import { useConnection, usePublicClient, useWalletClient } from 'wagmi'
import { useMutation, useQuery } from '@tanstack/react-query'
import { parseUnits, type Address } from 'viem'
import {
  USDC_ADDRESS,
  USDC_DECIMALS,
  USDC_DOMAIN,
  PERMIT_TYPES,
  NONCES_ABI,
  type PermitResult,
} from '../constants/permit'
import { submitPermit, getPermit, WEB3PAY_API } from '@/api/web3pay'
import { PERMIT_STATUS } from '@/api/web3pay'

export interface PermitParams {
  /** 授权金额（USDC 数量，如 "10"） */
  amount: string
  /** 有效期（秒） */
  duration: number
  /** 被授权地址 */
  spender: Address
  /** 币种 */
  coin: string
}

export function usePermit() {
  const { address } = useConnection()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const [isSigning, setIsSigning] = useState(false)
  const [result, setResult] = useState<PermitResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [sn, setSn] = useState<string | null>(null)

  // 使用 useMutation 处理 submitPermit
  const {
    mutateAsync: submitPermitMutation,
    isPending: isSubmitPermit,
    error: submitError,
  } = useMutation({
    mutationFn: submitPermit,
    onSuccess: (data) => {
      console.log('submitPermit 响应:', data)
      setSn(data.sn)
    },
    onError: (err) => {
      console.error('submitPermit 失败:', err)
    },
  })

  // 轮询 getPermit 获取结果
  const {
    data: permitResultData,
    isLoading: isPolling,
    error: pollingError,
  } = useQuery({
    queryKey: [WEB3PAY_API.getPermit, sn],
    queryFn: () => getPermit({ sn: sn! }),
    enabled: !!sn,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (status === PERMIT_STATUS.NEW || status === PERMIT_STATUS.SIGNING) {
        return 2000
      }
      return false
    },
    refetchIntervalInBackground: false,
  })

  const signPermit = useCallback(async (params: PermitParams) => {
    const { amount, duration, spender, coin } = params

    if (!address || !publicClient || !walletClient) {
      setError('请先连接钱包')
      return
    }

    setIsSigning(true)
    setError(null)
    setResult(null)
    setSn(null)

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
      setIsSigning(false)

      console.log('Permit 签名结果:', {
        ...permitResult,
        deadlineDate: new Date(Number(deadline) * 1000).toLocaleString(),
      })

      // 7. 提交 permit 到服务器，返回 sn 后自动开始轮询
      await submitPermitMutation({
        coin,
        owner: address,
        spender,
        value: value.toString(),
        deadline: deadline.toString(),
        v: v.toString(),
        r,
        s,
      })

    } catch (err) {
      console.error('Permit 签名失败:', err)
      setError(err instanceof Error ? err.message : '签名失败')
      setIsSigning(false)
    }
  }, [address, publicClient, walletClient, submitPermitMutation])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
    setSn(null)
  }, [])

  const combinedError = error 
    || (submitError instanceof Error ? submitError.message : null)
    || (pollingError instanceof Error ? pollingError.message : null)

  const isSubmitting = isSubmitPermit || isPolling
  const isSuccess = permitResultData?.status === PERMIT_STATUS.SUCCESS

  return {
    isSigning,
    isSubmitting,
    isSuccess,
    result,
    permitResultData,
    error: combinedError,
    signPermit,
    reset,
  }
}
