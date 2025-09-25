// import Image from "next/image";
// import { redirect } from "next/navigation";

import { useLang } from "../components/LangContext";

export default function About() {
    // const { lang, setLang } = useLang();
    
    return (
        <section id="home">
            <div className="relative w-full min-h-screen bg-gray-800">
                <div className="relative z-20 w-full min-h-screen flex items-center justify-center px-4">
                    <div className="container flex flex-col items-start gap-2">
                        hi
                    </div>
                </div>
            </div>
        </section>
    );
}