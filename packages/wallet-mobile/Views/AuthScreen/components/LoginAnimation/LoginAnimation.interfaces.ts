export interface LoginAnimationRef {
  // Methods to control the animation
  loading: () => void
  stop: () => void
  jump: () => void
}

export interface LoginAnimationProps {
  /**
   * Callback when fish starts jumping down (hide the form)
   */
  onFishJump?: () => void
  /**
   * Callback when fish hits the water (transition to underwater view)
   */
  onSplash?: () => void
  /**
   * Callback when animation has ended
   */
  onEnd?: () => void
  /**
   * Y position of the water surface (where splash should happen)
   * Default: 60% of screen height
   */
  waterSurfaceY: number
  /**
   * Y position of the logo (where fish starts)
   * Default: 30% of screen height
   */
  logoY: number
  /**
   *  Sizes of the fish animation
   */
  sizes: { width: number; height: number }
}

export type AnimationState = 'logo' | 'loading' | 'jumping' | 'swimming' | 'destroyed'
