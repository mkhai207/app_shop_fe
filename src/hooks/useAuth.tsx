import { useContext, useCallback } from 'react'
import { AuthContext } from 'src/contexts/AuthContext'
import { getUsers } from 'src/services/auth'
import { TGetUsersResponse } from 'src/types/auth'

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  const fetchUsers = useCallback(async (): Promise<TGetUsersResponse> => {
    return await getUsers()
  }, [])

  return {
    ...context,
    fetchUsers
  }
}
