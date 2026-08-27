import { Label } from "@/components/ui/label"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "@/components/ui/sidebar"
import { SearchIcon } from "lucide-react"
import { useState } from 'react'
import * as discoveryApi from '@/api/discovery'
import { useAuth } from "@/auth/useAuth"
import { ApiError } from "@/api/client"
import { resolveErrorMessage } from "@/i18n/errors"

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  const { accessToken, logout } = useAuth()
  const [inputValue, setInputValue] = useState<string>("")
  const [seachingBarProfileList, setSeachingBarProfileList] = useState<SearchingBarProfile[]>([])
  const [serverError, setServerError] = useState<string | null>(null)
  
  const handleSubmit = async () => {
    if (!accessToken) return
    setServerError(null)
    try {
      const result = await discoveryApi.getSeachingBarProfiles(accessToken, inputValue)
      setSeachingBarProfileList(result) 
    } catch (err) {
      if (err instanceof ApiError) {
        setServerError(resolveErrorMessage(err.code, err.message))
        if (err.code === "USER_NOT_FOUND")
          logout()
      }
    } finally {
      setInputValue("")
    }
  }

  return (
    <form {...props} onSubmit={handleSubmit}>
      <SidebarGroup className="py-0">
        <SidebarGroupContent className="relative">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <SidebarInput
            id="search"
            placeholder="Searching for the one..."
            className="pl-8 pr-20"
            value={inputValue ?? null}
            onChange={e=>setInputValue(e.target.value)}
          />
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  )
}
