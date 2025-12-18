'use client'
import { createContext, useContext } from 'react'
import { App } from '@/types'

interface WebConfigContextType {
    webConfig?: App.WebConfig
}
    
// use WebConfigContext to get webConfig from MainLayout
export const WebConfigContext = createContext<WebConfigContextType>({} as WebConfigContextType)
  
export const useWebConfigContext = () => useContext(WebConfigContext)
