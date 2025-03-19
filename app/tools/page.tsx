"use client"

import Link from "next/link"
import { Calculator, ChevronRight, Clock, CreditCard, Filter, Home, Search, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

export default function ToolsPage() {
  const tools = [
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
    {
      id: "retirement-calculator",
      title: "Retirement Savings Calculator",
      description: "Plan for your retirement and see if you're on track to meet your goals.",
      icon: <Clock className="h-6 w-6" />,
      category: "Finance",
      featured: false,
    },
    {
      id: "tax-calculator",
      title: "Income Tax Calculator",
      description: "Estimate your tax liability based on your income and deductions.",
      icon: <Calculator className="h-6 w-6" />,
      category: "Finance",
      featured: false,
    },
    {
      id: "budget-calculator",
      title: "Budget Planner",
      description: "Create a personalized budget based on your income and expenses.",
      icon: <CreditCard className="h-6 w-6" />,
      category: "Finance",
      featured: false,
    },
  ]

  const categories = [...new Set(tools.map((tool) => tool.category))]

  // Add search functionality
  const [searchQuery, setSearchQuery] = useState("")

  // Filter tools based on search query
  const filteredTools = tools.filter(
    (tool) =>
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center space-y-4 text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">All Tools</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Browse our collection of free calculators and tools
        </p>
        <div className="w-full max-w-md flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Search tools..."
            className="flex-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full mb-8">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">All Tools</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.length > 0 ? (
              filteredTools.map((tool) => <ToolCard key={tool.id} tool={tool} />)
            ) : (
              <div className="col-span-3 text-center py-10">
                <p className="text-muted-foreground">No tools found matching your search.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="featured" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.filter((tool) => tool.featured).length > 0 ? (
              filteredTools.filter((tool) => tool.featured).map((tool) => <ToolCard key={tool.id} tool={tool} />)
            ) : (
              <div className="col-span-3 text-center py-10">
                <p className="text-muted-foreground">No featured tools found matching your search.</p>
              </div>
            )}
          </div>
        </TabsContent>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.filter((tool) => tool.category === category).length > 0 ? (
                filteredTools
                  .filter((tool) => tool.category === category)
                  .map((tool) => <ToolCard key={tool.id} tool={tool} />)
              ) : (
                <div className="col-span-3 text-center py-10">
                  <p className="text-muted-foreground">No {category} tools found matching your search.</p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

function ToolCard({ tool }) {
  return (
    <Card className="flex flex-col h-full transition-all hover:shadow-md">
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
          <div className="inline-block rounded-full px-3 py-1 text-xs bg-primary/20 text-primary ml-2">Featured</div>
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
  )
}

