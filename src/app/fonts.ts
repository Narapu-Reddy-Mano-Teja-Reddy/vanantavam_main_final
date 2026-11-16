import localFont from 'next/font/local';

export const cinzel = localFont({
  src: '../../public/fonts/cinzel.woff2',
  variable: '--font-cinzel',
  display: 'swap',
  weight: '600 700',
});

export const playfair = localFont({
  src: '../../public/fonts/playfair-display.woff2',
  variable: '--font-serif',
  display: 'swap',
  weight: '500 700',
});

export const plusJakarta = localFont({
  src: '../../public/fonts/plus-jakarta-sans.woff2',
  variable: '--font-sans',
  display: 'swap',
  weight: '400 700',
});

