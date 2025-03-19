"use client"

import { useState } from "react"
import { Calculator, Clock, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function RetirementCalculatorPage() {
  const [currentAge, setCurrentAge] = useState(30)
  const [retirementAge, setRetirementAge] = useState(65)
  const [currentSavings, setCurrentSavings] = useState(50000)
  const [annualContribution, setAnnualContribution] = useState(6000)
  const [expectedReturn, setExpectedReturn] = useState(7)
  const [inflationRate, setInflationRate] = useState(2.5)
  const [annualIncome, setAnnualIncome] = useState(60000)
  const [incomeReplacementRate, setIncomeReplacementRate] = useState(80)
  const [calculated, setCalculated] = useState(false)

  const calculateRetirement = () => {
    // Calculate years until retirement
    const yearsToRetirement = retirementAge - currentAge

    // Calculate future value of current savings
    const futureValueOfCurrentSavings = currentSavings * Math.pow(1 + expectedReturn / 100, yearsToRetirement)

    // Calculate future value of annual contributions
    let futureValueOfContributions = 0
    for (let i = 0; i < yearsToRetirement; i++) {
      futureValueOfContributions += annualContribution * Math.pow(1 + expectedReturn / 100, yearsToRetirement - i)
    }

    // Calculate total retirement savings
    const totalRetirementSavings = futureValueOfCurrentSavings + futureValueOfContributions

    // Calculate annual retirement income needed (adjusted for inflation)
    const inflationFactor = Math.pow(1 + inflationRate / 100, yearsToRetirement)
    const futureAnnualIncome = annualIncome * inflationFactor
    const annualIncomeNeeded = futureAnnualIncome * (incomeReplacementRate / 100)

    // Calculate how long savings will last (using 4% rule as a baseline)
    const withdrawalRate = 0.04
    const yearsOfRetirement =
      Math.log(1 / (1 - (withdrawalRate * totalRetirementSavings) / annualIncomeNeeded)) /
      Math.log(1 + expectedReturn / 100 - inflationRate / 100)

    // Calculate retirement income gap
    const sustainableAnnualWithdrawal = totalRetirementSavings * withdrawalRate
    const incomeGap = annualIncomeNeeded - sustainableAnnualWithdrawal

    // Calculate additional savings needed to close the gap
    const additionalSavingsNeeded = incomeGap > 0 ? incomeGap / withdrawalRate : 0

    // Calculate monthly contribution needed to reach goal
    const monthlyContributionNeeded = calculateMonthlyContribution(
      additionalSavingsNeeded,
      expectedReturn / 100,
      yearsToRetirement,
    )

    return {
      yearsToRetirement,
      totalRetirementSavings,
      annualIncomeNeeded,
      sustainableAnnualWithdrawal,
      incomeGap,
      additionalSavingsNeeded,
      yearsOfRetirement: isNaN(yearsOfRetirement) ? 30 : Math.min(Math.round(yearsOfRetirement), 50),
      monthlyContributionNeeded,
    }
  }

  // Helper function to calculate monthly contribution needed
  const calculateMonthlyContribution = (futureValue, rate, years) => {
    const monthlyRate = rate / 12
    const months = years * 12
    return (futureValue * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1)
  }

  const results = calculateRetirement()

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
          <Clock className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Retirement Calculator</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Plan your retirement and see if you're on track to meet your goals
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
            <CardDescription>Enter your current financial details and retirement goals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="currentAge">Current Age</Label>
                <div className="text-sm font-medium">{currentAge} years</div>
              </div>
              <Slider
                id="currentAge"
                value={[currentAge]}
                min={18}
                max={80}
                step={1}
                onValueChange={(value) => setCurrentAge(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>18</span>
                <span>80</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="retirementAge">Retirement Age</Label>
                <div className="text-sm font-medium">{retirementAge} years</div>
              </div>
              <Slider
                id="retirementAge"
                value={[retirementAge]}
                min={Math.max(currentAge + 1, 50)}
                max={90}
                step={1}
                onValueChange={(value) => setRetirementAge(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{Math.max(currentAge + 1, 50)}</span>
                <span>90</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="currentSavings">Current Retirement Savings</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Total amount currently saved in retirement accounts like 401(k), IRA, etc.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="currentSavings"
                  type="number"
                  className="pl-7"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="annualContribution">Annual Contribution</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">How much you contribute to retirement accounts each year</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="annualContribution"
                  type="number"
                  className="pl-7"
                  value={annualContribution}
                  onChange={(e) => setAnnualContribution(Number(e.target.value))}
                />
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
                min={1}
                max={12}
                step={0.1}
                onValueChange={(value) => setExpectedReturn(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1%</span>
                <span>12%</span>
              </div>
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

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="annualIncome">Current Annual Income</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Your current annual income before taxes</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="annualIncome"
                  type="number"
                  className="pl-7"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="incomeReplacementRate">Income Replacement Rate (%)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Percentage of your current income you'll need in retirement (typically 70-85%)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative">
                <Input
                  id="incomeReplacementRate"
                  type="number"
                  value={incomeReplacementRate}
                  onChange={(e) => setIncomeReplacementRate(Number(e.target.value))}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
              </div>
            </div>

            <Button className="w-full mt-4" onClick={() => setCalculated(true)}>
              <Calculator className="mr-2 h-4 w-4" />
              Calculate Retirement Plan
            </Button>
          </CardContent>
        </Card>

        <Card className={calculated ? "border-primary" : ""}>
          <CardHeader>
            <CardTitle>Your Retirement Projection</CardTitle>
            <CardDescription>Based on the information you provided</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-6 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Projected Retirement Savings</div>
                <div className="text-3xl font-bold mt-2">{formatCurrency(results.totalRetirementSavings)}</div>
                <div className="text-sm text-muted-foreground mt-1">at age {retirementAge}</div>
              </div>
              <div className="text-center p-6 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Sustainable Annual Income</div>
                <div className="text-3xl font-bold mt-2">{formatCurrency(results.sustainableAnnualWithdrawal)}</div>
                <div className="text-sm text-muted-foreground mt-1">using 4% rule</div>
              </div>
            </div>

            <Tabs defaultValue="summary">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
              </TabsList>
              <TabsContent value="summary" className="space-y-4 pt-4">
                <div className="flex justify-between py-2">
                  <span>Years Until Retirement</span>
                  <span className="font-medium">{results.yearsToRetirement} years</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Annual Income Needed in Retirement</span>
                  <span className="font-medium">{formatCurrency(results.annualIncomeNeeded)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Projected Savings Will Last</span>
                  <span className="font-medium">~{results.yearsOfRetirement} years</span>
                </div>
                <Separator />
                <div className="flex justify-between py-2">
                  <span className={results.incomeGap > 0 ? "text-destructive font-medium" : "font-medium"}>
                    {results.incomeGap > 0 ? "Income Gap" : "Income Surplus"}
                  </span>
                  <span className={results.incomeGap > 0 ? "text-destructive font-medium" : "font-medium"}>
                    {formatCurrency(Math.abs(results.incomeGap))} per year
                  </span>
                </div>
                {results.incomeGap > 0 && (
                  <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                    <h3 className="font-medium mb-2 text-destructive">Action Needed</h3>
                    <p className="text-sm">
                      To close this gap, consider increasing your annual contribution to{" "}
                      {formatCurrency(annualContribution + results.monthlyContributionNeeded * 12)} per year (an
                      additional {formatCurrency(results.monthlyContributionNeeded * 12)} per year or{" "}
                      {formatCurrency(results.monthlyContributionNeeded)} per month).
                    </p>
                  </div>
                )}
                {results.incomeGap <= 0 && (
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <h3 className="font-medium mb-2 text-primary">On Track</h3>
                    <p className="text-sm">
                      Based on your current savings and contributions, you're on track to meet your retirement goals.
                      Your savings should last through your retirement years.
                    </p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <h3 className="font-medium">Retirement Income</h3>
                  <div className="flex justify-between py-1 text-sm">
                    <span>Current Annual Income</span>
                    <span>{formatCurrency(annualIncome)}</span>
                  </div>
                  <div className="flex justify-between py-1 text-sm">
                    <span>Income Replacement Rate</span>
                    <span>{incomeReplacementRate}%</span>
                  </div>
                  <div className="flex justify-between py-1 text-sm">
                    <span>Inflation-Adjusted Income at Retirement</span>
                    <span>{formatCurrency(results.annualIncomeNeeded / (incomeReplacementRate / 100))}</span>
                  </div>
                  <div className="flex justify-between py-1 text-sm">
                    <span>Annual Income Needed in Retirement</span>
                    <span>{formatCurrency(results.annualIncomeNeeded)}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Savings Growth</h3>
                  <div className="flex justify-between py-1 text-sm">
                    <span>Current Retirement Savings</span>
                    <span>{formatCurrency(currentSavings)}</span>
                  </div>
                  <div className="flex justify-between py-1 text-sm">
                    <span>Annual Contribution</span>
                    <span>{formatCurrency(annualContribution)}</span>
                  </div>
                  <div className="flex justify-between py-1 text-sm">
                    <span>Expected Annual Return</span>
                    <span>{expectedReturn}%</span>
                  </div>
                  <div className="flex justify-between py-1 text-sm">
                    <span>Inflation Rate</span>
                    <span>{inflationRate}%</span>
                  </div>
                  <div className="flex justify-between py-1 text-sm">
                    <span>Years Until Retirement</span>
                    <span>{results.yearsToRetirement} years</span>
                  </div>
                  <div className="flex justify-between py-1 text-sm font-medium">
                    <span>Projected Retirement Savings</span>
                    <span>{formatCurrency(results.totalRetirementSavings)}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Retirement Analysis</h3>
                  <div className="flex justify-between py-1 text-sm">
                    <span>Sustainable Annual Withdrawal (4% Rule)</span>
                    <span>{formatCurrency(results.sustainableAnnualWithdrawal)}</span>
                  </div>
                  <div className="flex justify-between py-1 text-sm">
                    <span>Annual Income Needed</span>
                    <span>{formatCurrency(results.annualIncomeNeeded)}</span>
                  </div>
                  <div className="flex justify-between py-1 text-sm">
                    <span>Income Gap/Surplus</span>
                    <span className={results.incomeGap > 0 ? "text-destructive" : ""}>
                      {results.incomeGap > 0 ? "-" : "+"} {formatCurrency(Math.abs(results.incomeGap))}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 text-sm">
                    <span>Projected Savings Will Last</span>
                    <span>~{results.yearsOfRetirement} years</span>
                  </div>
                  {results.incomeGap > 0 && (
                    <div className="flex justify-between py-1 text-sm">
                      <span>Additional Monthly Contribution Needed</span>
                      <span className="text-destructive">{formatCurrency(results.monthlyContributionNeeded)}</span>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 bg-muted rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">About Retirement Planning</h2>
        <p className="text-muted-foreground mb-4">
          Retirement planning is the process of determining retirement income goals, and the actions and decisions
          necessary to achieve those goals. It includes identifying sources of income, estimating expenses, implementing
          a savings program, and managing assets and risk.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Retirement Savings Tips</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Start saving as early as possible to take advantage of compound interest</li>
              <li>Maximize contributions to tax-advantaged accounts like 401(k)s and IRAs</li>
              <li>Consider diversifying your investments based on your risk tolerance and time horizon</li>
              <li>Regularly review and adjust your retirement plan as your circumstances change</li>
              <li>Consider working with a financial advisor for personalized guidance</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Common Retirement Accounts</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>401(k) or 403(b): Employer-sponsored retirement plans</li>
              <li>Traditional IRA: Tax-deductible contributions with tax-deferred growth</li>
              <li>Roth IRA: After-tax contributions with tax-free growth and withdrawals</li>
              <li>SEP IRA or Solo 401(k): Retirement options for self-employed individuals</li>
              <li>Health Savings Account (HSA): Can be used as a retirement account for healthcare expenses</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

