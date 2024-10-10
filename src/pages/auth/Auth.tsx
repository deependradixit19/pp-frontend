import { FC } from 'react'
import './_auth.scss'
import { useParams } from 'react-router-dom'

import Register from './view/Register'
import Login from './view/Login'
import RecoverAccount from './view/RecoverAccount'
import NotLogged from './view/NotLogged'
import Verify from './view/Verify'
import ResetPassword from './view/ResetPassword'
import TwitterLogin from './view/TwitterLogin'

/* ---------------------------------------------
type - login/register/recover
id - fan/model

1st - select register/login
2nd - select fan/model

- if both are selected, render component based on type (<Login />, <Register />...)
- if some is missing return <Select /> which lets you choose between fan and performer, and will add
is_model: 1/0 depending of id selected
----------------------------------------------*/

const Auth: FC = () => {
  const { id, type } = useParams<{ id: string; type: string }>()

  console.log({ id })
  console.log({ type })

  const renderComponent = () => {
    switch (type) {
      case 'login':
        return <Login />
      case 'signup':
        return <Register />
      case 'recover':
        return <RecoverAccount id={id} />
      case 'reset-password-email':
        return <RecoverAccount title='Reset password' />
      case 'verify':
        return <Verify />
      case 'reset-password':
        return <ResetPassword />
      default:
        return <NotLogged />
    }
  }

  return renderComponent()

  // if (type === 'verify') {
  //   return <Verify />;
  // }
  //  else if (!id && ["login", "signup", "recover"].includes(type)) {

  //   return <Select type={type} />;
  // }
  // else if (id) {
  //   return <>{renderComponent()}</>;
  // } else {
  //   return <NotLogged />;
  // }
}

export default Auth
