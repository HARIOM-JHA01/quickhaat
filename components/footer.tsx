export default function Footer() {
  return (
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
  );
}
