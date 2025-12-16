import { useState } from 'react'
import { useConnection, useConnectors } from 'wagmi'

function App() {
  const { address, isConnected, connector } = useConnection()
  const connectors = useConnectors()
  const [isPending, setIsPending] = useState(false)

  const walletConnector = connectors[0]

  const handleConnect = async () => {
    if (!walletConnector) return
    setIsPending(true)
    try {
      await walletConnector.connect()
    } catch (error) {
      console.error('Connection failed:', error)
    } finally {
      setIsPending(false)
    }
  }

  const handleDisconnect = async () => {
    if (!connector) return
    try {
      await connector.disconnect()
    } catch (error) {
      console.error('Disconnect failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-purple-400 to-pink-400 tracking-tight">
          Hello World
        </h1>
        <p className="mt-4 text-base sm:text-lg md:text-xl text-slate-400 font-light">
          使用 Vite + React + Tailwind CSS 构建
        </p>
        
        <div className="mt-8 flex justify-center">
          <div className="h-1 w-16 sm:w-24 bg-linear-to-r from-cyan-500 to-purple-500 rounded-full" />
        </div>

        <div className="mt-10">
          {isConnected ? (
            <div className="space-y-4">
              <div className="px-4 py-3 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
                <p className="text-sm text-slate-400 mb-1">已连接钱包</p>
                <p className="text-cyan-400 font-mono text-sm sm:text-base break-all">
                  {address}
                </p>
              </div>
              <button
                onClick={handleDisconnect}
                className="w-full sm:w-auto px-6 py-3 bg-linear-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 active:scale-95"
              >
                断开连接
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              disabled={isPending}
              className="w-full sm:w-auto px-8 py-4 bg-linear-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 active:scale-95 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  连接中...
                </span>
              ) : (
                '连接钱包'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
