import "../globals.css";
import {NextIntlClientProvider} from "next-intl";
import React from "react";

export default async function RootLayout(
    { children, }: { children:  React.ReactNode;
}) {
    return (
        <NextIntlClientProvider>
            <main className="overflow-y-auto">
                {children}
            </main>
        </NextIntlClientProvider>
    );
}
