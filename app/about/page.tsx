import Image from "next/image";
import Navbar from "@/components/navbar";
import Newsletter from "@/components/newsletter";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  const values = [
    {
      icon: "💎",
      title: "Quality First",
      description:
        "We curate only the finest products from trusted brands and manufacturers.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: "🌍",
      title: "Sustainable",
      description:
        "Committed to eco-friendly practices and responsible sourcing.",
      gradient: "from-green-500 to-teal-500",
    },
    {
      icon: "❤️",
      title: "Customer Centric",
      description:
        "Your satisfaction is our priority. We're here for you 24/7.",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      icon: "⚡",
      title: "Innovation",
      description:
        "Constantly evolving to bring you the latest trends and technology.",
      gradient: "from-orange-500 to-yellow-500",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "https://picsum.photos/seed/sarah/400/400",
    },
    {
      name: "Michael Chen",
      role: "Head of Design",
      image: "https://picsum.photos/seed/michael/400/400",
    },
    {
      name: "Emily Rodriguez",
      role: "Product Director",
      image: "https://picsum.photos/seed/emily/400/400",
    },
    {
      name: "David Kim",
      role: "Customer Success",
      image: "https://picsum.photos/seed/david/400/400",
    },
  ];

  const stats = [
    { value: "10K+", label: "Happy Customers" },
    { value: "500+", label: "Premium Products" },
    { value: "50+", label: "Brand Partners" },
    { value: "4.9★", label: "Average Rating" },
  ];

  const timeline = [
    {
      year: "2020",
      title: "The Beginning",
      description: "Founded with a vision to revolutionize online shopping.",
    },
    {
      year: "2021",
      title: "Rapid Growth",
      description:
        "Expanded to 50+ brand partnerships and 5,000 happy customers.",
    },
    {
      year: "2023",
      title: "Going Global",
      description: "Launched international shipping to 20+ countries.",
    },
    {
      year: "2025",
      title: "Innovation Leader",
      description:
        "Reached 10,000+ customers and introduced AI-powered recommendations.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 py-24 lg:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2ZjEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-6 animate-fade-up bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                👋 About Us
              </Badge>
              <h1 className="text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl animate-slide-in-left">
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Redefining
                </span>{" "}
                E-Commerce
              </h1>
              <p className="mt-6 text-lg text-muted-foreground animate-slide-in-left delay-100">
                We're on a mission to make premium products accessible to
                everyone. Founded in 2020, Quickhaat has grown from a small
                startup to a trusted destination for quality goods and
                exceptional service.
              </p>
              <div className="mt-8 flex gap-4 animate-slide-in-left delay-200">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg px-8"
                >
                  Join Our Journey
                </Button>
                <Button size="lg" variant="outline" className="border-2 px-8">
                  Contact Us
                </Button>
              </div>
            </div>

            <div className="relative animate-scale-in delay-200">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://picsum.photos/seed/aboutus/800/800"
                  alt="About Quickhaat"
                  width={800}
                  height={800}
                  className="object-cover"
                />
              </div>
              <div className="absolute -top-6 -right-6 w-48 h-48 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-3xl opacity-20 animate-pulse-glow" />
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl opacity-20 animate-pulse-glow delay-500" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-up">
            <Badge className="mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0">
              📊 Our Impact
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">By The Numbers</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card
                key={stat.label}
                className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-up">
            <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
              💡 Our Values
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">
              What We Stand For
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Our core values guide everything we do, from product selection to
              customer service.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card
                key={value.title}
                className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  />
                  <div className="relative z-10">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${value.gradient} text-white text-3xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-up">
            <Badge className="mb-4 bg-gradient-to-r from-green-500 to-teal-500 text-white border-0">
              📅 Our Journey
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">The Story So Far</h2>
          </div>

          <div className="max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <div
                key={item.year}
                className="relative pl-8 pb-12 last:pb-0 animate-slide-in-left"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500" />
                <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 -translate-x-[7px] shadow-lg" />

                <div className="bg-card border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-3">
                    <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0">
                      {item.year}
                    </Badge>
                    <h3 className="text-xl font-bold">{item.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-up">
            <Badge className="mb-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white border-0">
              👥 Meet The Team
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">
              The People Behind Quickhaat
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Passionate individuals working together to create the best
              shopping experience.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card
                key={member.name}
                className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {member.role}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />

      <Footer />
    </div>
  );
}
