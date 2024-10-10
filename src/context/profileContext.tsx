import { FC, createContext, useState, useContext } from 'react'

interface IProfileContext {
  profileMarker: IProfileMarker
  setProfileMarker?: (value: IProfileMarker) => void
}
interface IProfileMarker {
  profileId: number | null
  fromAuth: boolean
}

const defaultValues: IProfileContext = {
  profileMarker: { profileId: null, fromAuth: false }
  // setProfileMarkerId: (id) => {},
  // setProfileMarkerFromAuth: (fromAuth) => {},
}

export const ProfileMarkerContext = createContext<IProfileContext>(defaultValues)

export const ProfileMarkerProvider: FC<{ children?: JSX.Element }> = ({ children }) => {
  const [profileMarker, setProfileMarker] = useState<IProfileMarker>({
    profileId: null,
    fromAuth: false
  })

  return (
    <ProfileMarkerContext.Provider
      value={{
        profileMarker,
        setProfileMarker
      }}
    >
      {children}
    </ProfileMarkerContext.Provider>
  )
}

export const useProfileContext = () => useContext(ProfileMarkerContext)
