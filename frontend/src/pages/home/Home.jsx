import { HeroSection } from './components/HeroSection';
import { ValuesSection } from './components/ValuesSection';
import { FeaturedActivitiesSection } from './components/FeaturedActivitiesSection';
import { ActivityNotificationBanner } from './components/ActivityNotificationBanner';


export default function Home() {
	return (
		<>
			<ActivityNotificationBanner />
			<HeroSection />
			<ValuesSection />								
			<FeaturedActivitiesSection />
		</>
	);
}
