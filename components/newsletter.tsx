import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Newsletter() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-12 shadow-2xl animate-gradient">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC02LjYyNyA1LjM3My0xMiAxMi0xMnMxMiA1LjM3MyAxMiAxMi01LjM3MyAxMi0xMiAxMi0xMi01LjM3My0xMi0xMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-block mb-4 animate-scale-in">
            <span className="text-5xl">📬</span>
          </div>

          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4 animate-fade-up">
            Stay in the Loop
          </h3>

          <p className="text-lg text-white/90 mb-8 animate-fade-up delay-100">
            Subscribe to get special offers, early access to new products, and
            insider news.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto animate-fade-up delay-200">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-12 bg-white/95 backdrop-blur-sm border-0 text-gray-900 placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-white shadow-lg"
            />
            <Button
              size="lg"
              className="h-12 bg-white text-indigo-600 hover:bg-white/90 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 px-8"
            >
              Subscribe
            </Button>
          </div>

          <p className="text-sm text-white/70 mt-4 animate-fade-in delay-300">
            🎁 Get 15% off your first purchase when you subscribe!
          </p>
        </div>

        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
      </div>
    </section>
  );
}
