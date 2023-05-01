declare namespace NodeJS {
  declare interface ProcessEnv {
    OPEN_AI_KEY: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
  }
}

declare type Category = 'SCHEDULE' | 'GEEKBLE' | 'MENU' | 'GAME';

declare interface Group {
  category: Category;
  words: string[];
  prompt: string;
}
