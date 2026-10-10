import type {
  BasePayload,
  DBPayload,
  RequestPayload,
  SessionPayload,
} from "../interfaces/payloads.interfaces.js";
import type { PayloadType } from "../types.ts";
import {
  DBLogger,
  RequestLogger,
  SessionLogger,
  type Logger,
} from "./Loggers.ts";

interface BaseLoggerFactory {
  payload: BasePayload;
  create(): Logger;
}

class DBLoggerFactory implements BaseLoggerFactory {
  payload: DBPayload;
  constructor(data: DBPayload) {
    this.payload = data;
  }

  create(): DBLogger {
    return new DBLogger(this.payload);
  }
}

class RequestLoggerFactory implements BaseLoggerFactory {
  payload: RequestPayload;
  constructor(data: RequestPayload) {
    this.payload = data;
  }

  create(): RequestLogger {
    return new RequestLogger(this.payload);
  }
}

class SessionLoggerFactory implements BaseLoggerFactory {
  payload: SessionPayload;
  constructor(data: SessionPayload) {
    this.payload = data;
  }

  create(): SessionLogger {
    return new SessionLogger(this.payload);
  }
}

const LoggerFactories = {
  DB: (data: DBPayload) => new DBLoggerFactory(data),
  Request: (data: RequestPayload) => new RequestLoggerFactory(data),
  Session: (data: SessionPayload) => new SessionLoggerFactory(data),
};

type LoggerHandler = (data: PayloadType) => BaseLoggerFactory;

export function LoggerMaker(data: PayloadType): BaseLoggerFactory {
  const payload = LoggerFactories[data.type] as LoggerHandler;
  return payload(data);
}
