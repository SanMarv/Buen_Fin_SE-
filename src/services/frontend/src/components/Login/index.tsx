import { EmailField } from './components/EmailInput'
import Form from './components/Form'
import { PasswordInput } from './components/PasswordInput'
import { SubmitBtn } from './components/SubmitBtn'
import { FormProvider } from './context'

export default function Register() {
  return (
    <div className="flex items-start justify-center bg-[#f6f1ed] px-4 py-6">
      <div className="h-auto min-h-0 w-full max-w-md self-start rounded-xl bg-white px-6 py-5 shadow-md">
        <p className="text-[10px] font-extrabold uppercase tracking-wide text-red-800">
         El Buen Fin 2026
        </p>
        <h1 className="mb-4 text-xl font-extrabold leading-tight text-neutral-900">
          Iniciar sesión
        </h1>
        <FormProvider>
          <Form>
            <EmailField autoComplete="username" />
            <PasswordInput />
            <div className="flex justify-center pt-2">
              <SubmitBtn />
            </div>
          </Form>
        </FormProvider>
      </div>
    </div>
  )
}