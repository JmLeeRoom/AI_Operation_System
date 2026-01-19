/**
 * 환경 설정
 */

interface EnvConfig {
  apiUrl: string
  logLevel: 'debug' | 'info' | 'warn' | 'error'
  enableDebugMode: boolean
}

function getEnvConfig(): EnvConfig {
  const apiUrl = import.meta.env.VITE_API_URL || '/api'
  
  return {
    apiUrl: apiUrl,
    logLevel: (import.meta.env.VITE_LOG_LEVEL as any) || 'info',
    enableDebugMode: import.meta.env.DEV || import.meta.env.VITE_DEBUG === 'true',
  }
}

export const config = getEnvConfig()
