import OurStory from "@/components/about/our-story"
import SiteStats from "@/components/about/site-stats"
import TeamMembers from "@/components/about/team-members"
import ServiceFeatures from "@/components/about/service-features"
    
export default function AboutPage() {
    return (
        <main>
            <OurStory />
            <SiteStats/>
            <TeamMembers/>
            <ServiceFeatures/>
        </main>
    )
}

