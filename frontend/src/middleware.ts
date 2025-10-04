import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing'

export default createMiddleware(routing);

export const config = {
    // Cocokkan semua path kecuali yang memiliki titik (file) atau dimulai dengan /api
    matcher: '/((?!api|trpc|_next|_vercel|edu|.*\\..*).*)'
};