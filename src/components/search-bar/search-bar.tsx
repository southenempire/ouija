'use client'

import { LoadCircle } from '@/components/common/load-circle'
import { Input } from '@/components/form/input'
import { useSearch } from '@/components/search-bar/hooks/use-search'
import { ISearch } from '@/models/profile.models'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export function SearchBar() {
  const { searchResults, loading, error, search } = useSearch()
  const [query, setQuery] = useState('')
  const lastSearchedQueryRef = useRef('')

  useEffect(() => {
    if (!query || query === lastSearchedQueryRef.current) return

    const delayDebounceFn = setTimeout(() => {
      search(query)
      lastSearchedQueryRef.current = query
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [query, search])

  return (
    <div className="w-full mb-6">
      <h2 className="text-xl mb-3">Search bar</h2>
      <div>
        <div className="w-full flex">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            name="query"
            placeholder="type here ..."
          />
        </div>

        {query && (
          <div className="mt-4 max-h-[200px] overflow-auto border-2 border-muted rounded-sm p-4">
            {loading && (
              <div className="flex items-center justify-center">
                <LoadCircle />
              </div>
            )}
            {error && <p className="text-error">{error}</p>}
            {!!searchResults &&
              searchResults.profiles?.map((elem: ISearch) => (
                <div key={elem.profile.id} className="mb-4">
                  <Link href={`/${elem.profile?.username}`}>
                    <p className="truncate font-bold hover:underline">
                      {elem.profile?.username}
                    </p>
                  </Link>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
