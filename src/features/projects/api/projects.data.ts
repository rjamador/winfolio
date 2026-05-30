import { projectListSchema, type Project } from './schemas'

/**
 * Local sample data (hybrid approach). Validated at module load so malformed
 * data fails fast. Phase 10 swaps this for a real API response in fetchProjects.
 */
const rawProjects = [
  {
    id: 'winfolio',
    title: 'Winfolio',
    description: 'This very portfolio — a Windows 95 desktop built with React.',
    tech: ['React', 'TypeScript', 'Vite', 'Tailwind'],
    repoUrl: 'https://github.com/example/winfolio',
    featured: true,
    year: 2026,
  },
  {
    id: 'pixel-paint',
    title: 'Pixel Paint',
    description: 'A tiny bitmap editor with a retro palette and export to PNG.',
    tech: ['Canvas', 'TypeScript'],
    url: 'https://example.com/pixel-paint',
    featured: true,
    year: 2025,
  },
  {
    id: 'task-tray',
    title: 'Task Tray',
    description: 'A keyboard-first to-do app that lives in your system tray.',
    tech: ['React', 'Electron'],
    repoUrl: 'https://github.com/example/task-tray',
    featured: false,
    year: 2024,
  },
  {
    id: 'soundbits',
    title: 'SoundBits',
    description: 'A web sampler for chopping and sequencing short audio clips.',
    tech: ['Web Audio API', 'React'],
    url: 'https://example.com/soundbits',
    featured: false,
    year: 2023,
  },
]

export const projects: Project[] = projectListSchema.parse(rawProjects)
