"use client"

import { useState } from "react"
import { Calculator, Home, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function MortgageCalculatorPage() {
  const [homePrice, setHomePrice] = useState(300000)
  const [downPayment, setDownPayment] = useState(60000)
  const [loanTerm, setLoanTerm] = useState(30)
  const [interestRate, setInterestRate] = useState(4.5)
  const [propertyTax, setPropertyTax] = useState(1.2)
  const [homeInsurance, setHomeInsurance] = useState(1200)
  const [pmi, setPmi] = useState(0.5)
  const [hoa, setHoa] = useState(0)
  const [calculated, setCalculated] = useState(false)

  const calculateMortgage = () => {
    // Calculate loan amount
    const loanAmount = homePrice - downPayment

    // Calculate down payment percentage
    const downPaymentPercentage = (downPayment / homePrice) * 100

    // Calculate monthly principal and interest payment
    const monthlyInterestRate = interestRate / 100 / 12
    const numberOfPayments = loanTerm * 12
    const monthlyPrincipalAndInterest =
      (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)

    // Calculate monthly property tax
    const monthlyPropertyTax = (homePrice * (propertyTax / 100)) / 12

    // Calculate monthly home insurance
    const monthlyHomeInsurance = homeInsurance / 12

    // Calculate PMI (if down payment is less than 20%)
    const monthlyPmi = downPaymentPercentage < 20 ? (loanAmount * (pmi / 100)) / 12 : 0

    // Calculate monthly HOA fee
    const monthlyHoa = hoa

    // Calculate total monthly payment
    const totalMonthlyPayment =
      monthlyPrincipalAndInterest + monthlyPropertyTax + monthlyHomeInsurance + monthlyPmi + monthlyHoa

    // Calculate total payment over loan term
    const totalPayment = totalMonthlyPayment * numberOfPayments

    // Calculate total interest paid
    const totalInterestPaid = totalMonthlyPayment * numberOfPayments - loanAmount

    // Generate amortization schedule (first 12 months)
    const amortizationSchedule = []
    let remainingBalance = loanAmount

    for (let month = 1; month <= 12; month++) {
      const interestPayment = remainingBalance * monthlyInterestRate
      const principalPayment = monthlyPrincipalAndInterest - interestPayment
      remainingBalance -= principalPayment

      amortizationSchedule.push({
        month,
        payment: monthlyPrincipalAndInterest,
        principalPayment,
        interestPayment,
        remainingBalance,
      })
    }

    return {
      loanAmount,
      downPaymentPercentage,
      monthlyPrincipalAndInterest,
      monthlyPropertyTax,
      monthlyHomeInsurance,
      monthlyPmi,
      monthlyHoa,
      totalMonthlyPayment,
      totalPayment,
      totalInterestPaid,
      amortizationSchedule,
    }
  }

  const results = calculateMortgage()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatCurrencyWithCents = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center space-y-4 text-center mb-10">
        <div className="inline-flex items-center justify-center p-2 bg-muted rounded-full">
          <Home className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Mortgage Calculator</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Calculate your monthly mortgage payments and view your amortization schedule
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Mortgage Details</CardTitle>
            <CardDescription>Enter information about your home purchase and loan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="homePrice">Home Price</Label>
                <div className="text-sm font-medium">{formatCurrency(homePrice)}</div>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="homePrice"
                  type="number"
                  className="pl-7"
                  value={homePrice}
                  onChange={(e) => {
                    const value = Number(e.target.value)
                    setHomePrice(value)
                    // Adjust down payment to maintain the same percentage
                    setDownPayment(Math.round(value * (downPayment / homePrice)))
                  }}
                />
              </div>
              <Slider
                value={[homePrice]}
                min={50000}
                max={1000000}
                step={5000}
                onValueChange={(value) => {
                  setHomePrice(value[0])
                  // Adjust down payment to maintain the same percentage
                  setDownPayment(Math.round(value[0] * (downPayment / homePrice)))
                }}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>$50,000</span>
                <span>$1,000,000</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="downPayment">Down Payment</Label>
                <div className="text-sm font-medium">
                  {formatCurrency(downPayment)} ({Math.round((downPayment / homePrice) * 100)}%)
                </div>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="downPayment"
                  type="number"
                  className="pl-7"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                />
              </div>
              <Slider
                value={[downPayment]}
                min={0}
                max={homePrice * 0.5}
                step={1000}
                onValueChange={(value) => setDownPayment(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>$0</span>
                <span>{formatCurrency(homePrice * 0.5)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="loanTerm">Loan Term (Years)</Label>
                <div className="text-sm font-medium">{loanTerm} years</div>
              </div>
              <div className="flex space-x-2">
                {[15, 20, 30].map((term) => (
                  <Button
                    key={term}
                    type="button"
                    variant={loanTerm === term ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setLoanTerm(term)}
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="interestRate">Interest Rate (%)</Label>
                <div className="text-sm font-medium">{interestRate}%</div>
              </div>
              <div className="relative">
                <Input
                  id="interestRate"
                  type="number"
                  step="0.125"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
              </div>
              <Slider
                value={[interestRate]}
                min={2}
                max={10}
                step={0.125}
                onValueChange={(value) => setInterestRate(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>2%</span>
                <span>10%</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="propertyTax">Property Tax Rate (%)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Annual property tax as a percentage of home value</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative">
                <Input
                  id="propertyTax"
                  type="number"
                  step="0.1"
                  value={propertyTax}
                  onChange={(e) => setPropertyTax(Number(e.target.value))}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="homeInsurance">Annual Home Insurance</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Annual cost of home insurance</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="homeInsurance"
                  type="number"
                  className="pl-7"
                  value={homeInsurance}
                  onChange={(e) => setHomeInsurance(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="pmi">PMI Rate (%)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Private Mortgage Insurance rate (typically required if down payment is less than 20%)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative">
                <Input id="pmi" type="number" step="0.1" value={pmi} onChange={(e) => setPmi(Number(e.target.value))} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="hoa">Monthly HOA Fees</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Monthly Homeowners Association fees (if applicable)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="hoa"
                  type="number"
                  className="pl-7"
                  value={hoa}
                  onChange={(e) => setHoa(Number(e.target.value))}
                />
              </div>
            </div>

            <Button className="w-full mt-4" onClick={() => setCalculated(true)}>
              <Calculator className="mr-2 h-4 w-4" />
              Calculate Mortgage
            </Button>
          </CardContent>
        </Card>

        <Card className={calculated ? "border-primary" : ""}>
          <CardHeader>
            <CardTitle>Mortgage Summary</CardTitle>
            <CardDescription>Based on the information you provided</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-6 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Monthly Payment</div>
              <div className="text-4xl font-bold mt-2">{formatCurrencyWithCents(results.totalMonthlyPayment)}</div>
            </div>

            <Tabs defaultValue="monthly">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
                <TabsTrigger value="amortization">Amortization</TabsTrigger>
              </TabsList>
              <TabsContent value="monthly" className="space-y-4 pt-4">
                <div className="flex justify-between py-2">
                  <span>Principal & Interest</span>
                  <span className="font-medium">{formatCurrencyWithCents(results.monthlyPrincipalAndInterest)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Property Tax</span>
                  <span className="font-medium">{formatCurrencyWithCents(results.monthlyPropertyTax)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Home Insurance</span>
                  <span className="font-medium">{formatCurrencyWithCents(results.monthlyHomeInsurance)}</span>
                </div>
                {results.monthlyPmi > 0 && (
                  <div className="flex justify-between py-2">
                    <span>PMI</span>
                    <span className="font-medium">{formatCurrencyWithCents(results.monthlyPmi)}</span>
                  </div>
                )}
                {results.monthlyHoa > 0 && (
                  <div className="flex justify-between py-2">
                    <span>HOA Fees</span>
                    <span className="font-medium">{formatCurrencyWithCents(results.monthlyHoa)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between py-2">
                  <span className="font-bold">Total Monthly Payment</span>
                  <span className="font-bold">{formatCurrencyWithCents(results.totalMonthlyPayment)}</span>
                </div>
              </TabsContent>
              <TabsContent value="breakdown" className="space-y-4 pt-4">
                <div className="flex justify-between py-2">
                  <span>Home Price</span>
                  <span className="font-medium">{formatCurrency(homePrice)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Down Payment</span>
                  <span className="font-medium">
                    {formatCurrency(downPayment)} ({Math.round((downPayment / homePrice) * 100)}%)
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Loan Amount</span>
                  <span className="font-medium">{formatCurrency(results.loanAmount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between py-2">
                  <span>Loan Term</span>
                  <span className="font-medium">{loanTerm} years</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Interest Rate</span>
                  <span className="font-medium">{interestRate}%</span>
                </div>
                <Separator />
                <div className="flex justify-between py-2">
                  <span>Total of {loanTerm * 12} Payments</span>
                  <span className="font-medium">{formatCurrency(results.totalPayment)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Total Interest Paid</span>
                  <span className="font-medium">{formatCurrency(results.totalInterestPaid)}</span>
                </div>
              </TabsContent>
              <TabsContent value="amortization" className="pt-4">
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="p-2 text-left">Month</th>
                        <th className="p-2 text-right">Payment</th>
                        <th className="p-2 text-right">Principal</th>
                        <th className="p-2 text-right">Interest</th>
                        <th className="p-2 text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.amortizationSchedule.map((payment) => (
                        <tr key={payment.month} className="border-t">
                          <td className="p-2">{payment.month}</td>
                          <td className="p-2 text-right">{formatCurrencyWithCents(payment.payment)}</td>
                          <td className="p-2 text-right">{formatCurrencyWithCents(payment.principalPayment)}</td>
                          <td className="p-2 text-right">{formatCurrencyWithCents(payment.interestPayment)}</td>
                          <td className="p-2 text-right">{formatCurrencyWithCents(payment.remainingBalance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="text-center mt-4 text-sm text-muted-foreground">
                  Showing first 12 months of amortization schedule
                </div>
              </TabsContent>
            </Tabs>

            <div className="p-4 bg-muted/50 rounded-lg border border-muted">
              <h3 className="font-medium mb-2">Did you know?</h3>
              <p className="text-sm text-muted-foreground">
                {loanTerm > 15 ? (
                  <>
                    Switching to a 15-year mortgage could save you approximately{" "}
                    {formatCurrency(results.totalInterestPaid * 0.4)} in interest over the life of the loan, but your
                    monthly payment would increase.
                  </>
                ) : (
                  <>
                    By making an extra payment of {formatCurrency(results.monthlyPrincipalAndInterest)} once a year, you
                    could pay off your mortgage about {Math.round(loanTerm * 0.15)} years earlier and save approximately{" "}
                    {formatCurrency(results.totalInterestPaid * 0.15)} in interest.
                  </>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 bg-muted rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">About Mortgage Calculations</h2>
        <p className="text-muted-foreground mb-4">
          This mortgage calculator helps you estimate your monthly mortgage payment, including principal and interest,
          property taxes, homeowners insurance, and PMI. It also generates an amortization schedule showing how your
          loan balance decreases over time.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Understanding Your Mortgage</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>
                <strong>Principal and Interest:</strong> The portion of your payment that goes toward paying off the
                loan amount and the interest charged by the lender
              </li>
              <li>
                <strong>Property Taxes:</strong> Annual taxes assessed by your local government based on your property's
                value
              </li>
              <li>
                <strong>Homeowners Insurance:</strong> Protects your home against damage, theft, and liability
              </li>
              <li>
                <strong>PMI (Private Mortgage Insurance):</strong> Required if your down payment is less than 20% of the
                home's value
              </li>
              <li>
                <strong>HOA Fees:</strong> Monthly fees paid to a homeowners association for maintenance of common areas
                and amenities
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Tips for Homebuyers</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Aim for a down payment of at least 20% to avoid PMI</li>
              <li>Consider a 15-year mortgage to save on interest and build equity faster</li>
              <li>Shop around for the best interest rates and loan terms</li>
              <li>Get pre-approved for a mortgage before house hunting</li>
              <li>
                Remember that your total monthly housing costs should ideally be less than 28% of your gross monthly
                income
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

