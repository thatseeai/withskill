export type Theme = 'light' | 'dark' | 'system'
export type Density = 'comfortable' | 'compact'

export interface Settings {
  theme: Theme
  density: Density
  notifications: {
    email: boolean
    slack: boolean
  }
}

export const defaultSettings: Settings = {
  theme: 'system',
  density: 'comfortable',
  notifications: {
    email: true,
    slack: false,
  },
}
