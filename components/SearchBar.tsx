'use client'

import { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import { searchProducts } from '@/lib/api'
import Link from 'next/link'

interface SearchSuggestion {
  type: 'product' | 'category' | 'style' | 'tag';
  text: string;
  slug?: string;
}

interface SearchBarProps {
  onSearch: (query: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const searchBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const storedHistory = localStorage.getItem('searchHistory')
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory))
    }
  }, [])

  useEffect(() => {
    if (debouncedQuery.trim()) {
      setIsLoading(true)
      searchProducts(debouncedQuery)
        .then((results) => {
          const newSuggestions: SearchSuggestion[] = []
          results.forEach((product) => {
            if (!newSuggestions.some(s => s.text.toLowerCase() === product.title.toLowerCase())) {
              newSuggestions.push({ type: 'product', text: product.title, slug: product.slug.current })
            }
            product.tags?.forEach((tag) => {
              if (!newSuggestions.some(s => s.text.toLowerCase() === tag.toLowerCase())) {
                newSuggestions.push({ type: 'tag', text: tag })
              }
            })
            if (product.category && !newSuggestions.some(s => s.text.toLowerCase() === product.category.name.toLowerCase())) {
              newSuggestions.push({ type: 'category', text: product.category.name, slug: product.category.slug?.current })
            }
            if (product.style && !newSuggestions.some(s => s.text.toLowerCase() === product.style.name.toLowerCase())) {
              newSuggestions.push({ type: 'style', text: product.style.name, slug: product.style.slug?.current })
            }
          })
          setSuggestions(newSuggestions)
          setShowSuggestions(true)
        })
        .finally(() => setIsLoading(false))
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [debouncedQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query)
      addToSearchHistory(query)
      setShowSuggestions(false)
    }
  }

  const addToSearchHistory = (term: string) => {
    const updatedHistory = [term, ...searchHistory.filter(item => item !== term)].slice(0, 5)
    setSearchHistory(updatedHistory)
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory))
  }

  return (
    <div className="relative w-full" ref={searchBarRef}>
      <form onSubmit={handleSubmit}>
        <input
          type="search"
          placeholder="Search for products..."
          className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-lg focus:outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      </form>
      {showSuggestions && (query || searchHistory.length > 0) && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : suggestions.length > 0 ? (
            <ul>
              {suggestions.map((suggestion, index) => (
                <li key={index}>
                  <Link
                    href={`/shop?search=${encodeURIComponent(suggestion.text)}`}
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      addToSearchHistory(suggestion.text)
                      setShowSuggestions(false)
                    }}
                  >
                    {suggestion.text}
                    <span className="text-xs text-gray-500 ml-2">
                      {suggestion.type === 'product' ? 'Product' :
                       suggestion.type === 'category' ? 'Category' :
                       suggestion.type === 'style' ? 'Style' : 'Tag'}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : query ? (
            <div className="p-4 text-center">No results found</div>
          ) : (
            <ul>
              {searchHistory.map((term, index) => (
                <li key={index}>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setQuery(term)
                      onSearch(term)
                      setShowSuggestions(false)
                    }}
                  >
                    {term}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

