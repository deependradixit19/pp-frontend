import React, { createContext, FC, useContext, useState } from 'react'
import Loader from '../components/Common/Loader/Loader'
import './_loading.scss'

const defaultValues = {
  globalLoading: true,
  handleGlobalLoading: (value: boolean) => {}
}

export const LoadingContext = createContext<typeof defaultValues>(defaultValues)

export const LoadingProvider: FC<{ children: React.ReactElement }> = ({ children }) => {
  const [globalLoading, setGlobalLoading] = useState(true)
  const handleGlobalLoading = (value: boolean) => {
    setGlobalLoading(value)
  }
  return (
    <LoadingContext.Provider
      value={{
        globalLoading,
        handleGlobalLoading
      }}
    >
      {globalLoading && (
        <div className='globalLoader'>
          <Loader />
        </div>
      )}

      {children}
    </LoadingContext.Provider>
  )
}

export const useLoadingContext = () => useContext(LoadingContext)
