import Link from "next/link"
import { Calculator, ChevronRight, Clock, CreditCard, Home, Search, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function BrowseToolsPage() {
  const categories = [
    { name: "Finance", count: 12 },
    { name: "Real Estate", count: 8 },
    { name: "Business", count: 6 },
    { name: "Investing", count: 5 },
    { name: "Automotive", count: 3 },
    { name: "Retirement", count: 4 },
    { name: "Tax", count: 7 },
    { name: "Debt", count: 5 },
  ]

  const popularSearches = ["mortgage", "retirement", "debt payoff", "investment", "tax", "budget", "loan", "car"]

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center space-y-4 text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Browse Tools</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Find the perfect calculator for your financial needs
        </p>
        <div className="w-full max-w-2xl flex items-center space-x-2">
          <Input type="text" placeholder="Search tools..." className="flex-1" />
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 justify-center mt-2">
          {popularSearches.map((term) => (
            <Button key={term} variant="outline" size="sm" className="text-xs">
              {term}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="sticky top-20 space-y-6">
            <div>
              <h3 className="font-medium mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.name} className="flex justify-between items-center group">
                    <Link
                      href={`/tools/browse?category=${category.name.toLowerCase()}`}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {category.name}
                    </Link>
                    <span className="text-xs text-muted-foreground">{category.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Filter By</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input type="checkbox" id="featured" className="mr-2" />
                  <label htmlFor="featured" className="text-sm text-muted-foreground">
                    Featured Tools
                  </label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="new" className="mr-2" />
                  <label htmlFor="new" className="text-sm text-muted-foreground">
                    New Tools
                  </label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="popular" className="mr-2" />
                  <label htmlFor="popular" className="text-sm text-muted-foreground">
                    Most Popular
                  </label>
                </div>
              </div>
            </div>

            <Button className="w-full">Apply Filters</Button>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">All Tools</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select className="bg-background border border-input rounded-md text-sm p-1">
                <option>Popularity</option>
                <option>Newest</option>
                <option>A-Z</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                id: "home-sale-calculator",
                title: "Home Sale Proceeds Calculator",
                description: "Calculate how much you'll take home after selling your property.",
                icon: <Home className="h-6 w-6" />,
                category: "Real Estate",
                featured: true,
              },
              {
                id: "car-loan-calculator",
                title: "Car Loan Calculator",
                description: "Estimate your monthly payments and total interest for auto loans.",
                icon: <CreditCard className="h-6 w-6" />,
                category: "Automotive",
                featured: true,
              },
              {
                id: "debt-payoff-calculator",
                title: "Debt Payoff Calculator",
                description: "Plan your debt repayment strategy and see when you'll be debt-free.",
                icon: <Clock className="h-6 w-6" />,
                category: "Finance",
                featured: true,
              },
              {
                id: "affiliate-calculator",
                title: "Affiliate Commission Calculator",
                description: "Calculate potential earnings from your affiliate marketing efforts.",
                icon: <Calculator className="h-6 w-6" />,
                category: "Business",
                featured: true,
              },
              {
                id: "mortgage-calculator",
                title: "Mortgage Calculator",
                description: "Calculate your monthly mortgage payments and amortization schedule.",
                icon: <Home className="h-6 w-6" />,
                category: "Real Estate",
                featured: false,
              },
              {
                id: "investment-calculator",
                title: "Investment Growth Calculator",
                description: "See how your investments could grow over time with compound interest.",
                icon: <Zap className="h-6 w-6" />,
                category: "Investing",
                featured: false,
              },
            ].map((tool) => (
              <Card key={tool.id} className="flex flex-col h-full transition-all hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {tool.icon}
                    <CardTitle>{tool.title}</CardTitle>
                  </div>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="inline-block rounded-full px-3 py-1 text-xs bg-muted">{tool.category}</div>
                  {tool.featured && (
                    <div className="inline-block rounded-full px-3 py-1 text-xs bg-primary/20 text-primary ml-2">
                      Featured
                    </div>
                  )}
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/tools/${tool.id}`}>
                      Use Tool <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

