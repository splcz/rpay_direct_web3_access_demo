import { useState, useCallback } from 'react'
import { useConnection, useConnectors } from 'wagmi'

export function useWallet() {
  const { address, isConnected, connector } = useConnection()
  const connectors = useConnectors()
  const [isPending, setIsPending] = useState(false)

  const walletConnector = connectors[0]

  const connect = useCallback(async () => {
    if (!walletConnector) return
    setIsPending(true)
    try {
      await walletConnector.connect()
    } catch (err) {
      console.error('Connection failed:', err)
    } finally {
      setIsPending(false)
    }
  }, [walletConnector])

  const disconnect = useCallback(async () => {
    if (!connector) return
    try {
      await connector.disconnect()
    } catch (err) {
      console.error('Disconnect failed:', err)
    }
  }, [connector])

  return {
    address,
    isConnected,
    isPending,
    connect,
    disconnect,
  }
}

