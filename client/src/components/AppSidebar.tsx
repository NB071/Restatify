import { usePathname } from "next/navigation";
import React from "react";
import {
	Sidebar,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	useSidebar,
} from "./ui/sidebar";
import {
	Building,
	FileText,
	Heart,
	Home,
	Menu,
	Settings,
	X,
} from "lucide-react";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const AppSidebar = ({ userType }: AppSidebarProps) => {
	const pathname = usePathname();
	const { toggleSidebar, open } = useSidebar();

	const navLinks =
		userType === "manager"
			? [
					{
						icon: Building,
						label: "Properties",
						path: "/managers/properties",
					},
					{
						icon: FileText,
						label: "Applications",
						path: "/managers/applications",
					},
					{
						icon: Settings,
						label: "Settings",
						path: "/managers/settings",
					},
			  ]
			: [
					{
						icon: Heart,
						label: "Favorites",
						path: "/tenants/favorites",
					},
					{
						icon: FileText,
						label: "Applications",
						path: "/tenants/applications",
					},
					{
						icon: Home,
						label: "Residences",
						path: "/tenants/residences",
					},
					{
						icon: Settings,
						label: "Settings",
						path: "/tenants/settings",
					},
			  ];
	return (
		<Sidebar
			collapsible="icon"
			className="fixed left-0 bg-white shadow-lg"
			style={{
				top: `${NAVBAR_HEIGHT}px`,
				height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
			}}
		>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<div
							className={cn(
								"flex min-h-[56px] w-full items-center pt-3 mb-3",
								open ? "justify-between px-4" : "justify-center"
							)}
						>
							{open ? (
								<>
									<h1 className="text-xl font-bold text-gray-800">
										{userType === "manager"
											? "Manager View"
											: "Renter View"}
									</h1>
									<Button
										className="hover:bg-gray-100 p-2 rounded-md"
										onClick={toggleSidebar}
									>
										<X className="h-6 w-6 text-gray-600" />
									</Button>
								</>
							) : (
								<Button
									className="hover:bg-gray-100 p-2 rounded-md"
									onClick={toggleSidebar}
								>
									<Menu className="h-6 w-6 text-gray-600" />
								</Button>
							)}
						</div>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
		</Sidebar>
	);
};

export default AppSidebar;
