import { Calendar, DollarSign, ShoppingBag, Wallet } from 'lucide-react'
import {inter, integralCF} from "@/app/ui/fonts"


const stats = [
    {
        icon: Calendar,
        number: "10.5k",
        label: "Sellers active our site",
    },
    {
        icon: DollarSign,
        number: "33k",
        label: "Monthly Produduct Sale",
    },
    {
        icon: ShoppingBag,
        number: "35.5k",
        label: "Customer active in our site",
    },
    {
        icon: Wallet,
        number: "25k",
        label: "Anual gross sale in our site",
    }
]

export default function SiteStats() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat, index) => (
                    <div 
                        key={index}
                        className={`group relative p-8 flex flex-col items-center justify-center text-center border rounded-sm transition-colors duration-300 bg-white text-black hover:bg-[#DB4444] hover:text-white cursor-pointer`}
                    >
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-black/10`}>
                            <stat.icon className={`w-8 h-8 text-black group-hover:text-white`} />
                        </div>
                        <div className={`text-[32px] font-semibold mb-1 ${integralCF.className}`}>{stat.number}</div>
                        <div className={`text-base text-gray-600 group-hover:text-white ${inter.className}`}>{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

