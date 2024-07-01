/// <reference types="vite/client" />

interface Box {
  topRow: number;
  rightCol: number;
  bottomRow: number;
  leftCol: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  entries: number;
  joined: string;
}
