import type {
  HISTORY,
  JOIN,
  LEAVE,
  UMSG,
  USERS,
  YOUARE,
  clientUMSG,
} from "@/types";

export abstract class Event {
  type;
  data;

  constructor(type: string, data: any) {
    this.type = type;
    this.data = data;
  }

  json() {
    return JSON.stringify({ type: this.type, data: this.data });
  }
}

export class UserJoinEvent extends Event {
  constructor(data: JOIN) {
    super("JOIN", data);
  }
}

export class UserLeaveEvent extends Event {
  constructor(data: LEAVE) {
    super("LEAVE", data);
  }
}

export class IdentityEvent extends Event {
  constructor(data: YOUARE) {
    super("YOUARE", data);
  }
}

export class UsersEvent extends Event {
  constructor(data: USERS) {
    super("USERS", data);
  }
}

export class UserMessageEvent extends Event {
  constructor(data: UMSG) {
    super("UMSG", data);
  }
}

export class clientUserMessageEvent extends Event {
  constructor(data: clientUMSG) {
    super("clientUMSG", data);
  }
}

export class HistoryEvent extends Event {
  constructor(data: HISTORY) {
    super("HISTORY", data);
  }
}
