import type { DBActions, RequestActions, SessionActions } from "../types.ts";

export interface Data {
  action: string;
}

export interface DBData {
  action: DBActions;
  table: string;
}

export interface RequestData {
  action: RequestActions;
  status: number;
}

export interface SessionData {
  action: SessionActions;
}
