import React from "react";
import HeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";
import DiscoverSection from "./DiscoverSection";
import CallToActionSection from "./CallToActionSection";
import FooterSection from "./FooterSection";

const Landing = () => {
	return (
		<section>
			<HeroSection />
			<FeaturesSection />
			<DiscoverSection />
			<CallToActionSection />
			<FooterSection />
		</section>
	);
};

export default Landing;
