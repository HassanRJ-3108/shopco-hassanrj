import Link from 'next/link'

export const menuItems = [
  {
    title: "Men's clothes",
    subtitle: "In attractive and spectacular colors and designs",
    href: "/shop?category=Men"
  },
  {
    title: "Women's clothes",
    subtitle: "Ladies, your style and tastes are important to us",
    href: "/shop?category=Women"
  },
  {
    title: "Formal Style",
    subtitle: "For all ages, with happy and beautiful colors",
    href: "/shop?style=formal"
  },
  {
    title: "Casual",
    subtitle: "Suitable for men, women and all tastes and styles",
    href: "/shop?style=casual"
  }
]

export function ShopMenu() {
  return (
    <div className="absolute top-full left-0 w-[600px] bg-white shadow-lg rounded-lg p-6 grid grid-cols-2 gap-6 z-50">
      {menuItems.map((item) => (
        <Link 
          key={item.title} 
          href={item.href}
          className="block group"
        >
          <h3 className="text-base font-medium group-hover:text-gray-600">
            {item.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {item.subtitle}
          </p>
        </Link>
      ))}
    </div>
  )
}

