import { FC } from 'react'
import './_fcc.scss'
import BasicLayout from '../../layouts/basicLayout/BasicLayout'
import WithHeaderSection from '../../layouts/WithHeaderSection/WithHeaderSection'

const Fcc: FC = () => {
  return (
    <BasicLayout title='For Custom Components'>
      <WithHeaderSection headerSection={<>Header</>}>
        <div>FCC</div>
      </WithHeaderSection>
    </BasicLayout>
  )
}

export default Fcc
