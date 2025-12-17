import { useMutation } from '@tanstack/react-query'
import type { PermitResult } from '@/constants/permit'
import { payOrder } from '@/api/web3pay'
import { TOKEN } from '@/constants/enums'
import { Spinner } from './Spinner'

interface PermitResultProps {
  result: PermitResult
}

export function PermitResultCard({ result }: PermitResultProps) {
  const {
    mutate: handlePayOrder,
    isPending: isPaying,
    isSuccess: paySuccess,
    error: payError,
  } = useMutation({
    mutationFn: payOrder,
    onSuccess: (data) => {
      console.log('payOrder 响应:', data)
    },
    onError: (err) => {
      console.error('payOrder 失败:', err)
    },
  })

  const handlePay = () => {
    handlePayOrder({
      payOrderSn: '123456',
      varietyCode: TOKEN.USDC_ERC20,
      amount: '0.01',
    })
  }

  return (
    <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-4 space-y-3">
      <h3 className="text-emerald-400 font-semibold flex items-center gap-2">
        ✅ Permit 签名成功
      </h3>
      <div className="space-y-2 text-sm">
        <ResultRow label="Owner" value={result.owner} mono breakAll />
        <ResultRow label="Spender" value={result.spender} mono breakAll />
        <ResultRow label="Value" value={`${result.value} (10 USDC)`} mono />
        <ResultRow label="Nonce" value={result.nonce} mono />
        <div>
          <span className="text-slate-400">Deadline:</span>
          <p className="text-white font-mono">
            {result.deadline}
            <span className="text-slate-500 ml-2">
              ({new Date(Number(result.deadline) * 1000).toLocaleString()})
            </span>
          </p>
        </div>

        <div className="pt-2 border-t border-slate-700">
          <span className="text-slate-400">Signature:</span>
          <p className="text-cyan-400 font-mono text-xs break-all">{result.signature}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2">
          <div>
            <span className="text-slate-400 text-xs">v:</span>
            <p className="text-white font-mono text-xs">{result.v}</p>
          </div>
          <div>
            <span className="text-slate-400 text-xs">r:</span>
            <p className="text-white font-mono text-xs truncate">{result.r}</p>
          </div>
          <div>
            <span className="text-slate-400 text-xs">s:</span>
            <p className="text-white font-mono text-xs truncate">{result.s}</p>
          </div>
        </div>
      </div>

      {/* 模拟支付按钮 */}
      <div className="pt-3 border-t border-slate-700">
        <button
          onClick={handlePay}
          disabled={isPaying || paySuccess}
          className="w-full px-4 py-3 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 active:scale-95 disabled:cursor-not-allowed"
        >
          {isPaying ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner className="h-4 w-4" />
              支付中...
            </span>
          ) : paySuccess ? (
            '✅ 支付成功'
          ) : (
            '支付 0.01 USDC'
          )}
        </button>
        {payError && (
          <p className="text-red-400 text-xs mt-2">
            支付失败: {payError instanceof Error ? payError.message : '未知错误'}
          </p>
        )}
      </div>
    </div>
  )
}

interface ResultRowProps {
  label: string
  value: string
  mono?: boolean
  breakAll?: boolean
}

function ResultRow({ label, value, mono, breakAll }: ResultRowProps) {
  return (
    <div>
      <span className="text-slate-400">{label}:</span>
      <p className={`text-white ${mono ? 'font-mono text-xs' : ''} ${breakAll ? 'break-all' : ''}`}>
        {value}
      </p>
    </div>
  )
}
