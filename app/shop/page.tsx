import Image from "next/image";
import Navbar from "@/components/navbar";
import ProductCard from "@/components/product-card";
import Newsletter from "@/components/newsletter";
import Footer from "@/components/footer";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ShopPage() {
  const filters = [
    { name: "All Products", count: products.length },
    { name: "Electronics", count: 12 },
    { name: "Fashion", count: 18 },
    { name: "Home & Living", count: 15 },
    { name: "Sports", count: 9 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <Badge className="mb-6 animate-fade-up bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0">
              ✨ Shop All Products
            </Badge>
            <h1 className="text-5xl font-black leading-tight tracking-tight sm:text-6xl animate-slide-in-left">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Discover
              </span>{" "}
              Amazing Products
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-in-right delay-100">
              Explore our curated collection of premium products designed to
              elevate your lifestyle.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 border-b bg-background/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {filters.map((filter, index) => (
                <Button
                  key={filter.name}
                  variant={index === 0 ? "default" : "outline"}
                  className={
                    index === 0
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 animate-scale-in"
                      : "animate-scale-in hover:border-indigo-400"
                  }
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {filter.name}
                  <Badge variant="secondary" className="ml-2">
                    {filter.count}
                  </Badge>
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Button variant="outline" size="sm">
                Newest ↓
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, index) => (
              <div
                key={product.id}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 dark:border-indigo-800 dark:hover:border-indigo-600 px-8 animate-fade-up"
            >
              Load More Products
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-slide-in-left">
              <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white border-0">
                🔥 Hot Deal
              </Badge>
              <h2 className="text-4xl font-bold">
                Special Offer
                <br />
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Bundle & Save 30%
                </span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Create your perfect bundle and enjoy massive savings on multiple
                items.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg px-8"
              >
                Start Shopping
              </Button>
            </div>

            <div className="relative animate-slide-in-right">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://picsum.photos/seed/shopbanner/800/800"
                  alt="Shop Banner"
                  width={800}
                  height={800}
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl opacity-20" />
            </div>
          </div>
        </div>
      </section>

      <Newsletter />

      <Footer />
    </div>
  );
}
