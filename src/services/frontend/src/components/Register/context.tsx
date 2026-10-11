import type { UserRegisterInput } from 'lib/schemas'
import type { FocusEvent, PropsWithChildren } from 'react'
import { userRegisterInput } from 'lib/schemas'
import { createContext, useContext, useState } from 'react'

interface Context {
  errors: Partial<Record<keyof UserRegisterInput, string>>
  handleBlur?: (
    key: keyof UserRegisterInput,
  ) => (value: FocusEvent<HTMLInputElement>) => void
  handleFocus?: (key: keyof UserRegisterInput) => () => void
  changeErrors?: (errors: Context['errors']) => void
  isUploading: boolean
  setUploading?: (val: boolean) => void
}

const defaultError: Context['errors'] = {}

const FormContext = createContext<Context>({
  errors: defaultError,
  isUploading: false,
})

export const useBlurFunction = (key: keyof UserRegisterInput) => {
  const onChange = useContext(FormContext)['handleBlur']
  if (!onChange) throw new Error('Input has no access to context')
  return onChange(key)
}

export const useFocusFunction = (key: keyof UserRegisterInput) => {
  const fn = useContext(FormContext)['handleFocus']
  if (!fn) throw new Error('Input has no access to context')
  return fn(key)
}

export const useErrorValue = (key: keyof UserRegisterInput) => {
  return useContext(FormContext)['errors'][key]
}

export const useIsUploading = (): [
  Context['isUploading'],
  NonNullable<Context['setUploading']>,
] => {
  const { isUploading, setUploading } = useContext(FormContext)
  if (typeof isUploading === 'undefined' || typeof setUploading === 'undefined')
    throw new Error("Value can't access context")
  return [isUploading, setUploading]
}
export const useChangeErrorFn = () => {
  const fn = useContext(FormContext).changeErrors
  if (!fn) throw new Error('Element with no access to context')
  return fn
}

export function FormProvider({ children }: PropsWithChildren) {
  const [errors, changeError] = useState(defaultError)
  const [isUploading, setUploading] = useState(false)
  const handleBlur: Context['handleBlur'] = (key) => {
    return (value) => {
      const { error } = userRegisterInput.shape[key].safeParse(
        value.target.value,
      )
      const errorMess = error?.issues[0].message
      changeError((prev) => ({ ...prev, [key]: errorMess }))
    }
  }
  const handleFocus: Context['handleFocus'] = (key) => {
    return () =>
      changeError((prev) => {
        const { [key]: _, ...rest } = prev
        return rest
      })
  }
  const changeErrors: Context['changeErrors'] = (err) =>
    changeError((p) => ({ ...p, ...err }))
  return (
    <FormContext.Provider
      value={{
        errors,
        handleBlur,
        changeErrors,
        handleFocus,
        isUploading,
        setUploading: (val) => setUploading(val),
      }}
    >
      {children}
    </FormContext.Provider>
  )
}
