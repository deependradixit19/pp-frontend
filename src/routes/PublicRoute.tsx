import { FC } from 'react'
import { Navigate } from 'react-router-dom'
import { getAccessToken } from '../services/storage/storage'

interface Props {
  path: string
  children: React.ReactElement
}

const PublicRoute: FC<Props> = ({ path, children }) => {
  const isAuthenticated = !!getAccessToken()

  return isAuthenticated ? (
    <Navigate to={{ pathname: '/' }} />
  ) : path === '/' ? (
    <Navigate to={{ pathname: '/auth' }} />
  ) : (
    children
  )
}

export default PublicRoute
