import type {
  DBData,
  RequestData,
  SessionData,
} from "./interfaces/data.interfaces.ts";
import type {
  DBPayload,
  RequestPayload,
  SessionPayload,
} from "./interfaces/payloads.interfaces.ts";

export type DBActions = "CREATE" | "READ" | "UPDATE" | "DELETE";
export type RequestActions = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
export type SessionActions = "LOGIN" | "LOGOUT";
export type DataType = DBData | RequestData | SessionData;
export type PayloadType = DBPayload | RequestPayload | SessionPayload;
