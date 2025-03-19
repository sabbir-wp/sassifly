"use client"

import { useState } from "react"
import { Calculator, Home, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function HomeSaleCalculatorPage() {
  const [homeValue, setHomeValue] = useState(500000)
  const [mortgageBalance, setMortgageBalance] = useState(300000)
  const [sellerConcessions, setSellerConcessions] = useState(0)
  const [realEstateCommission, setRealEstateCommission] = useState(6)
  const [otherClosingCosts, setOtherClosingCosts] = useState(5000)
  const [repairs, setRepairs] = useState(0)
  const [calculated, setCalculated] = useState(false)

  const calculateProceeds = () => {
    const commissionAmount = (homeValue * realEstateCommission) / 100
    const totalCosts = commissionAmount + otherClosingCosts + repairs + sellerConcessions
    const netProceeds = homeValue - mortgageBalance - totalCosts

    return {
      salePrice: homeValue,
      mortgageBalance,
      commissionAmount,
      otherClosingCosts,
      repairs,
      sellerConcessions,
      totalCosts,
      netProceeds,
    }
  }

  const results = calculateProceeds()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center space-y-4 text-center mb-10">
        <div className="inline-flex items-center justify-center p-2 bg-muted rounded-full">
          <Home className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Home Sale Proceeds Calculator</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Calculate how much you'll take home after selling your property
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Enter Your Information</CardTitle>
            <CardDescription>Fill in the details about your home sale to calculate your net proceeds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="homeValue">Home Sale Price</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">The expected selling price of your home</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="homeValue"
                  type="number"
                  className="pl-7"
                  value={homeValue}
                  onChange={(e) => setHomeValue(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="mortgageBalance">Remaining Mortgage Balance</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">The amount you still owe on your mortgage</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="mortgageBalance"
                  type="number"
                  className="pl-7"
                  value={mortgageBalance}
                  onChange={(e) => setMortgageBalance(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="realEstateCommission">Real Estate Commission (%)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Typically 5-6% of the sale price, split between buyer's and seller's agents
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative">
                <Input
                  id="realEstateCommission"
                  type="number"
                  value={realEstateCommission}
                  onChange={(e) => setRealEstateCommission(Number(e.target.value))}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="otherClosingCosts">Other Closing Costs</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Title fees, escrow fees, transfer taxes, etc.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="otherClosingCosts"
                  type="number"
                  className="pl-7"
                  value={otherClosingCosts}
                  onChange={(e) => setOtherClosingCosts(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="repairs">Repairs and Improvements</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Cost of repairs or improvements needed before selling</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="repairs"
                  type="number"
                  className="pl-7"
                  value={repairs}
                  onChange={(e) => setRepairs(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="sellerConcessions">Seller Concessions</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Money you agree to pay toward buyer's closing costs</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="sellerConcessions"
                  type="number"
                  className="pl-7"
                  value={sellerConcessions}
                  onChange={(e) => setSellerConcessions(Number(e.target.value))}
                />
              </div>
            </div>

            <Button className="w-full mt-4" onClick={() => setCalculated(true)}>
              <Calculator className="mr-2 h-4 w-4" />
              Calculate Proceeds
            </Button>
          </CardContent>
        </Card>

        <Card className={calculated ? "border-primary" : ""}>
          <CardHeader>
            <CardTitle>Your Estimated Net Proceeds</CardTitle>
            <CardDescription>Based on the information you provided</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-6 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Estimated Net Proceeds</div>
              <div className="text-4xl font-bold mt-2">{formatCurrency(results.netProceeds)}</div>
            </div>

            <Tabs defaultValue="summary">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="details">Detailed Breakdown</TabsTrigger>
              </TabsList>
              <TabsContent value="summary" className="space-y-4 pt-4">
                <div className="flex justify-between py-2">
                  <span>Sale Price</span>
                  <span className="font-medium">{formatCurrency(results.salePrice)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Mortgage Balance</span>
                  <span className="font-medium text-destructive">- {formatCurrency(results.mortgageBalance)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Total Costs</span>
                  <span className="font-medium text-destructive">- {formatCurrency(results.totalCosts)}</span>
                </div>
                <Separator />
                <div className="flex justify-between py-2">
                  <span className="font-bold">Net Proceeds</span>
                  <span className="font-bold">{formatCurrency(results.netProceeds)}</span>
                </div>
              </TabsContent>
              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="flex justify-between py-2">
                  <span>Sale Price</span>
                  <span className="font-medium">{formatCurrency(results.salePrice)}</span>
                </div>
                <Separator />
                <div className="flex justify-between py-2">
                  <span>Mortgage Balance</span>
                  <span className="font-medium text-destructive">- {formatCurrency(results.mortgageBalance)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Agent Commission ({realEstateCommission}%)</span>
                  <span className="font-medium text-destructive">- {formatCurrency(results.commissionAmount)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Other Closing Costs</span>
                  <span className="font-medium text-destructive">- {formatCurrency(results.otherClosingCosts)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Repairs and Improvements</span>
                  <span className="font-medium text-destructive">- {formatCurrency(results.repairs)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Seller Concessions</span>
                  <span className="font-medium text-destructive">- {formatCurrency(results.sellerConcessions)}</span>
                </div>
                <Separator />
                <div className="flex justify-between py-2">
                  <span className="font-bold">Net Proceeds</span>
                  <span className="font-bold">{formatCurrency(results.netProceeds)}</span>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 bg-muted rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">About This Calculator</h2>
        <p className="text-muted-foreground mb-4">
          This home sale proceeds calculator helps you estimate how much money you'll walk away with after selling your
          home. It takes into account your remaining mortgage balance, real estate agent commissions, closing costs, and
          other expenses associated with selling a property.
        </p>
        <p className="text-muted-foreground mb-4">
          Keep in mind that this is an estimate, and actual costs may vary. For a more accurate assessment, consult with
          a real estate professional or financial advisor.
        </p>
        <h3 className="text-lg font-semibold mb-2">Common Questions</h3>
        <div className="space-y-2">
          <details className="group">
            <summary className="flex cursor-pointer items-center justify-between font-medium">
              What are seller concessions?
              <span className="transition group-open:rotate-180">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </span>
            </summary>
            <p className="mt-2 text-muted-foreground">
              Seller concessions are costs that a seller agrees to pay on behalf of the buyer. These can include closing
              costs, repairs, or other expenses. Offering concessions can make your home more attractive to buyers but
              will reduce your net proceeds.
            </p>
          </details>
          <details className="group">
            <summary className="flex cursor-pointer items-center justify-between font-medium">
              How much are typical closing costs?
              <span className="transition group-open:rotate-180">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </span>
            </summary>
            <p className="mt-2 text-muted-foreground">
              Closing costs for sellers typically range from 1% to 3% of the home's sale price, not including real
              estate agent commissions. These costs can include title insurance, transfer taxes, escrow fees, and
              attorney fees.
            </p>
          </details>
          <details className="group">
            <summary className="flex cursor-pointer items-center justify-between font-medium">
              Can I negotiate real estate commissions?
              <span className="transition group-open:rotate-180">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </span>
            </summary>
            <p className="mt-2 text-muted-foreground">
              Yes, real estate commissions are negotiable. The standard commission is around 5-6% of the sale price,
              split between the buyer's and seller's agents, but you can discuss different rates with your agent.
            </p>
          </details>
        </div>
      </div>
    </div>
  )
}

