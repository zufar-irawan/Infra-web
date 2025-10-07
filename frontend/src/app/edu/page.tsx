import {redirect} from 'next/navigation';
import {UseUser} from "@/app/lib/userMe";

export default async function Page() {
    const user = await UseUser()

    if (user) {
        // Jika sudah login, redirect ke dashboard
        redirect('edu/dashboard');
    } else {
        // Jika belum login, redirect ke login
        redirect('edu/login');
    }

    return null
}
