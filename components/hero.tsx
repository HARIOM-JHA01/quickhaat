import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 py-24 lg:py-32">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="max-w-2xl">
            <Badge className="mb-6 animate-fade-up bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0">
              ✨ New Collection Available
            </Badge>

            <h1 className="text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl animate-slide-in-left">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Elevate
              </span>{" "}
              Your Lifestyle
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-muted-foreground animate-slide-in-left delay-100">
              Discover premium products crafted with precision. From tech to
              fashion, find everything that defines modern elegance and
              functionality.
            </p>

            <div className="mt-10 flex flex-wrap gap-4 animate-slide-in-left delay-200">
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-base px-8"
              >
                Shop Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 dark:border-indigo-800 dark:hover:border-indigo-600 text-base px-8"
              >
                View Collections
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 animate-fade-up delay-300">
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  10K+
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Happy Customers
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  500+
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Premium Products
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  4.9★
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Average Rating
                </div>
              </div>
            </div>
          </div>

          <div className="relative lg:ml-auto">
            <div className="relative grid grid-cols-2 gap-4 animate-scale-in delay-200">
              <div className="space-y-4">
                <div className="relative aspect-square overflow-hidden rounded-3xl shadow-2xl animate-float">
                  <Image
                    src="https://picsum.photos/seed/hero1/600/600"
                    alt="Featured Product 1"
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    priority
                  />
                </div>
                <div className="relative aspect-video overflow-hidden rounded-3xl shadow-xl animate-float delay-200">
                  <Image
                    src="https://picsum.photos/seed/hero2/600/400"
                    alt="Featured Product 2"
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative aspect-video overflow-hidden rounded-3xl shadow-xl animate-float delay-100">
                  <Image
                    src="https://picsum.photos/seed/hero3/600/400"
                    alt="Featured Product 3"
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="relative aspect-square overflow-hidden rounded-3xl shadow-2xl animate-float delay-300">
                  <Image
                    src="https://picsum.photos/seed/hero4/600/600"
                    alt="Featured Product 4"
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-3xl opacity-30 animate-pulse-glow" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full blur-3xl opacity-30 animate-pulse-glow delay-500" />
          </div>
        </div>
      </div>
    </section>
  );
}
