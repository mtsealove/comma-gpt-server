declare namespace NodeJS {
  declare interface ProcessEnv {
    OPEN_AI_KEY: string;
  }
}

declare type Category = 'SCHEDULE' | 'GEEKBLE' | 'MENU' | 'GAME';

declare interface Group {
  category: Category;
  words: string[];
  prompt: string;
}
