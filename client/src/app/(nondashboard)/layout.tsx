import Navbar from "@/components/Navbar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<Navbar />
			<main className={`h-full w-full flex flex-col`}>{children}</main>
		</>
	);
};

export default Layout;
