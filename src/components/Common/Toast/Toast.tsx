import toast from 'react-hot-toast'
import { DefaultToastOptions, Renderable, Toast, ValueOrFunction } from 'react-hot-toast'

export const addToast = (
  type: string,
  content: ValueOrFunction<Renderable, Toast>,
  duration?: number,
  dismissOthers?: boolean
) => {
  if (dismissOthers) toast.dismiss()
  if (type === 'success') {
    return toast.success(content, {
      duration: duration ?? 2000,
      style: {
        // border: "1px solid #53aff7",
        // color: "#53aff7",
        fontFamily: `Montserrat, sans-serif`,
        fontSize: '1.4rem',
        color: '#757576',
        background: '#F5F5F6',
        borderRadius: '20px'
      },
      iconTheme: {
        primary: '#53aff7',
        secondary: '#FFFAEE'
      }
    })
  }
  if (type === 'loading') {
    return toast.loading(content, {
      duration: undefined,
      style: {
        fontFamily: `Montserrat, sans-serif`,
        fontSize: '1.4rem',
        color: '#757576',
        background: '#F5F5F6',
        borderRadius: '20px'
      },
      iconTheme: {
        primary: '#53aff7',
        secondary: '#FFFAEE'
      }
    })
  } else if (type === 'error') {
    return toast.error(content, {
      duration: duration ?? 4000,
      style: {
        // border: "1px solid #bd2121",
        color: '#bd2121',
        fontFamily: `Montserrat, sans-serif`,
        fontSize: '1.4rem',
        background: '#F5F5F6',
        borderRadius: '20px'
      },
      iconTheme: {
        primary: '#bd2121',
        secondary: '#FFFAEE'
      }
    })
  }
}

export const promiseToast = (
  promise: Promise<unknown>,
  msgs: {
    loading: Renderable
    success: ValueOrFunction<Renderable, unknown>
    error: ValueOrFunction<Renderable, any>
  },
  opts?: DefaultToastOptions
) => {
  return toast.promise(promise, msgs, {
    style: {
      fontFamily: `Montserrat, sans-serif`,
      fontSize: '1.4rem',
      color: '#757576',
      background: '#F5F5F6',
      borderRadius: '20px'
    },
    ...opts
  })
}
