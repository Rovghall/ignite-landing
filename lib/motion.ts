export const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1]
export const easeOutQuart: [number, number, number, number] = [0.25, 1, 0.5, 1]
export const springPunch = { type: 'spring' as const, stiffness: 420, damping: 22, mass: 0.8 }

export const fadeRise = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

export const fadeRiseReduced = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}
