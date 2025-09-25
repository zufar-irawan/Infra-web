"use client";

import Navbar from "@/app/components/header";
import Footer from "@/components/footer";

import Home from "./sections/home";
import About from "./sections/about";

export default function Main() {
	return (
		<div className="flex-1 w-full min-h-screen">
			<Navbar />

			<Home />
			<About />
			
			<Footer />
		</div>
	);
}
