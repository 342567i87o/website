
export type AppView = 'home' | 'dashboard' | 'make' | 'forging' | 'editor' | 'settings' | 'auth';

export enum Genre {
  Action = 'Action',
  Adventure = 'Adventure',
  Puzzle = 'Puzzle',
  RPG = 'RPG',
  Platformer = 'Platformer',
  Shooter = 'Shooter',
  Racing = 'Racing',
  Simulation = 'Simulation',
  Strategy = 'Strategy',
  Horror = 'Horror'
}

export type AssetType = '3D Model' | 'Script' | 'Sound' | 'Map' | 'Animation' | 'Texture' | 'Scene';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface GameAsset {
  id: string;
  name: string;
  type: AssetType;
  path: string;
  size?: string;
}

export interface GameScript {
  filename: string;
  content: string;
  type: 'script' | 'scene';
}

export interface SceneNode {
  id: string;
  name: string;
  type: string;
  icon: string;
  children?: SceneNode[];
  isOpen?: boolean;
}

export interface Attachment {
  name: string;
  mimeType: string;
  data: string; // base64
  preview?: string;
}

export interface Game {
  id: string;
  title: string;
  genre: Genre;
  description: string;
  thumbnailUrl?: string;
  status: 'Concept' | 'In Development' | 'Completed';
  lastModified: string;
  assets: GameAsset[];
  scripts?: GameScript[];
  hierarchy?: SceneNode[];
  specification?: {
    description: string;
    mechanics: string[];
    visualStyle: string;
    aiPromptForThumbnail?: string;
  };
}

export interface ForgingStep {
  id: string;
  label: string;
  icon: string;
  status: 'pending' | 'processing' | 'completed';
}
