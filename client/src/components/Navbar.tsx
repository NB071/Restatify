"use client";

import { NAVBAR_HEIGHT } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { useGetAuthUserQuery } from "@/state/api";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "aws-amplify/auth";
import { Bell, MessageCircle, Plus, Search } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SidebarTrigger } from "./ui/sidebar";

const Navbar = () => {
	const { data: authUser } = useGetAuthUserQuery();
	const router = useRouter();
	const pathname = usePathname();

	const isDashboard =
		pathname.includes("/managers") || pathname.includes("/tenants");

	const handleSignOut = async () => {
		await signOut();
		window.location.href = "/";
	};
	return (
		<header
			className="sticky top-0 left-0 w-full z-50 shadow-xl"
			style={{ height: `${NAVBAR_HEIGHT}` }}
		>
			<section className="flex justify-between items-center w-full py-3 px-8 bg-primary-700 text-white">
				<section className="flex items-center gap-4 md:gap-6">
					{isDashboard && (
						<div className="md:hidden">
							<SidebarTrigger />
						</div>
					)}
					<Link
						href="/"
						className="cursor-pointer hover:!text-primary-300 duration-300"
						scroll={false}
					>
						<div className="flex items-center gap-3">
							<Image
								src="/logo.svg"
								alt="RStatify"
								width={24}
								height={24}
								className="w-6 h-6"
							/>
							<div className="text-xl font-bold">
								R
								<span className="text-secondary-500 font-light hover:!text-primary-300 duration-300">
									estatify
								</span>
							</div>
						</div>
					</Link>
					{isDashboard && authUser && (
						<Button
							variant="secondary"
							className="md:ml-4 bg-primary-50 text-primary-700 hover:bg-secondary-500 hover:text-primary-50"
							onClick={() =>
								router.push(
									authUser.userRole?.toLowerCase() ===
										"manager"
										? "/managers/newproperty"
										: "/search"
								)
							}
						>
							{authUser.userRole?.toLowerCase() === "manager" ? (
								<>
									<Plus className="h-4 w-4" />
									<span className="hidden md:block ml-2">
										Add Property
									</span>
								</>
							) : (
								<>
									<Search className="h-4 w-4" />
									<span className="hidden md:block ml-2">
										Search Properties
									</span>
								</>
							)}
						</Button>
					)}
				</section>
				{!isDashboard && (
					<section className="text-primary-200 hidden md:block">
						<p>
							Discover your perfect rental apartment with our
							advanced search
						</p>
					</section>
				)}
				<section className="flex items-center gap-5">
					{authUser ? (
						<>
							<div className="relative hidden md:block">
								<MessageCircle className="h-6 w-6 cursor-pointer text-primary-200 hover:text-primary-400" />
								<span className="absolute top-0 right-0 w-2 h-2 bg-secondary-700 rounded-full"></span>
							</div>
							<div className="relative hidden md:block">
								<Bell className="h-6 w-6 cursor-pointer text-primary-200 hover:text-primary-400" />
								<span className="absolute top-0 right-0 w-2 h-2 bg-secondary-700 rounded-full"></span>
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none">
									<Avatar className="w-10 h-10 rounded-full overflow-hidden">
										<AvatarImage
											src={authUser.userInfo?.image}
										/>
										<AvatarFallback className="bg-primary-600 rounded-full w-10 h-10 flex items-center justify-center">
											{authUser.userRole?.[0].toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<p className="text-primary-200 hidden md:block">
										{authUser.userInfo?.name}
									</p>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="bg-white text-primary-700">
									<DropdownMenuItem
										className="cursor-pointer hover:!bg-primary-700 hover:!text-primary-100 font-bold"
										onClick={() => {
											router.push(
												authUser.userRole?.toLowerCase() ===
													"manager"
													? "/managers/properties"
													: "/tenants/favorites",
												{ scroll: false }
											);
										}}
									>
										Go to Dashboard
									</DropdownMenuItem>
									<DropdownMenuSeparator className="bg-primary-200" />
									<DropdownMenuItem
										className="cursor-pointer hover:!bg-primary-700 hover:!text-primary-100 "
										onClick={() => {
											router.push(
												`${authUser.userRole?.toLowerCase()}s/settings`,
												{ scroll: false }
											);
										}}
									>
										Go to Settings
									</DropdownMenuItem>
									<DropdownMenuItem
										className="cursor-pointer hover:!bg-primary-700 hover:!text-primary-100 "
										onClick={handleSignOut}
									>
										Sign out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</>
					) : (
						<>
							<Link href="/signin">
								<Button
									variant="outline"
									className="text-white border-white bg-transparent hover:bg-white hover:text-primary-700 rounded-lg"
								>
									Sign in
								</Button>
							</Link>
							<Link href="/signup">
								<Button
									variant="secondary"
									className="text-white bg-secondary-600 hover:bg-white bover:text-primary-700 rounded-lg"
								>
									Sign up
								</Button>
							</Link>
						</>
					)}
				</section>
			</section>
		</header>
	);
};

export default Navbar;
