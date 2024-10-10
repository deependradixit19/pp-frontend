import { FC } from 'react'
import { Navigate } from 'react-router-dom'

import { useUserContext } from '../context/userContext'
import { getAccessToken } from '../services/storage/storage'

interface Props {
  children: React.ReactElement
  roles: string[]
  // userData: IProfile | undefined;
  // loading: boolean;
}

const ProtectedRoute: FC<Props> = ({
  roles,
  children
  // userData: tmp,
  // loading,
}) => {
  const isAuthenticated = !!getAccessToken()
  const userData = useUserContext()

  // if (loading) {
  //   return null;
  // }

  if (!isAuthenticated || !userData) {
    if (window.location.href.includes('/trial-link/') && window.location.href.split('/trial-link/')[1]) {
      const token = window.location.href.split('/trial-link/')[1]
      sessionStorage.setItem('tt', token)
    }
    return <Navigate to={{ pathname: '/auth' }} />
  }

  if (userData.userLoading) {
    return null
  }

  return isAuthenticated ? (
    roles.includes(userData.role.toLowerCase()) ? (
      children
    ) : (
      <Navigate to={{ pathname: '/' }} />
    )
  ) : (
    <Navigate to={{ pathname: '/auth' }} />
  )
}

export default ProtectedRoute
