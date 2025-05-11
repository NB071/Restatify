"use client";

import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "@/components/AppSidebar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import React, { useEffect, useState } from "react";
import { useGetAuthUserQuery } from "@/state/api";
import { usePathname, useRouter } from "next/navigation";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
	const { data: authUser, isLoading: isAuthLoading } = useGetAuthUserQuery();
	const router = useRouter();
	const pathname = usePathname();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (authUser) {
			const userRole = authUser.userRole?.toLowerCase();
			if (
				(userRole === "manager" && pathname.startsWith("/tenants")) ||
				(userRole === "tenant" && pathname.startsWith("/managers"))
			) {
				router.push(
					userRole === "manager"
						? "/managers/properties"
						: "/tenants/favorites",
					{ scroll: false }
				);
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

	if (!authUser?.userRole) {
		return null;
	}

	return (
		<SidebarProvider>
			<div className="min-h-screen w-full bg-primary-100">
				<Navbar />
				<div>
					<main className="flex">
						<Sidebar userType={authUser?.userRole.toLowerCase()} />
						<section className="flex-grow transition-all duration-300">
							{children}
						</section>
					</main>
				</div>
			</div>
		</SidebarProvider>
	);
};

export default DashboardLayout;
