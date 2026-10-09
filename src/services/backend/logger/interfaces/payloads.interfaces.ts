import type { DBData, RequestData, SessionData } from "./data.interfaces.ts";

interface BasePayload {
  start_time: string;
  end_time: string;
  id: string;
}

export type DBPayload = BasePayload & DBData;

export type RequestPayload = BasePayload & RequestData;

export type SessionPayload = BasePayload & SessionData;
