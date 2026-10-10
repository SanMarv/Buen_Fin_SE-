import type { DBData, RequestData, SessionData } from "./data.interfaces.ts";

export interface BasePayload {
  start_time: string;
}

export type DBPayload = BasePayload & DBData;

export type RequestPayload = BasePayload & RequestData;

export type SessionPayload = BasePayload & SessionData;
