export const NODE_COLORS = {
  core: '#5eead4', // cyan
  experience: '#f0b429', // amber
  project: '#ec6a5e', // coral
  skill: '#8b5cf6', // violet
  contact: '#5eead4', // cyan, matches core to bookend the graph
};

export const NODE_COLORS_HOVER = {
  core: '#99f6e4',
  experience: '#f7cc6a',
  project: '#f29a91',
  skill: '#b19dfa',
  contact: '#99f6e4',
};

export const BASE_NODE_RADIUS = 0.34;

export const CAMERA_FOCUS_DISTANCE = 4.2;

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
