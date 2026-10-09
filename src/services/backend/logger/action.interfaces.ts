interface BasePayload {
  start_time: string;
  end_time: string;
  id: string;
  action: string;
}

export interface DBPayload extends BasePayload {
  action: "CREATE" | "READ" | "UPDATE" | "DELETE";
  table: string;
}

export interface RequestPayload extends BasePayload {
  action: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  status: string;
}

export interface SessionPayload extends BasePayload {
  action: "LOGIN" | "LOGOUT";
}
