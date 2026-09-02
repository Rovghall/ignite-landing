/** Official store listings. */
export const APP_STORE_AVAILABLE = false
export const APP_STORE_URL = '#download'
export const GOOGLE_PLAY_URL =
  'https://play.google.com/store/apps/details?id=com.igniteai.app'

export type ClientStorePlatform = 'ios' | 'android' | 'other'

export function detectClientStorePlatform(
  userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '',
): ClientStorePlatform {
  const ua = userAgent || ''
  if (/android/i.test(ua)) return 'android'
  if (/iPad|iPhone|iPod/i.test(ua)) return 'ios'
  // iPadOS 13+ can report as Macintosh
  if (typeof navigator !== 'undefined' && /Macintosh/i.test(ua) && navigator.maxTouchPoints > 1) {
    return 'ios'
  }
  return 'other'
}

/**
 * Best store destination when the app is not installed.
 * Android → Play Store. iOS → App Store when live, else stay on download section.
 */
export function preferredStoreUrl(platform: ClientStorePlatform = detectClientStorePlatform()): string {
  if (platform === 'android') return GOOGLE_PLAY_URL
  if (platform === 'ios' && APP_STORE_AVAILABLE) return APP_STORE_URL
  return '#download'
}
