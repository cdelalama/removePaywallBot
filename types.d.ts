export interface SessionData {
    url?: string;
  }
  
  export type MyContext = import('grammy').Context & import('grammy').SessionFlavor<SessionData>;
  