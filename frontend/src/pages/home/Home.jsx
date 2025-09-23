import { HeroSection } from './components/HeroSection';
import { ValuesSection } from './components/ValuesSection';
import { FeaturedActivitiesSection } from './components/FeaturedActivitiesSection';

export default function Home() {
	return (
		<>
			<HeroSection />
			<ValuesSection />
			<FeaturedActivitiesSection />
		</>
	);
}
