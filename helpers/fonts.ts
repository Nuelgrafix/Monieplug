import localFont from 'next/font/local';

export const Metropolis = localFont({
  src: [
    {
      path: '../fonts/Metropolis-Regular.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/Metropolis-Medium.woff',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/Metropolis-Bold.woff',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-Metropolis',
});
