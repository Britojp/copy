export const colors = {
  background: '#D9D9D9',
  white: '#F6F6F3',
  black: '#131313',
  lightGray: '#F1F1F1',
  midGray: '#7D7D7D',
  darkGray: '#454545',
} as const

export const borderRadius = {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.625rem',
  xl: '0.75rem',
  '2xl': '1rem',
} as const

export const fonts = {
  sans: "'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
  logo: "'Playfair Display', serif",
} as const

export const designSystem = {
  colors,
  borderRadius,
  fonts,
} as const

export const colorClasses = {
  background: 'bg-[#D9D9D9]',
  white: 'bg-[#F6F6F3]',
  black: 'bg-[#131313]',
  lightGray: 'bg-[#F1F1F1]',
  midGray: 'bg-[#7D7D7D]',
  darkGray: 'bg-[#454545]',
  text: {
    background: 'text-[#D9D9D9]',
    white: 'text-[#F6F6F3]',
    black: 'text-[#131313]',
    lightGray: 'text-[#F1F1F1]',
    midGray: 'text-[#7D7D7D]',
    darkGray: 'text-[#454545]',
  },
} as const

export const borderRadiusClasses = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
} as const

