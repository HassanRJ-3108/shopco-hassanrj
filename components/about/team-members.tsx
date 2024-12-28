import Image from "next/image"
import Link from "next/link"
import { inter, integralCF } from "@/app/ui/fonts"
import { Linkedin, Instagram } from "lucide-react"
import { Twitter } from "lucide-react"

const teamMembers = [
    {
        image: "/images/team/tom.png",
        name: "Tom Cruise",
        role: "Founder & Chairman",
        socials: {
            twitter: "#",
            instagram: "#",
            linkedin: "#"
        }
    },
    {
        image: "/images/team/emma.png",
        name: "Emma Watson",
        role: "Managing Director",
        socials: {
            twitter: "#",
            instagram: "#",
            linkedin: "#"
        }
    },
    {
        image: "/images/team/will.png",
        name: "Will Smith",
        role: "Product Designer",
        socials: {
            twitter: "#",
            instagram: "#",
            linkedin: "#"
        }
    }
]

export default function TeamMembers() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers.map((member, index) => (
                    <div key={index} className="bg-[#F5F5F5] p-8 flex flex-col items-center text-center">
                        <div className="relative w-full h-[300px] mb-8">
                            <Image
                                src={member.image}
                                alt={member.name}
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                        <h3 className={`${integralCF.className} text-[32px] font-medium mb-2`}>
                            {member.name}
                        </h3>
                        <p className={`${inter.className} text-base text-[#666666] mb-6`}>
                            {member.role}
                        </p>
                        <div className="flex items-center gap-4">
                            <Link href={member.socials.twitter} className="text-black hover:text-[#DB4444] transition-colors">
                                <Twitter className="w-6 h-6" />
                            </Link>
                            <Link href={member.socials.instagram} className="text-black hover:text-[#DB4444] transition-colors">
                                <Instagram className="w-6 h-6" />
                            </Link>
                            <Link href={member.socials.linkedin} className="text-black hover:text-[#DB4444] transition-colors">
                                <Linkedin className="w-6 h-6" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center items-center gap-2 mt-8">
                {[0, 1, 2, 3, 4].map((dot) => (
                    <button
                        key={dot}
                        className={`w-3 h-3 rounded-full ${dot === 2 ? 'bg-[#DB4444]' : 'bg-[#D9D9D9]'
                            }`}
                        aria-label={`Go to slide ${dot + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}

