import type { ERRORS_NAME, ERRORS_PASSWORD } from 'lib/schemas'

export const es_name: Record<ERRORS_NAME, string> = {
  NOT_PROVIDED: 'Es necesario proporcionar el nombre',
  NOT_STRING: 'Este campo no puede dejarse vacío',
  SPECIAL_CHARACTER: 'No puedes poner caracteres especiales',
  TOO_LARGE: 'El nombre proporcionado es muy grande',
}

export const es_lastname: Record<ERRORS_NAME, string> = {
  ...es_name,
  NOT_PROVIDED: 'Es necesario proporcionar tu apellido',
  TOO_LARGE: 'El appellido proporcionado es muy grande',
}

export const es_password: Record<ERRORS_PASSWORD, string> = {
  PASSWORD_NOT_PROVIDED: 'El campo de contraseña es necesario para continuar',
  PASSWORD_SHORT: 'La contraseña es muy corta',
}

export const es_email = 'Error en el email'
