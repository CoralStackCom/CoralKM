import type { PhaseType } from './Background.interfaces'

export function getCurrentPhase(): PhaseType {
  const hour = new Date().getHours()
  if (hour >= 6 && hour < 9) return 'morning'
  if (hour >= 9 && hour < 18) return 'day'
  if (hour >= 18 && hour < 21) return 'evening'
  return 'night'
}

export function getPhaseGradients(phase: PhaseType) {
  const gradients = {
    day: {
      sky: ['#87CEEB', '#1E90FF', '#4169E1'],
      land: ['#87CEEB', '#5BA3D9', '#2E86AB'],
      underwater: ['#1a5276', '#154360', '#0e2f44'],
    },
    morning: {
      sky: ['#FFB347', '#FF9966', '#87CEEB'],
      land: ['#FFD89B', '#87CEEB', '#5BA3D9'],
      underwater: ['#2E86AB', '#1a5276', '#0e2f44'],
    },
    evening: {
      sky: ['#FF6B6B', '#FFA07A', '#4169E1'],
      land: ['#FFA07A', '#5BA3D9', '#2E86AB'],
      underwater: ['#1a5276', '#154360', '#0a1f2e'],
    },
    night: {
      sky: ['#0a0a2e', '#1a1a4e', '#2a2a6e'],
      land: ['#1a1a4e', '#0e2f44', '#0a1f2e'],
      underwater: ['#0e2f44', '#0a1f2e', '#050f17'],
    },
  }
  return gradients[phase]
}

export function randomNumber(min: number, max: number, round = false): number {
  const value = Math.random() * (max - min) + min
  return round ? Math.round(value) : value
}

export function hslToHex(h: number, s: number, l: number): string {
  h /= 360
  s /= 100
  l /= 100
  let r, g, b
  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}
