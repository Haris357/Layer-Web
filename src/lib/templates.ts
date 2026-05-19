// Layer's built-in templates, mirrored from the desktop app's builtins.
// The gallery renders these layouts to scale — a real, data-accurate preview.

export interface TplWidget {
  type: string
  label: string
  x: number
  y: number
  width: number
  height: number
}

export interface GalleryTemplate {
  id: string
  name: string
  tagline: string
  description: string
  widgets: TplWidget[]
}

export const TEMPLATES: GalleryTemplate[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    tagline: 'Calm and uncluttered',
    description:
      'A clock, a journal and a gentle countdown — just enough to keep the day in view.',
    widgets: [
      { type: 'clock', label: 'Clock', x: 140, y: 130, width: 240, height: 240 },
      { type: 'note', label: 'Journal', x: 140, y: 420, width: 560, height: 460 },
      { type: 'countdown', label: 'New Year', x: 470, y: 130, width: 330, height: 160 },
      { type: 'todo', label: 'To-do', x: 760, y: 420, width: 320, height: 320 },
      { type: 'worldclock', label: 'World Clocks', x: 880, y: 130, width: 300, height: 200 },
    ],
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    tagline: 'Everything at a glance',
    description:
      'Weather, system stats, a calendar and world clocks for a busy command desk.',
    widgets: [
      { type: 'clock', label: 'Clock', x: 150, y: 120, width: 300, height: 160 },
      { type: 'weather', label: 'Weather', x: 490, y: 120, width: 270, height: 200 },
      { type: 'stats', label: 'System', x: 800, y: 120, width: 300, height: 170 },
      { type: 'calendar', label: 'Calendar', x: 150, y: 320, width: 300, height: 300 },
      { type: 'worldclock', label: 'World Clocks', x: 490, y: 350, width: 290, height: 210 },
      { type: 'nowplaying', label: 'Now Playing', x: 820, y: 320, width: 380, height: 200 },
      { type: 'todo', label: 'To-do', x: 1140, y: 120, width: 320, height: 360 },
    ],
  },
  {
    id: 'command',
    name: 'Command',
    tagline: 'Built for speed',
    description:
      'Apps, search and quick links — a launcher-style layout to move fast.',
    widgets: [
      { type: 'apps', label: 'Apps', x: 150, y: 130, width: 320, height: 320 },
      { type: 'search', label: 'Search', x: 510, y: 130, width: 380, height: 54 },
      { type: 'nowplaying', label: 'Now Playing', x: 510, y: 215, width: 380, height: 200 },
      { type: 'link', label: 'GitHub', x: 510, y: 445, width: 185, height: 52 },
      { type: 'link', label: 'YouTube', x: 705, y: 445, width: 185, height: 52 },
      { type: 'notifications', label: 'Notifications', x: 930, y: 130, width: 330, height: 360 },
      { type: 'clock', label: 'Clock', x: 1300, y: 130, width: 290, height: 150 },
    ],
  },
]
