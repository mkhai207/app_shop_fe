import { NextPage } from 'next'
import LayoutNotApp from 'src/views/layouts/LayoutNotApp'
import MyProfilePage from 'src/views/pages/my-profile'

type TProps = {}

const MyProfile: NextPage<TProps> = () => {
  return <MyProfilePage />
}

export default MyProfile

MyProfile.getLayout = (page: React.ReactNode) => <LayoutNotApp>{page}</LayoutNotApp>
