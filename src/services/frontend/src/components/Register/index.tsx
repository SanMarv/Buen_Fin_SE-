import { EmailField } from './components/EmailInput'
import Form from './components/Form'
import { InputWithError as Input } from './components/Input'
import { PasswordInput } from './components/PasswordInput'
import { SubmitBtn } from './components/SubmitBtn'
import { FormProvider } from './context'

export default function Register() {
  return (
    <FormProvider>
      <Form>
        <EmailField autoComplete="username" />
        <div className="flex justify-between gap-x-4 px-2 py-4">
          <Input name="name" placeholder="Nombre" autoComplete="given-name" />
          <Input
            name="lastname"
            placeholder="Apellido"
            autoComplete="family-name"
          />
        </div>
        <PasswordInput />
        <div className="flex px-2 justify-center">
          <SubmitBtn />
        </div>
      </Form>
    </FormProvider>
  )
}
