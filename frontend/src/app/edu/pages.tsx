import { useEffect } from "react";

export default function Edu() {
    useEffect(() => {
        if (typeof window !== "undefined") {
            window.location.href = "/edu/login/";
        }
    }, []);

    return null;
}