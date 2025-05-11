"use client";

import Navbar from "@/components/Navbar";
import { useGetAuthUserQuery } from "@/state/api";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
	const { data: authUser, isLoading: isAuthLoading } = useGetAuthUserQuery();
	const router = useRouter();
	const pathname = usePathname();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (authUser) {
			const userRole = authUser.userRole?.toLowerCase();
			if (
				(userRole === "manager" && pathname.startsWith("/search")) ||
				(userRole === "manager" && pathname === "/")
			) {
				router.push("/managers/properties", { scroll: false });
			} else {
				setIsLoading(false);
			}
		}
	}, [authUser, pathname, router]);

	if (isAuthLoading || isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="loader"> Loading...</div>
			</div>
		);
	}
	return (
		<>
			<Navbar />
			<main className={`h-full w-full flex flex-col`}>{children}</main>
		</>
	);
};

export default Layout;
