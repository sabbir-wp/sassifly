"use client"

import { useState } from "react"
import { Calculator, DollarSign, Info, Percent } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function AffiliateCalculatorPage() {
  // Basic calculation state
  const [productPrice, setProductPrice] = useState(100)
  const [commissionRate, setCommissionRate] = useState(10)
  const [monthlySales, setMonthlySales] = useState(50)
  const [conversionRate, setConversionRate] = useState(2)
  const [monthlyVisitors, setMonthlyVisitors] = useState(5000)
  const [calculated, setCalculated] = useState(false)

  // Advanced calculation state
  const [recurringCommission, setRecurringCommission] = useState(false)
  const [recurringRate, setRecurringRate] = useState(5)
  const [averageMonthsActive, setAverageMonthsActive] = useState(6)
  const [customerRetentionRate, setCustomerRetentionRate] = useState(80)
  const [tieredCommission, setTieredCommission] = useState(false)
  const [tier2Threshold, setTier2Threshold] = useState(100)
  const [tier2Rate, setTier2Rate] = useState(15)
  const [tier3Threshold, setTier3Threshold] = useState(500)
  const [tier3Rate, setTier3Rate] = useState(20)

  const calculateBasicCommission = () => {
    const commissionPerSale = (productPrice * commissionRate) / 100
    const monthlyCommission = commissionPerSale * monthlySales
    const annualCommission = monthlyCommission * 12

    return {
      commissionPerSale,
      monthlyCommission,
      annualCommission,
    }
  }

  const calculateAdvancedCommission = () => {
    let calculatedSales = monthlySales

    // If we have visitor and conversion data, use that to calculate sales
    if (monthlyVisitors > 0 && conversionRate > 0) {
      calculatedSales = Math.round((monthlyVisitors * conversionRate) / 100)
    }

    // Calculate base commission
    let commissionPerSale = (productPrice * commissionRate) / 100
    let monthlyCommission = 0

    // Apply tiered commission if enabled
    if (tieredCommission) {
      if (calculatedSales >= tier3Threshold) {
        commissionPerSale = (productPrice * tier3Rate) / 100
      } else if (calculatedSales >= tier2Threshold) {
        commissionPerSale = (productPrice * tier2Rate) / 100
      }
    }

    // Calculate monthly commission
    monthlyCommission = commissionPerSale * calculatedSales

    // Calculate recurring commission if enabled
    let recurringMonthlyCommission = 0
    let lifetimeValue = 0

    if (recurringCommission) {
      const recurringCommissionPerSale = (productPrice * recurringRate) / 100

      // Calculate recurring commission based on retention rate
      let totalRecurringCommission = 0
      let remainingCustomers = calculatedSales

      for (let month = 1; month < averageMonthsActive; month++) {
        remainingCustomers = Math.round(remainingCustomers * (customerRetentionRate / 100))
        totalRecurringCommission += remainingCustomers * recurringCommissionPerSale
      }

      recurringMonthlyCommission = totalRecurringCommission / averageMonthsActive
      lifetimeValue =
        commissionPerSale + recurringCommissionPerSale * (averageMonthsActive - 1) * (customerRetentionRate / 100)
    }

    const totalMonthlyCommission = monthlyCommission + recurringMonthlyCommission
    const annualCommission = totalMonthlyCommission * 12

    return {
      commissionPerSale,
      calculatedSales,
      monthlyCommission,
      recurringMonthlyCommission,
      totalMonthlyCommission,
      annualCommission,
      lifetimeValue,
    }
  }

  const basicResults = calculateBasicCommission()
  const advancedResults = calculateAdvancedCommission()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value)
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center space-y-4 text-center mb-10">
        <div className="inline-flex items-center justify-center p-2 bg-muted rounded-full">
          <DollarSign className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Affiliate Commission Calculator</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Estimate your potential earnings from affiliate marketing
        </p>
      </div>

      <Tabs defaultValue="basic" className="space-y-8">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="basic">Basic Calculator</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Basic Affiliate Earnings</CardTitle>
                <CardDescription>Calculate your potential affiliate earnings with a few simple inputs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="productPrice">Product Price</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">The price of the product or service you're promoting</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="productPrice"
                      type="number"
                      className="pl-7"
                      value={productPrice}
                      onChange={(e) => setProductPrice(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">The percentage of the sale you earn as commission</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="relative">
                    <Input
                      id="commissionRate"
                      type="number"
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(Number(e.target.value))}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="monthlySales">Estimated Monthly Sales</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">How many sales you expect to make each month</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="monthlySales"
                    type="number"
                    value={monthlySales}
                    onChange={(e) => setMonthlySales(Number(e.target.value))}
                  />
                </div>

                <Button className="w-full mt-4" onClick={() => setCalculated(true)}>
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate Earnings
                </Button>
              </CardContent>
            </Card>

            <Card className={calculated ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle>Your Estimated Earnings</CardTitle>
                <CardDescription>Based on the information you provided</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center p-6 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground">Monthly Earnings</div>
                  <div className="text-4xl font-bold mt-2">{formatCurrency(basicResults.monthlyCommission)}</div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between py-2">
                    <span>Commission Per Sale</span>
                    <span className="font-medium">{formatCurrency(basicResults.commissionPerSale)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Monthly Sales</span>
                    <span className="font-medium">{monthlySales}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between py-2">
                    <span>Monthly Earnings</span>
                    <span className="font-medium">{formatCurrency(basicResults.monthlyCommission)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Annual Earnings</span>
                    <span className="font-medium">{formatCurrency(basicResults.annualCommission)}</span>
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg border border-muted">
                  <h3 className="font-medium mb-2">Potential Growth</h3>
                  <p className="text-sm text-muted-foreground">
                    If you increase your monthly sales by just 20%, your annual earnings could be{" "}
                    {formatCurrency(basicResults.annualCommission * 1.2)}.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product & Commission Details</CardTitle>
                  <CardDescription>Enter information about the product and commission structure</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="advProductPrice">Product Price</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="advProductPrice"
                        type="number"
                        className="pl-7"
                        value={productPrice}
                        onChange={(e) => setProductPrice(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="advCommissionRate">Base Commission Rate (%)</Label>
                    <div className="relative">
                      <Input
                        id="advCommissionRate"
                        type="number"
                        value={commissionRate}
                        onChange={(e) => setCommissionRate(Number(e.target.value))}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="tieredCommission"
                      checked={tieredCommission}
                      onChange={(e) => setTieredCommission(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="tieredCommission">Enable Tiered Commission Rates</Label>
                  </div>

                  {tieredCommission && (
                    <div className="space-y-4 pl-6 border-l-2 border-muted mt-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="tier2Threshold">Tier 2 Threshold (sales)</Label>
                          <Input
                            id="tier2Threshold"
                            type="number"
                            value={tier2Threshold}
                            onChange={(e) => setTier2Threshold(Number(e.target.value))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tier2Rate">Tier 2 Rate (%)</Label>
                          <div className="relative">
                            <Input
                              id="tier2Rate"
                              type="number"
                              value={tier2Rate}
                              onChange={(e) => setTier2Rate(Number(e.target.value))}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="tier3Threshold">Tier 3 Threshold (sales)</Label>
                          <Input
                            id="tier3Threshold"
                            type="number"
                            value={tier3Threshold}
                            onChange={(e) => setTier3Threshold(Number(e.target.value))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tier3Rate">Tier 3 Rate (%)</Label>
                          <div className="relative">
                            <Input
                              id="tier3Rate"
                              type="number"
                              value={tier3Rate}
                              onChange={(e) => setTier3Rate(Number(e.target.value))}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="recurringCommission"
                      checked={recurringCommission}
                      onChange={(e) => setRecurringCommission(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="recurringCommission">Include Recurring Commissions</Label>
                  </div>

                  {recurringCommission && (
                    <div className="space-y-4 pl-6 border-l-2 border-muted mt-2">
                      <div className="space-y-2">
                        <Label htmlFor="recurringRate">Recurring Commission Rate (%)</Label>
                        <div className="relative">
                          <Input
                            id="recurringRate"
                            type="number"
                            value={recurringRate}
                            onChange={(e) => setRecurringRate(Number(e.target.value))}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="averageMonthsActive">Average Customer Lifetime (months)</Label>
                        <Input
                          id="averageMonthsActive"
                          type="number"
                          value={averageMonthsActive}
                          onChange={(e) => setAverageMonthsActive(Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customerRetentionRate">Monthly Retention Rate (%)</Label>
                        <div className="relative">
                          <Input
                            id="customerRetentionRate"
                            type="number"
                            value={customerRetentionRate}
                            onChange={(e) => setCustomerRetentionRate(Number(e.target.value))}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Traffic & Conversion</CardTitle>
                  <CardDescription>Enter your traffic and conversion metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="monthlyVisitors">Monthly Website Visitors</Label>
                    <Input
                      id="monthlyVisitors"
                      type="number"
                      value={monthlyVisitors}
                      onChange={(e) => setMonthlyVisitors(Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="conversionRate">Conversion Rate (%)</Label>
                    <div className="relative">
                      <Input
                        id="conversionRate"
                        type="number"
                        step="0.1"
                        value={conversionRate}
                        onChange={(e) => setConversionRate(Number(e.target.value))}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="calculatedSales">Calculated Monthly Sales</Label>
                    <Input
                      id="calculatedSales"
                      type="number"
                      value={Math.round((monthlyVisitors * conversionRate) / 100)}
                      readOnly
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">Based on your traffic and conversion rate</p>
                  </div>

                  <Button className="w-full mt-4" onClick={() => setCalculated(true)}>
                    <Calculator className="mr-2 h-4 w-4" />
                    Calculate Advanced Earnings
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className={calculated ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle>Advanced Earnings Projection</CardTitle>
                <CardDescription>Detailed breakdown of your potential affiliate earnings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-6 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Monthly Earnings</div>
                    <div className="text-3xl font-bold mt-2">
                      {formatCurrency(advancedResults.totalMonthlyCommission)}
                    </div>
                  </div>
                  <div className="text-center p-6 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Annual Earnings</div>
                    <div className="text-3xl font-bold mt-2">{formatCurrency(advancedResults.annualCommission)}</div>
                  </div>
                </div>

                <Tabs defaultValue="summary" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="details">Detailed Breakdown</TabsTrigger>
                  </TabsList>
                  <TabsContent value="summary" className="space-y-4 pt-4">
                    <div className="flex justify-between py-2">
                      <span>Commission Per Sale</span>
                      <span className="font-medium">{formatCurrency(advancedResults.commissionPerSale)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>Monthly Sales</span>
                      <span className="font-medium">{advancedResults.calculatedSales}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>Base Monthly Commission</span>
                      <span className="font-medium">{formatCurrency(advancedResults.monthlyCommission)}</span>
                    </div>
                    {recurringCommission && (
                      <div className="flex justify-between py-2">
                        <span>Recurring Monthly Commission</span>
                        <span className="font-medium">
                          {formatCurrency(advancedResults.recurringMonthlyCommission)}
                        </span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between py-2">
                      <span className="font-bold">Total Monthly Earnings</span>
                      <span className="font-bold">{formatCurrency(advancedResults.totalMonthlyCommission)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-bold">Total Annual Earnings</span>
                      <span className="font-bold">{formatCurrency(advancedResults.annualCommission)}</span>
                    </div>
                  </TabsContent>
                  <TabsContent value="details" className="space-y-4 pt-4">
                    <div className="space-y-4">
                      <h3 className="font-medium">Traffic & Conversion</h3>
                      <div className="flex justify-between py-1 text-sm">
                        <span>Monthly Visitors</span>
                        <span>{monthlyVisitors.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-1 text-sm">
                        <span>Conversion Rate</span>
                        <span>{conversionRate}%</span>
                      </div>
                      <div className="flex justify-between py-1 text-sm">
                        <span>Calculated Monthly Sales</span>
                        <span>{advancedResults.calculatedSales}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-medium">Commission Structure</h3>
                      <div className="flex justify-between py-1 text-sm">
                        <span>Product Price</span>
                        <span>{formatCurrency(productPrice)}</span>
                      </div>
                      <div className="flex justify-between py-1 text-sm">
                        <span>Base Commission Rate</span>
                        <span>{commissionRate}%</span>
                      </div>
                      {tieredCommission && (
                        <>
                          <div className="flex justify-between py-1 text-sm">
                            <span>Applied Tier Rate</span>
                            <span>
                              {advancedResults.calculatedSales >= tier3Threshold
                                ? tier3Rate
                                : advancedResults.calculatedSales >= tier2Threshold
                                  ? tier2Rate
                                  : commissionRate}
                              %
                            </span>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between py-1 text-sm">
                        <span>Commission Per Sale</span>
                        <span>{formatCurrency(advancedResults.commissionPerSale)}</span>
                      </div>
                    </div>

                    {recurringCommission && (
                      <>
                        <Separator />
                        <div className="space-y-4">
                          <h3 className="font-medium">Recurring Revenue</h3>
                          <div className="flex justify-between py-1 text-sm">
                            <span>Recurring Commission Rate</span>
                            <span>{recurringRate}%</span>
                          </div>
                          <div className="flex justify-between py-1 text-sm">
                            <span>Average Customer Lifetime</span>
                            <span>{averageMonthsActive} months</span>
                          </div>
                          <div className="flex justify-between py-1 text-sm">
                            <span>Monthly Retention Rate</span>
                            <span>{customerRetentionRate}%</span>
                          </div>
                          <div className="flex justify-between py-1 text-sm">
                            <span>Customer Lifetime Value</span>
                            <span>{formatCurrency(advancedResults.lifetimeValue)}</span>
                          </div>
                        </div>
                      </>
                    )}

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-medium">Earnings Summary</h3>
                      <div className="flex justify-between py-1 text-sm">
                        <span>Base Monthly Commission</span>
                        <span>{formatCurrency(advancedResults.monthlyCommission)}</span>
                      </div>
                      {recurringCommission && (
                        <div className="flex justify-between py-1 text-sm">
                          <span>Recurring Monthly Commission</span>
                          <span>{formatCurrency(advancedResults.recurringMonthlyCommission)}</span>
                        </div>
                      )}
                      <div className="flex justify-between py-1 font-medium">
                        <span>Total Monthly Earnings</span>
                        <span>{formatCurrency(advancedResults.totalMonthlyCommission)}</span>
                      </div>
                      <div className="flex justify-between py-1 font-medium">
                        <span>Total Annual Earnings</span>
                        <span>{formatCurrency(advancedResults.annualCommission)}</span>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="p-4 bg-muted/50 rounded-lg border border-muted">
                  <h3 className="font-medium mb-2">Optimization Tips</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start">
                      <Percent className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        Increasing your conversion rate by just 1% could add{" "}
                        {formatCurrency(advancedResults.annualCommission * 0.5)} to your annual earnings.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <DollarSign className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Focus on promoting higher-priced products to maximize your commission per sale.</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12 bg-muted rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">About This Calculator</h2>
        <p className="text-muted-foreground mb-4">
          This affiliate commission calculator helps you estimate your potential earnings from affiliate marketing. It
          takes into account factors such as product price, commission rate, traffic, conversion rates, and even
          advanced features like tiered commissions and recurring revenue.
        </p>
        <p className="text-muted-foreground mb-4">
          Use this calculator to set realistic income goals, compare different affiliate programs, and identify
          opportunities to increase your earnings.
        </p>
        <h3 className="text-lg font-semibold mb-2">Affiliate Marketing Tips</h3>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>Choose products that align with your audience's interests and needs</li>
          <li>Focus on building trust with your audience before promoting affiliate products</li>
          <li>Create detailed, helpful content that naturally incorporates affiliate links</li>
          <li>Track your performance metrics to identify what's working and what's not</li>
          <li>Test different promotional strategies to optimize your conversion rates</li>
        </ul>
      </div>
    </div>
  )
}

