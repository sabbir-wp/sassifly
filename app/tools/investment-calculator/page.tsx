"use client"

import { useState } from "react"
import { Calculator, ChevronDown, ChevronUp, Info, LineChart, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function InvestmentCalculatorPage() {
  const [initialInvestment, setInitialInvestment] = useState(10000)
  const [monthlyContribution, setMonthlyContribution] = useState(500)
  const [investmentTimeframe, setInvestmentTimeframe] = useState(20)
  const [expectedReturn, setExpectedReturn] = useState(8)
  const [compoundingFrequency, setCompoundingFrequency] = useState<"monthly" | "quarterly" | "annually">("monthly")
  const [inflationRate, setInflationRate] = useState(2.5)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [calculated, setCalculated] = useState(false)

  const calculateInvestment = () => {
    // Convert annual rate to decimal
    const annualRate = expectedReturn / 100

    // Determine compounding periods per year
    let periodsPerYear = 12 // monthly
    if (compoundingFrequency === "quarterly") periodsPerYear = 4
    if (compoundingFrequency === "annually") periodsPerYear = 1

    // Calculate rate per period
    const ratePerPeriod = annualRate / periodsPerYear

    // Calculate total number of periods
    const totalPeriods = investmentTimeframe * periodsPerYear

    // Calculate future value of initial investment
    const futureValueInitial = initialInvestment * Math.pow(1 + ratePerPeriod, totalPeriods)

    // Calculate future value of periodic contributions
    let futureValueContributions = 0
    const contributionPerPeriod = monthlyContribution * (12 / periodsPerYear)

    if (ratePerPeriod > 0) {
      futureValueContributions =
        contributionPerPeriod * ((Math.pow(1 + ratePerPeriod, totalPeriods) - 1) / ratePerPeriod)
    } else {
      futureValueContributions = contributionPerPeriod * totalPeriods
    }

    // Calculate total future value
    const totalFutureValue = futureValueInitial + futureValueContributions

    // Calculate total contributions
    const totalContributions = initialInvestment + monthlyContribution * 12 * investmentTimeframe

    // Calculate total interest earned
    const totalInterestEarned = totalFutureValue - totalContributions

    // Calculate inflation-adjusted future value
    const inflationFactor = Math.pow(1 + inflationRate / 100, investmentTimeframe)
    const inflationAdjustedValue = totalFutureValue / inflationFactor

    // Generate yearly growth data
    const yearlyData = []
    let currentValue = initialInvestment
    const contributionsPerYear = monthlyContribution * 12

    for (let year = 1; year <= investmentTimeframe; year++) {
      // Calculate value at the end of this year
      let yearEndValue = 0

      if (compoundingFrequency === "annually") {
        // One compounding period per year
        yearEndValue = currentValue * (1 + ratePerPeriod) + contributionsPerYear
      } else {
        // Multiple compounding periods per year
        let periodValue = currentValue
        for (let period = 1; period <= periodsPerYear; period++) {
          const contributionThisPeriod = contributionsPerYear / periodsPerYear
          periodValue = periodValue * (1 + ratePerPeriod) + contributionThisPeriod
        }
        yearEndValue = periodValue
      }

      // Calculate contributions for this year
      const yearContributions = year === 1 ? initialInvestment + contributionsPerYear : contributionsPerYear

      // Calculate interest earned this year
      const yearInterest = yearEndValue - currentValue - contributionsPerYear

      // Add data for this year
      yearlyData.push({
        year,
        startValue: currentValue,
        endValue: yearEndValue,
        contributions: yearContributions,
        interest: yearInterest,
      })

      // Update current value for next year
      currentValue = yearEndValue
    }

    return {
      totalFutureValue,
      totalContributions,
      totalInterestEarned,
      inflationAdjustedValue,
      yearlyData,
    }
  }

  const results = calculateInvestment()

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
          <LineChart className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Investment Growth Calculator</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          See how your investments could grow over time with compound interest
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Investment Details</CardTitle>
            <CardDescription>Enter your investment information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="initialInvestment">Initial Investment</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">The amount you're starting with</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="initialInvestment"
                  type="number"
                  className="pl-7"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(Number(e.target.value))}
                />
              </div>
              <Slider
                value={[initialInvestment]}
                min={0}
                max={100000}
                step={1000}
                onValueChange={(value) => setInitialInvestment(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>$0</span>
                <span>$100,000</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="monthlyContribution">Monthly Contribution</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">How much you'll add to your investment each month</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="monthlyContribution"
                  type="number"
                  className="pl-7"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                />
              </div>
              <Slider
                value={[monthlyContribution]}
                min={0}
                max={2000}
                step={50}
                onValueChange={(value) => setMonthlyContribution(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>$0</span>
                <span>$2,000</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="investmentTimeframe">Investment Timeframe (Years)</Label>
                <div className="text-sm font-medium">{investmentTimeframe} years</div>
              </div>
              <Slider
                id="investmentTimeframe"
                value={[investmentTimeframe]}
                min={1}
                max={50}
                step={1}
                onValueChange={(value) => setInvestmentTimeframe(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 year</span>
                <span>50 years</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="expectedReturn">Expected Annual Return (%)</Label>
                <div className="text-sm font-medium">{expectedReturn}%</div>
              </div>
              <Slider
                id="expectedReturn"
                value={[expectedReturn]}
                min={0}
                max={15}
                step={0.1}
                onValueChange={(value) => setExpectedReturn(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>15%</span>
              </div>
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">Note:</span> Historical average annual return for the S&P 500 is around
                10% (7% adjusted for inflation)
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between"
            >
              Advanced Options
              {showAdvanced ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
            </Button>

            {showAdvanced && (
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>Compounding Frequency</Label>
                  <RadioGroup
                    defaultValue={compoundingFrequency}
                    onValueChange={(value) => setCompoundingFrequency(value as "monthly" | "quarterly" | "annually")}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="monthly" id="monthly" />
                      <Label htmlFor="monthly" className="font-normal">
                        Monthly
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="quarterly" id="quarterly" />
                      <Label htmlFor="quarterly" className="font-normal">
                        Quarterly
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="annually" id="annually" />
                      <Label htmlFor="annually" className="font-normal">
                        Annually
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="inflationRate">Inflation Rate (%)</Label>
                    <div className="text-sm font-medium">{inflationRate}%</div>
                  </div>
                  <Slider
                    id="inflationRate"
                    value={[inflationRate]}
                    min={0}
                    max={8}
                    step={0.1}
                    onValueChange={(value) => setInflationRate(value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>8%</span>
                  </div>
                </div>
              </div>
            )}

            <Button className="w-full mt-4" onClick={() => setCalculated(true)}>
              <Calculator className="mr-2 h-4 w-4" />
              Calculate Investment Growth
            </Button>
          </CardContent>
        </Card>

        <Card className={calculated ? "border-primary" : ""}>
          <CardHeader>
            <CardTitle>Investment Projection</CardTitle>
            <CardDescription>Based on the information you provided</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-6 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Future Value</div>
                <div className="text-3xl font-bold mt-2">{formatCurrency(results.totalFutureValue)}</div>
                <div className="text-sm text-muted-foreground mt-1">in {investmentTimeframe} years</div>
              </div>
              <div className="text-center p-6 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Total Interest Earned</div>
                <div className="text-3xl font-bold mt-2">{formatCurrency(results.totalInterestEarned)}</div>
                <div className="text-sm text-muted-foreground mt-1">from compound growth</div>
              </div>
            </div>

            <Tabs defaultValue="summary">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="yearly">Yearly Breakdown</TabsTrigger>
              </TabsList>
              <TabsContent value="summary" className="space-y-4 pt-4">
                <div className="flex justify-between py-2">
                  <span>Initial Investment</span>
                  <span className="font-medium">{formatCurrency(initialInvestment)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Total Contributions</span>
                  <span className="font-medium">{formatCurrency(results.totalContributions)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Total Interest Earned</span>
                  <span className="font-medium">{formatCurrency(results.totalInterestEarned)}</span>
                </div>
                <Separator />
                <div className="flex justify-between py-2">
                  <span className="font-bold">Future Value</span>
                  <span className="font-bold">{formatCurrency(results.totalFutureValue)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Inflation-Adjusted Value</span>
                  <span className="font-medium">{formatCurrency(results.inflationAdjustedValue)}</span>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg border border-muted mt-4">
                  <div className="flex items-center mb-2">
                    <Zap className="h-4 w-4 text-primary mr-2" />
                    <h3 className="font-medium">The Power of Compound Interest</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your investment will grow by {formatCurrency(results.totalInterestEarned)}, which is{" "}
                    {Math.round((results.totalInterestEarned / results.totalContributions) * 100)}% of your total
                    contributions. This demonstrates how compound interest can significantly increase your wealth over
                    time.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="yearly" className="pt-4">
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="p-2 text-left">Year</th>
                        <th className="p-2 text-right">Contributions</th>
                        <th className="p-2 text-right">Interest</th>
                        <th className="p-2 text-right">End Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.yearlyData.slice(0, 10).map((yearData) => (
                        <tr key={yearData.year} className="border-t">
                          <td className="p-2">{yearData.year}</td>
                          <td className="p-2 text-right">{formatCurrency(yearData.contributions)}</td>
                          <td className="p-2 text-right">{formatCurrency(yearData.interest)}</td>
                          <td className="p-2 text-right">{formatCurrency(yearData.endValue)}</td>
                        </tr>
                      ))}
                      {investmentTimeframe > 10 && (
                        <>
                          <tr className="border-t">
                            <td colSpan={4} className="p-2 text-center text-muted-foreground">
                              ...
                            </td>
                          </tr>
                          {results.yearlyData.slice(-3).map((yearData) => (
                            <tr key={yearData.year} className="border-t">
                              <td className="p-2">{yearData.year}</td>
                              <td className="p-2 text-right">{formatCurrency(yearData.contributions)}</td>
                              <td className="p-2 text-right">{formatCurrency(yearData.interest)}</td>
                              <td className="p-2 text-right">{formatCurrency(yearData.endValue)}</td>
                            </tr>
                          ))}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="text-center mt-4 text-sm text-muted-foreground">
                  {investmentTimeframe > 10
                    ? `Showing first 10 years and last 3 years of ${investmentTimeframe} years`
                    : `Showing all ${investmentTimeframe} years`}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 bg-muted rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">About Investment Growth</h2>
        <p className="text-muted-foreground mb-4">
          This calculator demonstrates the power of compound interest and regular investing over time. Compound interest
          means that you earn interest not only on your initial investment, but also on the interest you've already
          earned, creating a snowball effect that accelerates your wealth growth.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Investment Strategies</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>
                <strong>Dollar-Cost Averaging:</strong> Investing a fixed amount regularly regardless of market
                conditions
              </li>
              <li>
                <strong>Diversification:</strong> Spreading investments across different asset classes to reduce risk
              </li>
              <li>
                <strong>Long-Term Investing:</strong> Staying invested through market cycles to benefit from compound
                growth
              </li>
              <li>
                <strong>Tax-Advantaged Accounts:</strong> Using accounts like 401(k)s and IRAs to reduce tax impact
              </li>
              <li>
                <strong>Reinvesting Dividends:</strong> Automatically reinvesting dividends to purchase more shares
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Investment Considerations</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>
                <strong>Risk Tolerance:</strong> Higher returns typically come with higher risk and volatility
              </li>
              <li>
                <strong>Time Horizon:</strong> Longer investment periods can help smooth out market fluctuations
              </li>
              <li>
                <strong>Inflation:</strong> Consider how inflation will affect the purchasing power of your future
                savings
              </li>
              <li>
                <strong>Fees:</strong> Investment fees can significantly impact long-term returns
              </li>
              <li>
                <strong>Rebalancing:</strong> Periodically adjusting your portfolio to maintain your desired asset
                allocation
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

