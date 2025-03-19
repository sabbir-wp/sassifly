import { ArrowRight, Check, Download, Play, Shield, Star, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen dark">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-black border-b border-zinc-800">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white">
                  Powerful tools for <span className="text-[#AAFF00]">smarter</span> decisions
                </h1>
                <p className="max-w-[600px] text-zinc-400 md:text-xl">
                  Access hundreds of free calculators and tools to help you make better financial decisions, all in one
                  place.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button className="bg-[#AAFF00] text-black hover:bg-[#99EE00]">
                  Explore Tools <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" className="border-zinc-800 text-white hover:bg-zinc-800">
                  Learn More
                </Button>
              </div>
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-black flex items-center justify-center text-xs text-white"
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-zinc-400">
                  <span className="text-white font-medium">10,000+</span> users trust our tools
                </div>
              </div>
            </div>
            <div className="relative lg:ml-auto">
              <div className="relative w-full max-w-[500px] mx-auto">
                <div className="absolute -top-8 -left-8 w-24 h-24 bg-[#AAFF00]/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-[#AAFF00]/20 rounded-full blur-xl"></div>
                <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
                  <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs text-zinc-400">toolhub.app</div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="h-8 bg-zinc-800 rounded-md w-3/4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-zinc-800 rounded-md"></div>
                        <div className="h-4 bg-zinc-800 rounded-md w-5/6"></div>
                        <div className="h-4 bg-zinc-800 rounded-md w-4/6"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="h-20 bg-zinc-800 rounded-md"></div>
                        <div className="h-20 bg-zinc-800 rounded-md"></div>
                      </div>
                      <div className="w-32 h-8 bg-[#AAFF00] rounded-md mx-auto"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-[#AAFF00]/10 to-purple-500/10 blur-3xl rounded-full"></div>
              </div>
              <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-[#AAFF00]/10 to-purple-500/10 blur-3xl rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="w-full py-6 bg-black border-b border-zinc-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4">
            <p className="text-sm text-zinc-500 text-center">TRUSTED BY COMPANIES WORLDWIDE</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16">
              {["COMPANY", "STARTUP", "ENTERPRISE", "BUSINESS", "CORPORATE"].map((name) => (
                <div key={name} className="text-zinc-600 font-semibold text-lg">
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 bg-black border-b border-zinc-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-3 py-1 text-sm text-[#AAFF00]">
                <Zap className="mr-1 h-3 w-3" />
                Powerful Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                All the tools you need
              </h2>
              <p className="mx-auto max-w-[700px] text-zinc-400 md:text-xl">
                Our platform offers a comprehensive suite of calculators and tools to help you make informed decisions.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
            {[
              {
                title: "Financial Calculators",
                description: "Plan your finances with our comprehensive suite of financial calculators.",
                icon: (
                  <svg
                    className="h-10 w-10 text-[#AAFF00]"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                    <path d="M12 12h.01" />
                    <path d="M17 12h.01" />
                    <path d="M7 12h.01" />
                  </svg>
                ),
              },
              {
                title: "Debt Management",
                description: "Take control of your debt with our debt payoff and management tools.",
                icon: (
                  <svg
                    className="h-10 w-10 text-[#AAFF00]"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2v20" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                ),
              },
              {
                title: "Investment Planning",
                description: "Plan your investments and track your portfolio growth over time.",
                icon: (
                  <svg
                    className="h-10 w-10 text-[#AAFF00]"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                ),
              },
              {
                title: "Retirement Planning",
                description: "Secure your future with our retirement planning and calculation tools.",
                icon: (
                  <svg
                    className="h-10 w-10 text-[#AAFF00]"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                ),
              },
              {
                title: "Tax Calculators",
                description: "Estimate your tax liability and plan for tax season with confidence.",
                icon: (
                  <svg
                    className="h-10 w-10 text-[#AAFF00]"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.29 7 12 12 20.71 7" />
                    <line x1="12" x2="12" y1="22" y2="12" />
                  </svg>
                ),
              },
              {
                title: "Business Tools",
                description: "Grow your business with our suite of business planning and analysis tools.",
                icon: (
                  <svg
                    className="h-10 w-10 text-[#AAFF00]"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect height="18" rx="2" width="18" x="3" y="3" />
                    <line x1="3" x2="21" y1="9" y2="9" />
                    <line x1="9" x2="9" y1="21" y2="9" />
                  </svg>
                ),
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex flex-col items-center space-y-2 rounded-lg border border-zinc-800 bg-zinc-950 p-6 text-center"
              >
                <div className="p-3 rounded-full bg-zinc-900">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                <p className="text-zinc-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="w-full py-12 md:py-24 bg-black border-b border-zinc-800">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-3 py-1 text-sm text-[#AAFF00] w-fit">
                <Shield className="mr-1 h-3 w-3" />
                Secure by Design
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                Your data stays <span className="text-[#AAFF00]">private</span>
              </h2>
              <p className="max-w-[600px] text-zinc-400 md:text-xl">
                We don't store your financial data. All calculations happen in your browser, ensuring your sensitive
                information never leaves your device.
              </p>
              <ul className="space-y-2">
                {[
                  "No data storage - calculations happen locally",
                  "No account required to use our tools",
                  "Open source code for transparency",
                  "Regular security audits",
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-zinc-400">
                    <Check className="mr-2 h-5 w-5 text-[#AAFF00]" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
                <Button variant="outline" className="border-zinc-800 text-white hover:bg-zinc-800">
                  Learn About Our Security
                </Button>
              </div>
            </div>
            <div className="relative mx-auto lg:ml-auto">
              <div className="relative w-full max-w-[500px]">
                <div className="absolute -top-8 -left-8 w-24 h-24 bg-[#AAFF00]/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-[#AAFF00]/20 rounded-full blur-xl"></div>
                <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl p-6">
                  <div className="flex items-center justify-center h-64">
                    <Shield className="h-32 w-32 text-[#AAFF00] opacity-20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-[#AAFF00] font-bold text-xl mb-2">Privacy First</div>
                        <div className="text-zinc-400 max-w-xs mx-auto">
                          Your financial data never leaves your device
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {["Encrypted", "No Tracking", "No Storage"].map((label, i) => (
                      <div key={i} className="bg-zinc-800 rounded-md p-2 text-center">
                        <div className="text-xs text-zinc-400">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 bg-[#AAFF00]">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-black">
                Try the tools of the future today
              </h2>
              <p className="mx-auto max-w-[700px] text-zinc-900 md:text-xl">
                Join thousands of users who are making smarter financial decisions with our tools.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button className="bg-black text-white hover:bg-zinc-800">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-black text-black hover:bg-black/10">
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 bg-black border-b border-zinc-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                Watch how easy it is to use our tools
              </h2>
              <p className="mx-auto max-w-[700px] text-zinc-400 md:text-xl">
                Our intuitive interface makes it simple to get the information you need.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-3xl relative">
            <div className="aspect-video bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <Button className="bg-[#AAFF00] text-black hover:bg-[#99EE00] rounded-full w-16 h-16 flex items-center justify-center">
                  <Play className="h-6 w-6" />
                </Button>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "Choose a tool", description: "Select from our wide range of financial tools" },
                { title: "Enter your data", description: "Input your information securely in your browser" },
                { title: "Get results instantly", description: "See calculations and visualizations in real-time" },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-[#AAFF00] text-black flex items-center justify-center font-bold">
                    {i + 1}
                  </div>
                  <h3 className="text-lg font-bold text-white">{step.title}</h3>
                  <p className="text-zinc-400">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-12 md:py-24 bg-black border-b border-zinc-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-3 py-1 text-sm text-[#AAFF00]">
                <Star className="mr-1 h-3 w-3" />
                Testimonials
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                What our users say about us
              </h2>
              <p className="mx-auto max-w-[700px] text-zinc-400 md:text-xl">
                Don't just take our word for it. Here's what our users have to say.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "These tools have completely changed how I manage my finances. The debt payoff calculator helped me create a plan to be debt-free in 2 years.",
                author: "Sarah Johnson",
                role: "Small Business Owner",
              },
              {
                quote:
                  "I've tried many financial calculators, but these are by far the most comprehensive and easy to use. The mortgage calculator saved me thousands.",
                author: "Michael Chen",
                role: "Software Engineer",
              },
              {
                quote:
                  "As a financial advisor, I recommend these tools to all my clients. They're accurate, intuitive, and cover every financial scenario.",
                author: "Jessica Williams",
                role: "Financial Advisor",
              },
            ].map((testimonial, i) => (
              <div key={i} className="flex flex-col space-y-4 rounded-lg border border-zinc-800 bg-zinc-950 p-6">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-[#AAFF00] text-[#AAFF00]" />
                  ))}
                </div>
                <p className="text-zinc-400">"{testimonial.quote}"</p>
                <div className="mt-auto">
                  <div className="font-medium text-white">{testimonial.author}</div>
                  <div className="text-sm text-zinc-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="w-full py-12 md:py-24 bg-black">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                  Start making smarter financial decisions today
                </h2>
                <p className="max-w-[600px] text-zinc-400 md:text-xl">
                  Our tools are completely free to use. No account required, no hidden fees, just powerful calculators
                  at your fingertips.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button className="bg-[#AAFF00] text-black hover:bg-[#99EE00]">
                  <Download className="mr-2 h-4 w-4" />
                  Download Our Guide
                </Button>
                <Button variant="outline" className="border-zinc-800 text-white hover:bg-zinc-800">
                  Contact Us
                </Button>
              </div>
              <div className="flex items-center space-x-4 mt-4">
                <div className="text-sm text-zinc-400">
                  <span className="text-white font-medium">100% Free</span> • No account needed
                </div>
              </div>
            </div>
            <div className="relative mx-auto lg:ml-auto">
              <div className="grid grid-cols-2 gap-4 lg:gap-8">
                <div className="space-y-4 lg:space-y-8">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 h-40"></div>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 h-60"></div>
                </div>
                <div className="space-y-4 lg:space-y-8 mt-8">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 h-60"></div>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 h-40"></div>
                </div>
              </div>
              <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-[#AAFF00]/10 to-purple-500/10 blur-3xl rounded-full"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

