import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b shadow-sm animate-fade-in">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
            Q
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Quickhaat
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/shop"
            className="text-sm font-medium hover:text-indigo-600 transition-colors relative group"
          >
            Shop
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300" />
          </Link>
          <Link
            href="/collections"
            className="text-sm font-medium hover:text-indigo-600 transition-colors relative group"
          >
            Collections
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300" />
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium hover:text-indigo-600 transition-colors relative group"
          >
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300" />
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button size="sm" variant="ghost" className="relative">
            🛒
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0 p-0 flex items-center justify-center text-xs">
              3
            </Badge>
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
          >
            Sign In
          </Button>
        </div>
      </div>
    </header>
  );
}
