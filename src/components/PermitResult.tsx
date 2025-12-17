import type { PermitResult } from '@/constants/permit'

interface PermitResultProps {
  result: PermitResult
}

export function PermitResultCard({ result }: PermitResultProps) {
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

