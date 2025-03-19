"use client"

import { useState } from "react"
import { Calculator, DollarSign, Info, Percent } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function TaxCalculatorPage() {
  const [income, setIncome] = useState(75000)
  const [filingStatus, setFilingStatus] = useState<"single" | "married" | "head">("single")
  const [deductions, setDeductions] = useState<"standard" | "itemized">("standard")
  const [itemizedAmount, setItemizedAmount] = useState(12950)
  const [dependents, setDependents] = useState(0)
  const [state, setState] = useState("CA")
  const [retirement401k, setRetirement401k] = useState(6000)
  const [traditionalIra, setTraditionalIra] = useState(0)
  const [hsa, setHsa] = useState(0)
  const [otherIncome, setOtherIncome] = useState(0)
  const [calculated, setCalculated] = useState(false)

  // 2023 Tax Brackets (simplified)
  const taxBrackets = {
    single: [
      { rate: 0.1, min: 0, max: 11000 },
      { rate: 0.12, min: 11000, max: 44725 },
      { rate: 0.22, min: 44725, max: 95375 },
      { rate: 0.24, min: 95375, max: 182100 },
      { rate: 0.32, min: 182100, max: 231250 },
      { rate: 0.35, min: 231250, max: 578125 },
      { rate: 0.37, min: 578125, max: Number.POSITIVE_INFINITY },
    ],
    married: [
      { rate: 0.1, min: 0, max: 22000 },
      { rate: 0.12, min: 22000, max: 89450 },
      { rate: 0.22, min: 89450, max: 190750 },
      { rate: 0.24, min: 190750, max: 364200 },
      { rate: 0.32, min: 364200, max: 462500 },
      { rate: 0.35, min: 462500, max: 693750 },
      { rate: 0.37, min: 693750, max: Number.POSITIVE_INFINITY },
    ],
    head: [
      { rate: 0.1, min: 0, max: 15700 },
      { rate: 0.12, min: 15700, max: 59850 },
      { rate: 0.22, min: 59850, max: 95350 },
      { rate: 0.24, min: 95350, max: 182100 },
      { rate: 0.32, min: 182100, max: 231250 },
      { rate: 0.35, min: 231250, max: 578100 },
      { rate: 0.37, min: 578100, max: Number.POSITIVE_INFINITY },
    ],
  }

  // Standard deduction amounts for 2023
  const standardDeductionAmounts = {
    single: 13850,
    married: 27700,
    head: 20800,
  }

  // State tax rates (simplified)
  const stateTaxRates = {
    CA: 0.093, // California
    NY: 0.0685, // New York
    TX: 0, // Texas (no state income tax)
    FL: 0, // Florida (no state income tax)
    IL: 0.0495, // Illinois
    PA: 0.0307, // Pennsylvania
    OH: 0.0399, // Ohio
    GA: 0.0575, // Georgia
    NC: 0.0499, // North Carolina
    MI: 0.0425, // Michigan
  }

  const calculateTax = () => {
    // Calculate total income
    const totalIncome = income + otherIncome

    // Calculate pre-tax deductions
    const preTaxDeductions = retirement401k + traditionalIra + hsa

    // Calculate taxable income
    const standardDeduction = standardDeductionAmounts[filingStatus]
    const deductionAmount = deductions === "standard" ? standardDeduction : itemizedAmount
    const dependentCredit = dependents * 2000 // Simplified child tax credit

    const taxableIncome = Math.max(0, totalIncome - preTaxDeductions - deductionAmount)

    // Calculate federal income tax
    let federalTax = 0
    const brackets = taxBrackets[filingStatus]

    for (let i = 0; i < brackets.length; i++) {
      const bracket = brackets[i]
      if (taxableIncome > bracket.min) {
        const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min
        federalTax += taxableInBracket * bracket.rate
      }
    }

    // Apply dependent credits (simplified)
    federalTax = Math.max(0, federalTax - dependentCredit)

    // Calculate state income tax (simplified)
    const stateTaxRate = stateTaxRates[state] || 0
    const stateTax = taxableIncome * stateTaxRate

    // Calculate FICA taxes (Social Security and Medicare)
    const socialSecurityTaxRate = 0.062
    const medicareTaxRate = 0.0145
    const socialSecurityWageCap = 160200 // 2023 wage cap

    const socialSecurityTax = Math.min(totalIncome, socialSecurityWageCap) * socialSecurityTaxRate
    const medicareTax = totalIncome * medicareTaxRate

    // Additional Medicare tax for high earners (simplified)
    const additionalMedicareTax = totalIncome > 200000 ? (totalIncome - 200000) * 0.009 : 0

    // Calculate total tax
    const totalTax = federalTax + stateTax + socialSecurityTax + medicareTax + additionalMedicareTax

    // Calculate effective tax rates
    const federalEffectiveRate = federalTax / totalIncome
    const stateEffectiveRate = stateTax / totalIncome
    const ficaEffectiveRate = (socialSecurityTax + medicareTax + additionalMedicareTax) / totalIncome
    const totalEffectiveRate = totalTax / totalIncome

    // Calculate take-home pay
    const annualTakeHome = totalIncome - totalTax
    const monthlyTakeHome = annualTakeHome / 12

    // Calculate marginal tax rate (federal + state)
    let marginalFederalRate = 0
    for (let i = brackets.length - 1; i >= 0; i--) {
      if (taxableIncome >= brackets[i].min) {
        marginalFederalRate = brackets[i].rate
        break
      }
    }
    const marginalRate = marginalFederalRate + stateTaxRate

    const results = {
      totalIncome,
      taxableIncome,
      federalTax,
      stateTax,
      socialSecurityTax,
      medicareTax,
      additionalMedicareTax,
      totalTax,
      annualTakeHome,
      monthlyTakeHome,
      federalEffectiveRate,
      stateEffectiveRate,
      ficaEffectiveRate,
      totalEffectiveRate,
      marginalRate,
      deductionAmount,
      preTaxDeductions,
    }
    return results
  }

  const results = calculateTax()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value)
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center space-y-4 text-center mb-10">
        <div className="inline-flex items-center justify-center p-2 bg-muted rounded-full">
          <DollarSign className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Income Tax Calculator</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Estimate your federal and state income taxes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
            <CardDescription>Enter your income and tax details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="income">Annual Income</Label>
                <div className="text-sm font-medium">{formatCurrency(income)}</div>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="income"
                  type="number"
                  className="pl-7"
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                />
              </div>
              <Slider
                value={[income]}
                min={0}
                max={500000}
                step={1000}
                onValueChange={(value) => setIncome(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>$0</span>
                <span>$500,000</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Filing Status</Label>
              <RadioGroup
                defaultValue={filingStatus}
                onValueChange={(value) => setFilingStatus(value as "single" | "married" | "head")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="single" id="single" />
                  <Label htmlFor="single" className="font-normal">Single</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="married" id="married" />
                  <Label htmlFor="married" className="font-normal">Married Filing Jointly</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="head" id="head" />
                  <Label htmlFor="head" className="font-normal">Head of Household</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Deduction Type</Label>
              <RadioGroup
                defaultValue={deductions}
                onValueChange={(value) => setDeductions(value as "standard" | "itemized")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard" className="font-normal">
                    Standard Deduction ({formatCurrency(standardDeductionAmounts[filingStatus])})
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="itemized" id="itemized" />
                  <Label htmlFor="itemized" className="font-normal">Itemized Deduction</Label>
                </div>
              </RadioGroup>
              {deductions === "itemized" && (
                <div className="pt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="itemizedAmount">Itemized Deduction Amount</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Sum of eligible deductions like mortgage interest, charitable donations, medical expenses, etc.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="itemizedAmount"
                      type="number"
                      className="pl-7"
                      value={itemizedAmount}
                      onChange={(e) => setItemizedAmount(Number(e.target.value))}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="dependents">Number of Dependents</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Children or other qualifying dependents for tax credits</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="dependents"
                type="number"
                min="0"
                value={dependents}
                onChange={(e) => setDependents(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CA">California</SelectItem>
                  <SelectItem value="NY">New York</SelectItem>
                  <SelectItem value="TX">Texas</SelectItem>
                  <SelectItem value="FL">Florida</SelectItem>
                  <SelectItem value="IL">Illinois</SelectItem>
                  <SelectItem value="PA">Pennsylvania</SelectItem>
                  <SelectItem value="OH">Ohio</SelectItem>
                  <SelectItem value="GA">Georgia</SelectItem>
                  <SelectItem value="NC">North Carolina</SelectItem>
                  <SelectItem value="MI">Michigan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="retirement401k">401(k) Contributions</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Annual pre-tax contributions to employer-sponsored retirement plans</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="retirement401k"
                  type="number"
                  className="pl-7"
                  value={retirement401k}
                  onChange={(e) => setRetirement401k(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="traditionalIra">Traditional IRA Contributions</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Annual contributions to a Traditional IRA (may be deductible)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="traditionalIra"
                  type="number"
                  className="pl-7"
                  value={traditionalIra}
                  onChange={(e) => setTraditionalIra(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="hsa">HSA Contributions</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Annual contributions to a Health Savings Account</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="hsa"
                  type="number"
                  className="pl-7"
                  value={hsa}
                  onChange={(e) => setHsa(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="otherIncome">Other Income</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Additional income from investments, side jobs, etc.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="otherIncome"
                  type="number"
                  className="pl-7"
                  value={otherIncome}
                  onChange={(e) => setOtherIncome(Number(e.target.value))}
                />
              </div>
            </div>

            <Button className="w-full mt-4" onClick={() => setCalculated(true)}>
              <Calculator className="mr-2 h-4 w-4" />
              Calculate Taxes
            </Button>
          </CardContent>
        </Card>

        <Card className={calculated ? "border-primary" : ""}>
          <CardHeader>
            <CardTitle>Tax Estimate</CardTitle>
            <CardDescription>Based on the information you provided</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-6 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Annual Take-Home Pay</div>
                <div className="text-3xl font-bold mt-2">{formatCurrency(results.annualTakeHome)}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {formatCurrency(results.monthlyTakeHome)} monthly
                </div>
              </div>
              <div className="text-center p-6 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Total Tax</div>
                <div className="text-3xl font-bold mt-2">{formatCurrency(results.totalTax)}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {formatPercent(results.totalEffectiveRate)} effective rate
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Tabs defaultValue="breakdown" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="breakdown">Tax Breakdown</TabsTrigger>
            <TabsTrigger value="rates">Tax Rates</TabsTrigger>
            <TabsTrigger value="details">Income Details</TabsTrigger>
          </TabsList>
          <TabsContent value="breakdown" className="space-y-4 pt-4">
            <div className="flex justify-between py-2">
              <span>Federal Income Tax</span>
              <span className="font-medium">{formatCurrency(results.federalTax)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>State Income Tax</span>
              <span className="font-medium">{formatCurrency(results.stateTax)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Social Security Tax</span>
              <span className="font-medium">{formatCurrency(results.socialSecurityTax)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Medicare Tax</span>
              <span className="font-medium">{formatCurrency(results.medicareTax)}</span>
            </div>
            {results.additionalMedicareTax > 0 && (
              <div className="flex justify-between py-2">
                <span>Additional Medicare Tax</span>
                <span className="font-medium">{formatCurrency(results.additionalMedicareTax)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between py-2">
              <span className="font-bold">Total Tax</span>
              <span className="font-bold">{formatCurrency(results.totalTax)}</span>
            </div>
          </TabsContent>
          <TabsContent value="rates" className="space-y-4 pt-4">
            <div className="flex justify-between py-2">
              <span>Marginal Tax Rate</span>
              <span className="font-medium flex items-center">
                {formatPercent(results.marginalRate)}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground ml-1" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Tax rate on your next dollar of income</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span>Federal Effective Rate</span>
              <span className="font-medium">{formatPercent(results.federalEffectiveRate)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>State Effective Rate</span>
              <span className="font-medium">{formatPercent(results.stateEffectiveRate)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>FICA Effective Rate</span>
              <span className="font-medium">{formatPercent(results.ficaEffectiveRate)}</span>
            </div>
            <Separator />
            <div className="flex justify-between py-2">
              <span className="font-bold">Total Effective Rate</span>
              <span className="font-bold">{formatPercent(results.totalEffectiveRate)}</span>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg border border-muted mt-2">
              <div className="flex items-center mb-2">
                <Percent className="h-4 w-4 text-primary mr-2" />
                <h3 className="font-medium">Understanding Tax Rates</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Your effective tax rate is the average rate you pay on your total income, while your marginal tax rate is the rate you pay on your last dollar of income. The U.S. has a progressive tax system, meaning higher income is taxed at higher rates.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="flex justify-between py-2">
              <span>Total Income</span>
              <span className="font-medium">{formatCurrency(results.totalIncome)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Pre-Tax Deductions</span>
              <span className="font-medium">- {formatCurrency(results.preTaxDeductions)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>{deductions === "standard" ? "Standard Deduction" : "Itemized Deductions"}</span>
              <span className="font-medium">- {formatCurrency(results.deductionAmount)}</span>
            </div>
            <Separator />
            <div className="flex justify-between py-2">
              <span className="font-bold">Taxable Income</span>
              <span className="font-bold">{formatCurrency(results.taxableIncome)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Filing Status</span>
              <span className="font-medium capitalize">{filingStatus}</span>
            </div>
            {dependents > 0 && (
              <div className="flex justify-between py-2">
                <span>Dependents</span>
                <span className="font-medium">{dependents}</span>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="p-4 bg-muted/50 rounded-lg border border-muted">
          <h3 className="font-medium mb-2">Tax Saving Opportunities</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            {retirement401k < 22500 && income > 50000 && (
              <li className="flex items-start">
                <DollarSign className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  Increasing your 401(k) contributions could reduce your taxable income. You can contribute up to $22,500 in 2023 ($30,000 if you're 50 or older).
                </span>
              </li>
            )}
            {traditionalIra < 6500 && income < 150000 && (
              <li className="flex items-start">
                <DollarSign className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  Consider contributing to a Traditional IRA to reduce your taxable income. You may be eligible to deduct up to $6,500 in 2023 ($7,500 if you're 50 or older).
                </span>
              </li>
            )}
            {hsa < 3850 && (
              <li className="flex items-start">
                <DollarSign className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  If you have a high-deductible health plan, consider contributing to an HSA. You can contribute up to $3,850 for individuals or $7,750 for families in 2023.
                </span>
              </li>
            )}
            {deductions === "standard" && itemizedAmount > standardDeductionAmounts[filingStatus] * 0.8 && (
              <li className="flex items-start">
                <DollarSign className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  Your itemized deductions are close to the standard deduction. Consider bunching deductions in alternate years to maximize tax benefits.
                </span>
              </li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  </div>

  <div className="mt-12 bg-muted rounded-lg p-6">
    <h2 className="text-xl font-semibold mb-4">About Income Taxes</h2>
    <p className="text-muted-foreground mb-4">
      This calculator provides an estimate of your federal and state income taxes based on the information you provide. It includes federal income tax, state income tax, and FICA taxes (Social Security and Medicare).
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Tax Deductions vs. Credits</h3>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>
            <strong>Tax Deductions:</strong> Reduce your taxable income before calculating taxes (e.g., mortgage interest, charitable donations)
          </li>
          <li>
            <strong>Tax Credits:</strong> Directly reduce your tax bill dollar-
  for-dollar (e.g., Child Tax Credit, Earned Income Credit)
  </li>
        </ul>
        <p className="text-muted-foreground mt-2">
          Credits are generally more valuable than deductions of the same amount because they directly reduce your tax liability rather than just your taxable income.
        </p>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Tax-Advantaged Accounts</h3>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>
            <strong>401(k) and Traditional IRA:</strong> Contributions reduce your current taxable income, but withdrawals in retirement are taxed
          </li>
          <li>
            <strong>Roth 401(k) and Roth IRA:</strong> Contributions are made
  with after-tax dollars, but
  qualified
  withdrawals in retirement
  are
  tax - free
  </li>
          <li>
            <strong>HSA:</strong> Triple tax advantage - tax-deductible contributions, tax-free growth, and tax-free withdrawals
  for qualified medical expenses
  </li>
        </ul>
      </div>
    </div>
  </div>
</div>
  )
}

