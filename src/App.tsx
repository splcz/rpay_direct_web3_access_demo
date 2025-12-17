import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useWallet } from '@/hooks/useWallet'
import { usePermit } from '@/hooks/usePermit'
import { getWeb3PayConfig, WEB3PAY_API } from '@/api/web3pay'
import { TOKEN } from '@/constants/enums'
import { ConnectButton } from '@/components/ConnectButton'
import { PermitResultCard } from '@/components/PermitResult'
import { Spinner } from '@/components/Spinner'
import { type Address } from 'viem'

// ============ Permit 配置 ============
const PERMIT_AMOUNT = '1'           // 授权金额（USDC）
const PERMIT_DURATION = 3600         // 有效期（秒），3600 = 1小时
// ====================================

function App() {
  const { address, isConnected, isPending, connect, disconnect } = useWallet()
  const { isSigning, isSubmitting, result, error, signPermit, reset, isSuccess } = usePermit()
  
  // 使用 react-query 获取配置（仅在钱包连接时启用）
  const { data: configData, isLoading: configLoading } = useQuery({
    queryKey: [WEB3PAY_API.getConfig, TOKEN.USDC_ERC20],
    queryFn: () => getWeb3PayConfig({ coin: TOKEN.USDC_ERC20 }),
    enabled: isConnected,
  })

  // 打印配置响应
  useEffect(() => {
    if (configData) {
      console.log('getConfig 响应:', configData)
    }
  }, [configData])

  const handleDisconnect = () => {
    reset()
    disconnect()
  }

  const handleSignPermit = () => {
    if (!configData?.proxyAddress) return
    signPermit({
      amount: PERMIT_AMOUNT,
      duration: PERMIT_DURATION,
      spender: configData.proxyAddress as Address,
      coin: TOKEN.USDC_ERC20,
    })
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* 标题 */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-400">
            ERC-2612 Permit
          </h1>
        </div>

        {isConnected ? (
          <div className="space-y-4">
            {/* 钱包地址 */}
            <div className="px-4 py-3 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
              <p className="text-sm text-slate-400 mb-1">已连接钱包</p>
              <p className="text-cyan-400 font-mono text-sm break-all">{address}</p>
            </div>

            {/* 配置加载中 */}
            {configLoading && (
              <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                <Spinner className="h-4 w-4" />
                正在获取配置...
              </div>
            )}

            {/* 授权按钮 */}
            <button
              onClick={handleSignPermit}
              disabled={isSigning || !configData?.proxyAddress}
              className="w-full px-6 py-4 bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 active:scale-95 disabled:cursor-not-allowed"
            >
              {isSigning ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner />
                  请在钱包中确认签名...
                </span>
              ) : isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner />
                  提交中...
                </span>
              ) : (
                '授权（签署 Permit）'
              )}
            </button>

            {/* 签名结果 */}
            {isSuccess && result && <PermitResultCard result={result} />}

            {/* 错误提示 */}
            {error && (
              <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* 断开连接 */}
            <button
              onClick={handleDisconnect}
              className="w-full px-4 py-2 text-slate-400 hover:text-white text-sm transition-colors"
            >
              断开连接
            </button>
          </div>
        ) : (
          <ConnectButton isPending={isPending} onClick={connect} />
        )}
      </div>
    </div>
  )
}

export default App
