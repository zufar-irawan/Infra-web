import Link from "next/link";

export default function Sidebar() {


    return (
        <div className="w-64 h-screen bg-white fixed ">
            <div>
                Tamu
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