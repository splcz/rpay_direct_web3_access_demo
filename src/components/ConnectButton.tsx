import { Spinner } from './Spinner'

interface ConnectButtonProps {
  isPending: boolean
  onClick: () => void
}

export function ConnectButton({ isPending, onClick }: ConnectButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isPending}
      className="w-full px-8 py-4 bg-linear-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 active:scale-95 disabled:cursor-not-allowed"
    >
      {isPending ? (
        <span className="flex items-center justify-center gap-2">
          <Spinner />
          连接中...
        </span>
      ) : (
        '连接钱包'
      )}
    </button>
  )
}

