"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.2,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0 },
};

const cards: DiscoverCardProps[] = [
	{
		imgSrc: "/landing-icon-wand.png",
		title: "Search for Properties",
		desc: "Browse through our extensive collection of rental properties in your desired location.",
	},
	{
		imgSrc: "/landing-icon-calendar.png",
		title: "Book Your Rental",
		desc: "Once you've found the perfect rental property, easily book it online with just a few clicks.",
	},
	{
		imgSrc: "/landing-icon-heart.png",
		title: "Enjoy Your New Home",
		desc: "Move into your new rental property and start enjoying your dream home.",
	},
];

const DiscoverSection = () => {
	return (
		<motion.section
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, amount: 0.8 }}
			variants={containerVariants}
			className="py-12 bg-white mb-16"
		>
			<div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
				<motion.div
					variants={itemVariants}
					className="my-12 text-center"
				>
					<h2 className="text-3xl font-semibold leading-tight text-gray-800">
						Discover
					</h2>
					<p className="mt-4 text-lg text-gray-600">
						Find your Dream Rental Property Today!
					</p>
					<p className="mt-2 text-gray-500 max-w-3xl mx-auto">
						Searching for your dream rental property has never been
						easier. With our user-friendly search feature, you can
						quickly find the perfect home that meets all your needs.
						Start your search today and discover your dream rental
						property!
					</p>
				</motion.div>
				<div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3 lg:gap-12 xl:gap-16">
					{cards.map((card, idx) => (
						<motion.div key={idx} variants={itemVariants}>
							<DiscoverCard {...card} />
						</motion.div>
					))}
				</div>
			</div>
		</motion.section>
	);
};

type DiscoverCardProps = {
	imgSrc: string;
	title: string;
	desc: string;
};

const DiscoverCard = ({ imgSrc, title, desc }: DiscoverCardProps) => (
	<article className="px-4 py-12 shadow-lg rounded-lg bg-primary-50 md:h-72">
		<div className="bg-primary-700 p-[0.6rem] rounded-full mb-4 w-10 h-10 mx-auto">
			<Image
				src={imgSrc}
				width={30}
				height={30}
				className="w-full h-full"
				alt={title}
			/>
		</div>

		<h3 className="mt-4 text-xl font-medium text-gray-800">{title}</h3>
		<p className="mt-2 text-base text-gray-500 leading-snug">{desc}</p>
	</article>
);

export default DiscoverSection;
