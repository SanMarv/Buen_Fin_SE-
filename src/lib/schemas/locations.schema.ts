import z  from "zod";

export const STATES = {
  estado: "Estado de México",
  cdmx: "México",
  monterrey: "Monterrey",
} as const;

export type State = (typeof STATES)[keyof typeof STATES]

export type LocationEntry = {
  state: State,
  city: string
}

export const LOCATIONS = [
  {
    state: STATES.cdmx,
    city: "Poniente",
  },
  {
    state: STATES.cdmx,
    city: "Del Valle",
  },
  {
    state: STATES.estado,
    city: "Lerma",
  },
  {
    state: STATES.estado,
    city: "Toluca",
  },
  {
    state: STATES.monterrey,
    city: "Monterrey",
  },
] as const satisfies LocationEntry[];

export const SUPORTED_STATES = Object.values(STATES)

export const CITIES = Object.groupBy(LOCATIONS, (s) => s.state)

const checkCity = (stateInp: State, city: string) => {
  const state = CITIES[stateInp]
  if(!state) return false
  return state.findIndex(v => v.city === city) >= 0
}

export const LOCATION_ERRORS = {
  STATE_MISMATCH: "MISMATCH",
  MAX_LENGTH: "MAX_LENGTH",
  NOT_PROVIDED: "NOT_PROVIDED",
  INVALID_STATE: "INVALID_STATE"
}
export const validateInputLocation = z.object({
  state: z.enum(STATES, LOCATION_ERRORS.INVALID_STATE),
  city: z.string(LOCATION_ERRORS.NOT_PROVIDED).min(1, LOCATION_ERRORS.NOT_PROVIDED).max(40, LOCATION_ERRORS.MAX_LENGTH)
}, LOCATION_ERRORS.NOT_PROVIDED).refine(v => checkCity(v.state, v.city), LOCATION_ERRORS.STATE_MISMATCH)
