export function suppressConsole() {
    if (process.env.NODE_ENV === "production") {
        console.log = () => {};
        console.warn = () => {};
        console.error = () => {};
        console.debug = () => {};
        console.info = () => {};
    }
}
