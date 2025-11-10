import Image from "next/image";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import ProductCard from "@/components/product-card";
import Newsletter from "@/components/newsletter";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const categories = [
    { name: "Electronics", icon: "⚡", color: "from-blue-500 to-cyan-500" },
    { name: "Fashion", icon: "👕", color: "from-pink-500 to-rose-500" },
    {
      name: "Home & Living",
      icon: "🏠",
      color: "from-green-500 to-emerald-500",
    },
    { name: "Sports", icon: "⚽", color: "from-orange-500 to-amber-500" },
  ];

  const features = [
    {
      icon: "🚚",
      title: "Free Shipping",
      description: "On orders over $50",
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      icon: "🔒",
      title: "Secure Payment",
      description: "100% protected transactions",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: "↩️",
      title: "Easy Returns",
      description: "30-day return policy",
      gradient: "from-green-500 to-teal-500",
    },
    {
      icon: "💎",
      title: "Premium Quality",
      description: "Curated products only",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <Hero />

      <section className="py-16 bg-gradient-to-b from-background to-muted/20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-up">
            <Badge className="mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 text-sm px-4 py-1">
              Popular Categories
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">Shop by Category</h2>
            <p className="mt-3 text-muted-foreground text-lg">
              Explore our diverse range of premium products
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up delay-100">
            {categories.map((category, index) => (
              <div
                key={category.name}
                className="group relative overflow-hidden rounded-2xl bg-card border-2 border-border hover:border-transparent p-6 text-center cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />
                <div className="relative z-10">
                  <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-up">
            <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-sm px-4 py-1">
              Trending Now
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Featured Products
              </span>
            </h2>
            <p className="mt-3 text-muted-foreground text-lg max-w-2xl mx-auto">
              Handpicked selection of the best products for you
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, index) => (
              <div
                key={product.id}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div className="text-center mt-12 animate-fade-up delay-300">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 dark:border-indigo-800 dark:hover:border-indigo-600 px-8"
            >
              View All Products →
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="relative group overflow-hidden rounded-2xl bg-card border p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />
                <div className="relative z-10">
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative animate-slide-in-left">
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://picsum.photos/seed/promo1/800/800"
                  alt="Promo"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full blur-3xl opacity-20" />
            </div>

            <div className="space-y-6 animate-slide-in-right">
              <Badge className="bg-gradient-to-r from-green-500 to-teal-500 text-white border-0 text-sm px-4 py-1">
                Limited Time Offer
              </Badge>
              <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
                Summer Sale
                <br />
                <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                  Up to 50% Off
                </span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Don't miss out on amazing deals on your favorite products.
                Limited time only - while stocks last!
              </p>
              <div className="flex gap-4 pt-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8"
                >
                  Shop Sale
                </Button>
                <Button size="lg" variant="outline" className="border-2 px-8">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Newsletter />

      <footer className="border-t bg-gradient-to-b from-muted/30 to-background py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-xl mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Quickhaat
              </h3>
              <p className="text-sm text-muted-foreground">
                Your trusted destination for premium products and exceptional
                service.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground transition-colors cursor-pointer">
                  All Products
                </li>
                <li className="hover:text-foreground transition-colors cursor-pointer">
                  Best Sellers
                </li>
                <li className="hover:text-foreground transition-colors cursor-pointer">
                  New Arrivals
                </li>
                <li className="hover:text-foreground transition-colors cursor-pointer">
                  Sale
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground transition-colors cursor-pointer">
                  Contact Us
                </li>
                <li className="hover:text-foreground transition-colors cursor-pointer">
                  FAQs
                </li>
                <li className="hover:text-foreground transition-colors cursor-pointer">
                  Shipping Info
                </li>
                <li className="hover:text-foreground transition-colors cursor-pointer">
                  Returns
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground transition-colors cursor-pointer">
                  About Us
                </li>
                <li className="hover:text-foreground transition-colors cursor-pointer">
                  Careers
                </li>
                <li className="hover:text-foreground transition-colors cursor-pointer">
                  Privacy Policy
                </li>
                <li className="hover:text-foreground transition-colors cursor-pointer">
                  Terms of Service
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Quickhaat. All rights reserved.
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white cursor-pointer hover:shadow-lg transition-all duration-300">
                f
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white cursor-pointer hover:shadow-lg transition-all duration-300">
                📷
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white cursor-pointer hover:shadow-lg transition-all duration-300">
                🐦
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
