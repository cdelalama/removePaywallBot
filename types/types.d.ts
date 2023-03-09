export interface SessionData {
    url?: string;
  }
  
  export type MyContext = import('grammy').Context & import('grammy').SessionFlavor<SessionData>;
  export interface RpwUser {
    objectId?: string;
    telegramId: string;
    telegramUsername: string;
    number_calls: number;
    isAdmin: boolean;
  }