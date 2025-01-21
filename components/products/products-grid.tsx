"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronRight, SlidersHorizontal, ChevronDown, PackageX } from "lucide-react"
import { ProductCard } from "./product-card"
import { Filters } from "./filters"
import { cn } from "@/lib/utils"
import { satoshi } from "@/app/ui/fonts"
import Link from "next/link"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import type { Product } from "@/types/product"
import PaginationRounded from "./Pagination"
import { motion, AnimatePresence } from "framer-motion"
import { searchProducts } from "@/lib/api"

const sortOptions = [
  { label: "Most Popular", value: "most-popular" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-low-high" },
  { label: "Price: High to Low", value: "price-high-low" },
]

const PRODUCTS_PER_PAGE = 9

export function ProductGrid({
  initialProducts,
  categories,
  styles,
}: { initialProducts: Product[]; categories: string[]; styles: string[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedSort, setSelectedSort] = useState(sortOptions[0])
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts)
  const [isLoading, setIsLoading] = useState(false)

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  const paginatedProducts = filteredProducts?.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  )

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value)
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      const selectedCategories = searchParams.getAll("category")
      const selectedStyles = searchParams.getAll("style")
      const minPrice = Number(searchParams.get("minPrice")) || 0
      const maxPrice = Number(searchParams.get("maxPrice")) || Number.POSITIVE_INFINITY
      const rating = Number(searchParams.get("rating")) || 0
      const sort = searchParams.get("sort") || "most-popular"
      const newArrivals = searchParams.get("newArrivals") === "true"
      const topSelling = searchParams.get("topSelling") === "true"
      const searchQuery = searchParams.get("search") || ""

      let products = initialProducts

      if (searchQuery) {
        products = await searchProducts(searchQuery)
      }

      const filtered = products.filter((product) => {
        const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category.name)
        const styleMatch = selectedStyles.length === 0 || selectedStyles.includes(product.style.name)
        const priceMatch = product.price >= minPrice && product.price <= maxPrice
        const ratingMatch = product.rating >= rating
        const newArrivalMatch = !newArrivals || product.isNewArrival
        const topSellingMatch = !topSelling || product.isTopSelling

        return categoryMatch && styleMatch && priceMatch && ratingMatch && newArrivalMatch && topSellingMatch
      })

      // Apply sorting
      switch (sort) {
        case "newest":
          filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          break
        case "price-low-high":
          filtered.sort((a, b) => a.price - b.price)
          break
        case "price-high-low":
          filtered.sort((a, b) => b.price - a.price)
          break
        // For 'most-popular', we assume it's the default order
      }

      setFilteredProducts(filtered)
      setSelectedSort(sortOptions.find((option) => option.value === sort) || sortOptions[0])
      setCurrentPage(1)
      setIsLoading(false)
    }

    fetchProducts()
  }, [searchParams, initialProducts])

  const updateFilters = (newFilters: Record<string, string[]>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    Object.entries(newFilters).forEach(([key, values]) => {
      current.delete(key)
      values.forEach((value) => current.append(key, value))
    })
    const search = current.toString()
    const query = search ? `?${search}` : ""
    router.push(`${window.location.pathname}${query}`, { scroll: false })
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-900">All Products</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <h1 className={cn("text-xl sm:text-2xl lg:text-3xl font-bold", satoshi.className)}>All Products</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="text-gray-500 text-sm sm:text-base font-normal">
              Showing {(currentPage - 1) * PRODUCTS_PER_PAGE + 1}-
              {Math.min(currentPage * PRODUCTS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} Products
            </span>
            <div className="flex items-center gap-4">
              <button
                className="sm:hidden flex items-center gap-2 px-3 py-2 border rounded-lg"
                onClick={() => setIsFilterOpen(true)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="text-sm">Filters</span>
              </button>

              <DropdownMenu.Root>
                <DropdownMenu.Trigger className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:border-black transition-colors">
                  <span className="text-sm">Sort by: {selectedSort.label}</span>
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content className="bg-white rounded-lg shadow-lg border p-1 min-w-[200px]">
                    {sortOptions.map((option) => (
                      <DropdownMenu.Item
                        key={option.value}
                        className={cn(
                          "flex items-center px-3 py-2 text-sm rounded-md cursor-pointer outline-none",
                          option.value === selectedSort.value ? "bg-gray-100" : "hover:bg-gray-50",
                        )}
                        onClick={() => {
                          setSelectedSort(option)
                          updateFilters({ sort: [option.value] })
                        }}
                      >
                        {option.label}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block">
            <Filters
              categories={categories}
              styles={styles}
              updateFilters={updateFilters}
              searchParams={searchParams}
            />
          </div>

          {/* Mobile Filters */}
          <Filters
            isMobile
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            categories={categories}
            styles={styles}
            updateFilters={updateFilters}
            searchParams={searchParams}
          />

          {/* Product Grid */}
          <div className="flex-1 flex flex-col" style={{ minHeight: "calc(100vh - 200px)" }}>
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center h-64"
                >
                  <p className="text-xl">Loading...</p>
                </motion.div>
              ) : (
                <motion.div
                  key={searchParams.toString()}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-grow grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-6"
                >
                  {paginatedProducts && paginatedProducts.length > 0 ? (
                    paginatedProducts.map((product) => (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Link href={`/shop/${product.slug.current}`} className="cursor-pointer">
                          <ProductCard
                            _id={product._id}
                            title={product.title}
                            price={product.price}
                            originalPrice={product.originalPrice}
                            rating={product.rating}
                            imageUrl={product.images && product.images.length > 0 ? product.images[0] : ""}
                            slug={product.slug}
                            category={product.category}
                            style={product.style}
                            colors={product.colors}
                            sizes={product.sizes}
                          />
                        </Link>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      className="col-span-full flex flex-col items-center justify-center text-gray-500"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <PackageX size={48} />
                      <p className="mt-4 text-lg font-medium">No products found</p>
                      <p className="mt-2 text-sm">Try adjusting your filters or search criteria</p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {!isLoading && (
              <div className="mt-8 sm:mt-12 flex items-center justify-center">
                <PaginationRounded count={totalPages} page={currentPage} onChange={handlePageChange} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

