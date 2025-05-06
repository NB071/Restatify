"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const containerVariants = {
	hidden: { opacity: 0, y: 50 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			staggerChildren: 0.2,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0 },
};

const features = [
	{
		imgSrc: "/landing-search3.png",
		title: "Trustworthy and Verified Listings",
		desc: "Find verified listings and avoid scams for a hassle-free rental experience.",
		linkText: "Explore",
		linkHref: "/explore",
	},
	{
		imgSrc: "/landing-search2.png",
		title: "Browse Rental Listings with Ease",
		desc: "Access user reviews and ratings to better understand properties.",
		linkText: "Search",
		linkHref: "/search",
	},
	{
		imgSrc: "/landing-search1.png",
		title: "Simplify Your Rental Search with Advanced Filters",
		desc: "Use powerful filters to find your ideal home quickly and easily.",
		linkText: "Discover",
		linkHref: "/discover",
	},
];

const FeaturesSection = () => {
	return (
		<motion.section
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true }}
			variants={containerVariants}
			className="py-24 px-6 sm:px-8 lg:px-12 xl:px-16 bg-white"
		>
			<div className="max-w-4xl xl:max-w-6 mx-auto">
				<motion.h2
					variants={itemVariants}
					className="w-full text-center text-3xl font-bold mb-12 sm:w-2/3 mx-auto"
				>
					Quickly find the home you want using our effective search
					fillters!
				</motion.h2>
				<div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12 xl:gap-16">
					{features.map((feature, idx) => (
						<motion.div key={idx} variants={itemVariants}>
							<FeatureCard {...feature} />
						</motion.div>
					))}
				</div>
			</div>
		</motion.section>
	);
};

type FeatureCardProps = {
	imgSrc: string;
	title: string;
	desc: string;
	linkText: string;
	linkHref: string;
};

const FeatureCard = ({
	imgSrc,
	title,
	desc,
	linkText,
	linkHref,
}: FeatureCardProps) => (
	<article className="text-center">
		<div className="p-4 rounded-lg mb-4 flex items-center justify-center h-48">
			<Image
				src={imgSrc}
				width={400}
				height={400}
				className="w-full h-full object-contain"
				alt={title}
			/>
		</div>

		<h3 className="text-xl font-semibold mb-2">{title}</h3>
		<p className="mb-4 text-gray-600">{desc}</p>
		<Link
			href={linkHref}
			className="inline-block border border-gray-300 rounded px-4 py-2 hover:bg-gray-100 transition"
			scroll={false}
		>
			{linkText}
		</Link>
	</article>
);

export default FeaturesSection;
