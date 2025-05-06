import { NAVBAR_HEIGHT } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const Navbar = () => {
	return (
		<header
			className="sticky top-0 left-0 w-full z-50 shadow-xl"
			style={{ height: `${NAVBAR_HEIGHT}` }}
		>
			<div className="flex justify-between items-center w-full py-3 px-8 bg-primary-700 text-white">
				<div className="flex items-center gap-4 md:gap-6">
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
				</div>
				<p className="text-primary-200 hidden md:block">
					Discover your perfect rental apartment with our advanced
					search
				</p>
				<div className="flex items-center gap-5">
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
				</div>
			</div>
		</header>
	);
};

export default Navbar;
