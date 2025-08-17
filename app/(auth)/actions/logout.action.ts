'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

import routes from '@/helpers/routes';

const logout = async () => {
  (await cookies()).delete('session');

  redirect(routes.login());
};

export default logout;
