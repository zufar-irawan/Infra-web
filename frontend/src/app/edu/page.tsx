import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function Page() {
  // Misal token login disimpan di cookie bernama 'token'
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  if (token) {
    // Jika sudah login, redirect ke dashboard
    redirect('edu/dashboard');
  } else {
    // Jika belum login, redirect ke login
    redirect('edu/login');  
  }
  return null;
}
