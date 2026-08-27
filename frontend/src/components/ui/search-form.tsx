import { Label } from "@/components/ui/label"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "@/components/ui/sidebar"
import { SearchIcon } from "lucide-react"
import { useEffect, useRef, useState } from 'react'
import * as discoveryApi from '@/api/discovery'
import { useAuth } from "@/auth/useAuth"
import { ApiError } from "@/api/client"
import { resolveErrorMessage } from "@/i18n/errors"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  const { accessToken, logout } = useAuth()
  const [inputValue, setInputValue] = useState<string>("")
  const [seachingBarProfileList, setSeachingBarProfileList] = useState<SearchingBarProfile[]>([])
  const [serverError, setServerError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const requestIdRef = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(()=>{
    if (!accessToken) return
    setServerError(null)
    const trimmed = inputValue.trim()
    if (trimmed.length === 0) {
      setInputValue("")
      setSeachingBarProfileList([])
      return
    }
    setIsLoading(true)
    const currentRequestId = ++requestIdRef.current
    const timer = setTimeout(async ()=>{
      try {
        const result = await discoveryApi.getSeachingBarProfiles(accessToken, trimmed)
        if (currentRequestId === requestIdRef.current) {
          setSeachingBarProfileList(result)
          setIsOpen(p=>!p)
        }
      } catch (err) {
        if (err instanceof ApiError) {
          setServerError(resolveErrorMessage(err.code, err.message))
          if (err.code === "USER_NOT_FOUND")
            logout()
        }
      } finally {
        if (currentRequestId === requestIdRef.current) {
          setIsLoading(false)
        }
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [accessToken, logout, inputValue])

  return (
    <form {...props}>
      <SidebarGroup className="py-0" ref={containerRef}>
        <SidebarGroupContent className="relative">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <SidebarInput
            id="search"
            placeholder="Searching for the one..."
            className="pl-8 pr-20"
            value={inputValue ?? ""}
            onChange={e=>setInputValue(e.target.value)}
          />
          {isOpen && seachingBarProfileList.length > 0 && (
            <ScrollArea className="h-72 w-48 rounded-md border">
              <div className="p-4">
                <h4 className="mb-4 text-sm leading-none font-medium">Search results</h4>
                {seachingBarProfileList.map((profile) => (
                  <div key={profile.id}>
                    <div className="text-sm">{profile.first_name} {profile.last_name}(profile.username)</div>
                    <Separator className="my-2" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          {isOpen && !isLoading && seachingBarProfileList.length === 0 && (
            <ScrollArea className="h-72 w-48 rounded-md border">
              <div className="p-4">
                <h4 className="mb-4 text-sm leading-none font-medium">Search results</h4>
                  <div>
                    <div className="text-sm">User is not exists.</div>
                  </div>
              </div>
            </ScrollArea>
          )}
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  )
}
