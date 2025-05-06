"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
	return (
		<section className="relative h-screen">
			<Image
				src="/landing-splash.jpg"
				alt="Restatify Rental platform Hero Section"
				className="object-cover object-center"
				fill
				priority
			/>
			<div className="absolute inset-0 bg-black bg-opacity-60">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.85 }}
					className="absolute w-full top-1/3 transform -translate-x-1/2 -translate-y-1/2 text-center"
				>
					<div className="max-w-4xl mx-auto px-16 sm:px-12">
						<h1 className="text-5xl font-bold text-white mb-4">
							Start your journey the perfect place to call home
						</h1>
						<p className="text-xl text-white mb-8">
							Explore our wide range of rental properties tailored
							to fit your lifestyle and needs!
						</p>
						<div className="flex justify-center h-12">
							<Input
								type="text"
								value="search query"
								onChange={() => {}}
								placeholder="Search by city, neighborhood, address"
								className="w-full max-w-lg rounded-none rounded-l-xl border-none bg-white h-full"
							/>
							<Button
								onClick={() => {}}
								className="bg-secondary-500 text-white rounded-none rounded-r-xl border-none hover:bg-secondary-600 h-full"
							>
								Search
							</Button>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
};

export default HeroSection;
