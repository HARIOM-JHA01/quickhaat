import Image from "next/image";
import Navbar from "@/components/navbar";
import Newsletter from "@/components/newsletter";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function CollectionsPage() {
  const collections = [
    {
      id: 1,
      name: "Summer Essentials",
      description: "Beat the heat with our curated summer collection",
      image: "https://picsum.photos/seed/summer/800/600",
      itemCount: 24,
      gradient: "from-orange-500 to-pink-500",
    },
    {
      id: 2,
      name: "Tech Innovations",
      description: "Latest gadgets and cutting-edge technology",
      image: "https://picsum.photos/seed/tech/800/600",
      itemCount: 18,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: 3,
      name: "Urban Style",
      description: "Contemporary fashion for modern living",
      image: "https://picsum.photos/seed/urban/800/600",
      itemCount: 32,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: 4,
      name: "Workspace Essentials",
      description: "Productivity tools for your perfect setup",
      image: "https://picsum.photos/seed/workspace/800/600",
      itemCount: 21,
      gradient: "from-green-500 to-teal-500",
    },
    {
      id: 5,
      name: "Fitness & Wellness",
      description: "Stay healthy and active with our selection",
      image: "https://picsum.photos/seed/fitness/800/600",
      itemCount: 15,
      gradient: "from-red-500 to-orange-500",
    },
    {
      id: 6,
      name: "Luxury Living",
      description: "Premium products for sophisticated tastes",
      image: "https://picsum.photos/seed/luxury/800/600",
      itemCount: 27,
      gradient: "from-indigo-500 to-purple-500",
    },
  ];

  const featured = [
    {
      title: "New Arrivals",
      subtitle: "Fresh picks just for you",
      image: "https://picsum.photos/seed/newarrivals/600/400",
      icon: "✨",
    },
    {
      title: "Best Sellers",
      subtitle: "Customer favorites",
      image: "https://picsum.photos/seed/bestsellers/600/400",
      icon: "🔥",
    },
    {
      title: "Limited Edition",
      subtitle: "Exclusive releases",
      image: "https://picsum.photos/seed/limited/600/400",
      icon: "💎",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950 dark:via-pink-950 dark:to-rose-950 py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-6 animate-fade-up bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
              🎨 Curated Collections
            </Badge>
            <h1 className="text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl animate-slide-in-left">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                Explore
              </span>{" "}
              Our Collections
            </h1>
            <p className="mt-6 text-lg text-muted-foreground animate-slide-in-right delay-100">
              Carefully curated collections designed to match your unique style
              and needs. Discover products organized by theme, season, and
              lifestyle.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-3 mb-12">
            {featured.map((item, index) => (
              <Card
                key={item.title}
                className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="text-3xl mb-2">{item.icon}</div>
                      <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                      <p className="text-sm text-white/80">{item.subtitle}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mb-8 animate-fade-up delay-300">
            <h2 className="text-3xl font-bold mb-2">All Collections</h2>
            <p className="text-muted-foreground">
              Browse through our themed collections
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection, index) => (
              <Card
                key={collection.id}
                className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={collection.image}
                      alt={collection.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                    <Badge
                      className={`absolute top-4 right-4 bg-gradient-to-r ${collection.gradient} text-white border-0 shadow-lg`}
                    >
                      {collection.itemCount} Items
                    </Badge>

                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300 group-hover:translate-y-[-4px]">
                      <h3 className="text-2xl font-bold mb-2">
                        {collection.name}
                      </h3>
                      <p className="text-sm text-white/90 mb-4">
                        {collection.description}
                      </p>
                      <Button
                        size="sm"
                        className="bg-white text-black hover:bg-white/90 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                      >
                        Explore Collection →
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative animate-slide-in-left">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://picsum.photos/seed/seasonal/800/800"
                  alt="Seasonal Collection"
                  width={800}
                  height={800}
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full blur-3xl opacity-20" />
            </div>

            <div className="space-y-6 animate-slide-in-right">
              <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0">
                🌟 Seasonal Spotlight
              </Badge>
              <h2 className="text-4xl sm:text-5xl font-bold">
                This Season's
                <br />
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Must-Have Collection
                </span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Discover our handpicked seasonal collection featuring the latest
                trends and timeless classics perfectly suited for the current
                season.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white">
                    ✓
                  </div>
                  <span>Exclusive seasonal designs</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                    ✓
                  </div>
                  <span>Limited time availability</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                    ✓
                  </div>
                  <span>Premium quality materials</span>
                </li>
              </ul>
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg px-8"
              >
                Shop Seasonal Collection
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Newsletter />

      <Footer />
    </div>
  );
}
