'use client';

import { useRouter } from 'next/navigation';

import routes from '@/helpers/routes';

const useGoBack = () => {
  const router = useRouter();

  const back = () => {
    const length = window.history.length;

    if (length <= 2) {
      router.push(routes.dashboard());

      return;
    }

    history.back();
  };

  return back;
};

export default useGoBack;
