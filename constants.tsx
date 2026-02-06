
import React from 'react';
import { Genre, ForgingStep, Game } from './types';

export const GENRE_DATA = [
  { genre: Genre.Action, icon: '⚔️', desc: 'Fast-paced combat and...' },
  { genre: Genre.Adventure, icon: '🗺️', desc: 'Story-driven exploration' },
  { genre: Genre.Puzzle, icon: '🧩', desc: 'Brain teasers and logic' },
  { genre: Genre.RPG, icon: '🎭', desc: 'Character progression...' },
  { genre: Genre.Platformer, icon: '🎮', desc: 'Jumping and timing...' },
  { genre: Genre.Shooter, icon: '🎯', desc: 'Precision and reaction time' },
  { genre: Genre.Racing, icon: '🏎️', desc: 'Speed and competition' },
  { genre: Genre.Simulation, icon: '🏗️', desc: 'Real-world systems' },
  { genre: Genre.Strategy, icon: '♟️', desc: 'Tactical planning' },
  { genre: Genre.Horror, icon: '👻', desc: 'Fear and suspense' },
];

export const INITIAL_FORGING_STEPS: ForgingStep[] = [
  { id: 'analyze', label: 'Analyzing your concept', icon: '✨', status: 'pending' },
  { id: 'spec', label: 'Creating game specification', icon: '📄', status: 'pending' },
  { id: 'model', label: 'Generating 3D models', icon: '📦', status: 'pending' },
  { id: 'map', label: 'Building game maps', icon: '🗺️', status: 'pending' },
  { id: 'audio', label: 'Composing audio assets', icon: '🎵', status: 'pending' },
  { id: 'anim', label: 'Creating animations', icon: '🎞️', status: 'pending' },
  { id: 'godot', label: 'Assembling in Godot', icon: '🛠️', status: 'pending' },
];

// Explicitly typing as Game[] fixes the issue where 'status' is inferred as a generic string
export const MOCK_GAMES: Game[] = [
  {
    id: '1',
    title: 'Azu Puzzle',
    genre: Genre.Puzzle,
    description: "Dive into a mesmerizing underwater world where players embark on an adventurous puzzle exploration to save the coral reefs...",
    status: 'In Development',
    lastModified: 'Jan 12, 2026',
    assets: [],
    // Added missing description to satisfy the required specification property in Game interface
    specification: {
      description: "Dive into a mesmerizing underwater world where players embark on an adventurous puzzle exploration to save the coral reefs...",
      mechanics: ['Color matching', 'Environmental puzzles'],
      visualStyle: 'Vibrant underwater bioluminescence'
    }
  },
  {
    id: '2',
    title: 'Neon Ghost',
    genre: Genre.Horror,
    description: "In 'Neon Ghost', players dive into a thrilling cyberpunk world where hover bikes zoom through neon-lit streets while a restless spirit haunts the city...",
    status: 'In Development',
    lastModified: 'Jan 12, 2026',
    assets: [],
    // Added missing description to satisfy the required specification property in Game interface
    specification: {
      description: "In 'Neon Ghost', players dive into a thrilling cyberpunk world where hover bikes zoom through neon-lit streets while a restless spirit haunts the city...",
      mechanics: ['Psychological horror', 'Stealth'],
      visualStyle: 'High-contrast neon synthwave'
    }
  },
  {
    id: '3',
    title: 'Space Game',
    genre: Genre.Simulation,
    description: 'Space Game is an immersive space exploration simulation that invites players to traverse the cosmos with realistic physics...',
    status: 'In Development',
    lastModified: 'Jan 12, 2026',
    assets: [],
    // Added missing description to satisfy the required specification property in Game interface
    specification: {
      description: 'Space Game is an immersive space exploration simulation that invites players to traverse the cosmos with realistic physics...',
      mechanics: [
        'Open-world space navigation',
        'Resource management',
        'Scientific research'
      ],
      visualStyle: 'Stunning art style that balances realism and stylization.'
    }
  }
];
