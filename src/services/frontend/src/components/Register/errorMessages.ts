import type { ERRORS_NAME, ERRORS_PASSWORD } from 'lib/schemas'

export const es_name: Partial<Record<ERRORS_NAME, string>> = {
  NOT_PROVIDED: 'Es necesario proporcionar el nombre',
  NOT_STRING: 'Este campo no puede dejarse vacío',
  SPECIAL_CHARACTER: 'No puedes poner caracteres especiales',
}

export const es_lastname: Partial<Record<ERRORS_NAME, string>> = {
  ...es_name,
  NOT_PROVIDED: 'Es necesario proporcionar tu apellido'
}

export const es_password: Record<ERRORS_PASSWORD, string> = {
  PASSWORD_NOT_PROVIDED: 'El campo de contraseña es necesario para continuar',
  PASSWORD_SHORT: 'La contraseña debe tener al menos 8 caracteres',
}

export const es_email: Record<string, string> = {
  EMAIL_NOT_PROVIDED: 'El email es necesario para continuar',
  INVALID_EMAIL: 'Ingresa un email válido',
  EMAIL_ALREADY_USED: 'Este mail ya fue utilizado antes',
}
