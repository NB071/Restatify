import Link from "next/link";
import React from "react";
import {
	FaFacebookF,
	FaInstagram,
	FaXTwitter,
	FaLinkedinIn,
	FaYoutube,
} from "react-icons/fa6";

const FooterSection = () => {
	return (
		<footer className="border-t border-gray-200 py-20">
			<div className="max-w-4xl mx-auto px-6 sm:px-8">
				{/* Navigation Section */}
				<section
					aria-labelledby="footer-navigation"
					className="flex flex-col md:flex-row justify-between items-center mb-8"
				>
					<div className="mb-4">
						<Link
							href="/"
							className="text-xl font-bold"
							scroll={false}
						>
							Restatify
						</Link>
					</div>

					<nav aria-label="Footer navigation" className="mb-4">
						<ul className="flex space-x-6">
							<li>
								<Link href="/about">About Us</Link>
							</li>
							<li>
								<Link href="/contact">Contact Us</Link>
							</li>
							<li>
								<Link href="/faq">FAQ</Link>
							</li>
							<li>
								<Link href="/terms">Terms</Link>
							</li>
							<li>
								<Link href="/privacy">Privacy</Link>
							</li>
						</ul>
					</nav>

					{/* Social Media Section */}
					<section
						aria-label="Social media links"
						className="flex space-x-4 mb-4"
					>
						<a
							href="https://facebook.com"
							aria-label="Facebook"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-blue-600 duration-300"
						>
							<FaFacebookF className="h-6 w-6" />
						</a>
						<a
							href="https://instagram.com"
							aria-label="Instagram"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-pink-500 duration-300"
						>
							<FaInstagram className="h-6 w-6" />
						</a>
						<a
							href="https://x.com"
							aria-label="X"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-gray-900 duration-300"
						>
							<FaXTwitter className="h-6 w-6" />
						</a>
						<a
							href="https://linkedin.com"
							aria-label="LinkedIn"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-blue-700 duration-300"
						>
							<FaLinkedinIn className="h-6 w-6" />
						</a>
						<a
							href="https://youtube.com"
							aria-label="YouTube"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-red-600 duration-300"
						>
							<FaYoutube className="h-6 w-6" />
						</a>
					</section>
				</section>

				{/* Legal Section */}
				<section
					aria-label="Legal info"
					className="text-center text-sm text-gray-500 flex justify-center space-x-4"
				>
					<span className="italic">
						© Restatify. All rights reserved.
					</span>
					<Link href="/privacy" scroll={false}>
						Privacy Policy
					</Link>
					<Link href="/terms" scroll={false}>
						Terms of Service
					</Link>
					<Link href="/cookies" scroll={false}>
						Cookie Policy
					</Link>
				</section>
			</div>
		</footer>
	);
};

export default FooterSection;
