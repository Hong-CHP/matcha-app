import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { Button } from '@/components/ui/button'

export function RootLayout() {
  const { logout } = useAuth()

  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-4 px-6 py-4">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            Matcha
          </Link>
          <nav className="ml-auto flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<Link to="/" />}
            >
              Home
            </Button>
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<Link to="/profile" />}
            >
              Profile
            </Button>
            <Button variant="ghost" size="sm" type="button" onClick={logout}>
              Logout
            </Button>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 sm:px-6 py-8">
        <Outlet />
      </main>
      <footer className="border-t">
        <div className="mx-auto w-full max-w-5xl px-6 py-6 text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Matcha
        </div>
      </footer>
    </div>
  )
}
