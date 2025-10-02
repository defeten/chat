/** unix ms */
type Timestamp = number;
/**
 * The permission category of the user.
 *
 * * `0`: user
 * * `1`: moderator
 * * `2`: admin
 */
export type Permission = 0 | 1 | 2;
export type Session = {
  id: string;
  /** sha256 hash of secret string  */
  secret: Uint8Array;
  /** the username of the user that owns this session */
  username: string;
  /** permission level of the user */
  permission: Permission;
  /** unix timestamp (s) since creation */
  since: number;
  /** unix timestamp (s) specifying expiry */
  until: number;
};

export type UserSockets = Bun.ServerWebSocket<Session>[];
export type ConnectionsMap = Map<string, UserSockets>;

export type SessionWithToken = Session & {
  token: string;
};

export type User = {
  name: string;
  permission: Permission;
};

export type BackendUser = User & {
  passwordHash: string;
};

export type VerifyResult =
  | {
      ok: false;
      error: string;
    }
  | { ok: true; session: Session };

export interface JOIN {
  id: string;
  name: string;
  permission: Permission;
  at: Timestamp;
}
export interface LEAVE {
  id: string;
  name: string;
  at: Timestamp;
}
export interface YOUARE {
  id: string;
  name: string;
  permission: Permission;
}
export interface USERS {
  id: string;
  users: User[];
  at: Timestamp;
}
export interface UMSG {
  id: string;
  name: string;
  permission: Permission;
  content: string;
  at: Timestamp;
}
export interface clientUMSG {
  content: string;
}
export interface HISTORY {
  id: string;
  messages: UMSG[];
  at: Timestamp;
}

export type Message =
  | { type: "JOIN"; data: JOIN }
  | { type: "LEAVE"; data: LEAVE }
  | { type: "YOUARE"; data: YOUARE }
  | { type: "USERS"; data: USERS }
  | { type: "UMSG"; data: UMSG }
  | { type: "UMSGC"; data: UMSG }
  | { type: "clientUMSG"; data: clientUMSG }
  | { type: "HISTORY"; data: HISTORY };
export type RenderableMessage =
  | Extract<
      Message,
      | { type: "JOIN" }
      | { type: "LEAVE" }
      | { type: "UMSG" }
      | { type: "UMSGC" }
      | { type: "HISTORY" }
    >
  | { type: "SEPARATOR"; data: { id: string; at: number } };

export type API_Check_Response = {
  exists: boolean;
};

export type AppView = "chat" | "users" | "settings";

export type ScrollBehavior = "instant" | "smooth";
export type MaxLinkLength = number;
export type LinkBehavior = "copy" | "newtab";
export type UnfocusInputAfterSend = boolean;
export type FooterOffset = boolean;
