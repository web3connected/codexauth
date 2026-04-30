export interface HeroSlideProps {
  /** Whether this slide is the currently visible one */
  isActive: boolean
  /** Whether autoplay is paused (e.g. on hover) */
  paused: boolean
  /** Autoplay interval in ms — slides may use this for their own progress animations */
  autoplayMs: number
}
