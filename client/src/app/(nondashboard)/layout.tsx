"use client";

import Navbar from "@/components/Navbar";
import { useGetAuthUserQuery } from "@/state/api";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
	const { data: authUser } = useGetAuthUserQuery();
	console.log("Auth User", authUser);
	return (
		<>
			<Navbar />
			<main className={`h-full w-full flex flex-col`}>{children}</main>
		</>
	);
};

export default Layout;
