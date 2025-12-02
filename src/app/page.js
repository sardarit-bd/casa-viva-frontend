<<<<<<< HEAD
import ArticlesSection from "@/components/sections/ArticlesSection";
=======
import Blogs from "@/components/sections/Blogs";
>>>>>>> 1823920 (updated)
import CitiesSection from "@/components/sections/CitiesSection";
import HeroSection from "@/components/sections/HeroSection";
import Properties from "@/components/sections/Properties";


export default function Home() {
  return (
    <div>
      <HeroSection />
      <CitiesSection/>
      <Properties/>
      <Blogs/>
    </div>
  );
}
