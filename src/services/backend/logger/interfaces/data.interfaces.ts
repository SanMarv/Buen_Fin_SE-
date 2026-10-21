import type { DBActions, RequestActions, SessionActions } from "../types.ts";

export interface Data {
  type: string;
  action: string;
  id: string;
}

export interface DBData extends Data {
  type: "DB";
  action: DBActions;
  table: string;
}

export interface RequestData extends Data {
  type: "Request";
  action: RequestActions;
  status: number;
  endpoint: string;
}

export interface SessionData extends Data {
  type: "Session";
  action: SessionActions;
}
