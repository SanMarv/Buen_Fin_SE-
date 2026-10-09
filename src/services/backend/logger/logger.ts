import type {
  DBPayload,
  RequestPayload,
  SessionPayload,
} from "./action.interfaces.js";

export interface Logger {
  logMessage(): string;
}

export class DBLogger implements Logger {
  private data: DBPayload;
  constructor(payload: DBPayload) {
    this.data = payload;
  }

  logMessage(): string {
    const { id, start_time, end_time, action, table } = this.data;
    return `${start_time}-${end_time} user: ${id} Performed a/an ${action} in ${table}`;
  }
}

export class SessionLogger implements Logger {
  private data: SessionPayload;
  constructor(payload: SessionPayload) {
    this.data = payload;
  }

  logMessage(): string {
    const { id, start_time, end_time, action } = this.data;
    return `${start_time}-${end_time} user: ${id} Has made ${action} in his account`;
  }
}

export class RequestLogger implements Logger {
  private data: RequestPayload;
  constructor(payload: RequestPayload) {
    this.data = payload;
  }

  logMessage(): string {
    const { id, start_time, end_time, action, status } = this.data;
    return `${start_time}-${end_time} user: ${id} Has made a ${action} request with status ${status}`;
  }
}
