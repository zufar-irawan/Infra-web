import Link from "next/link";
import {getCurrenUser, User} from "@/app/lib/user";
import {getToken} from "@/app/lib/Auth";
import {GetServerSideProps} from "next";

interface SidebarProps {
    user: User | null
}

export const getServerSideProps: GetServerSideProps<SidebarProps> = async ({ req }) => {
    const token = getToken(req);

    if (!token) {
        return { props: { user: null } }; // user belum login
    }

    try {
        const user = await getCurrenUser(token);
        return { props: { user } };
    } catch (err) {
        console.error(err);
        return { props: { user: null } };
    }
};

export default function Sidebar({ user }:SidebarProps) {
    console.log(user);

    return (
        <div className="w-64 h-screen bg-white fixed ">
            <div>
                {user?.name}
            </div>

            <div className="flex items-center justify-center w-full">
                <nav className="mt-10 flex flex-col">
                    <Link href="/">
                        Home
                    </Link>

                    <Link href="/about">
                        About
                    </Link>

                    <Link href="/contact">
                        Contact
                    </Link>
                </nav>
            </div>
        </div>
    )
}