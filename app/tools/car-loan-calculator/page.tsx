"use client"

import { useState } from "react"
import { Calculator, Car, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function CarLoanCalculatorPage() {
  const [carPrice, setCarPrice] = useState(30000)
  const [downPayment, setDownPayment] = useState(5000)
  const [loanTerm, setLoanTerm] = useState(60)
  const [interestRate, setInterestRate] = useState(4.5)
  const [calculated, setCalculated] = useState(false)

  const calculateLoan = () => {
    const loanAmount = carPrice - downPayment
    const monthlyRate = interestRate / 100 / 12
    const monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1)

    const totalPayment = monthlyPayment * loanTerm
    const totalInterest = totalPayment - loanAmount

    return {
      loanAmount,
      monthlyPayment,
      totalPayment,
      totalInterest,
    }
  }

  const results = calculateLoan()

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
          <Car className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Car Loan Calculator</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Estimate your monthly car payments and total interest
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Enter Loan Details</CardTitle>
            <CardDescription>
              Fill in the details about your car loan to calculate your monthly payments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="carPrice">Car Price</Label>
                <div className="text-sm font-medium">{formatCurrency(carPrice)}</div>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="carPrice"
                  type="number"
                  className="pl-7"
                  value={carPrice}
                  onChange={(e) => setCarPrice(Number(e.target.value))}
                />
              </div>
              <Slider
                value={[carPrice]}
                min={5000}
                max={100000}
                step={1000}
                onValueChange={(value) => setCarPrice(value[0])}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>$5,000</span>
                <span>$100,000</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="downPayment">Down Payment</Label>
                <div className="text-sm font-medium">{formatCurrency(downPayment)}</div>
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
                max={carPrice / 2}
                step={500}
                onValueChange={(value) => setDownPayment(value[0])}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>$0</span>
                <span>{formatCurrency(carPrice / 2)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Label htmlFor="loanTerm">Loan Term</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">The length of time to repay the loan in months</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="text-sm font-medium">
                  {loanTerm} months ({Math.floor(loanTerm / 12)} years)
                </div>
              </div>
              <Input
                id="loanTerm"
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
              />
              <Slider
                value={[loanTerm]}
                min={12}
                max={84}
                step={12}
                onValueChange={(value) => setLoanTerm(value[0])}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>12 mo</span>
                <span>36 mo</span>
                <span>60 mo</span>
                <span>84 mo</span>
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
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
              </div>
              <Slider
                value={[interestRate]}
                min={0}
                max={20}
                step={0.1}
                onValueChange={(value) => setInterestRate(value[0])}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>5%</span>
                <span>10%</span>
                <span>15%</span>
                <span>20%</span>
              </div>
            </div>

            <Button className="w-full mt-4" onClick={() => setCalculated(true)}>
              <Calculator className="mr-2 h-4 w-4" />
              Calculate Loan
            </Button>
          </CardContent>
        </Card>

        <Card className={calculated ? "border-primary" : ""}>
          <CardHeader>
            <CardTitle>Loan Summary</CardTitle>
            <CardDescription>Based on the information you provided</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-6 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Monthly Payment</div>
              <div className="text-4xl font-bold mt-2">{formatCurrencyWithCents(results.monthlyPayment)}</div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between py-2">
                <span>Car Price</span>
                <span className="font-medium">{formatCurrency(carPrice)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Down Payment</span>
                <span className="font-medium">- {formatCurrency(downPayment)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Loan Amount</span>
                <span className="font-medium">{formatCurrency(results.loanAmount)}</span>
              </div>
              <Separator />
              <div className="flex justify-between py-2">
                <span>Loan Term</span>
                <span className="font-medium">
                  {loanTerm} months ({Math.floor(loanTerm / 12)} years)
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span>Interest Rate</span>
                <span className="font-medium">{interestRate}%</span>
              </div>
              <Separator />
              <div className="flex justify-between py-2">
                <span>Monthly Payment</span>
                <span className="font-medium">{formatCurrencyWithCents(results.monthlyPayment)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Total of {loanTerm} Payments</span>
                <span className="font-medium">{formatCurrency(results.totalPayment)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Total Interest</span>
                <span className="font-medium">{formatCurrency(results.totalInterest)}</span>
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg border border-muted">
              <h3 className="font-medium mb-2">Did you know?</h3>
              <p className="text-sm text-muted-foreground">
                A shorter loan term will increase your monthly payment but save you money on interest in the long run.
                Consider a {Math.max(36, loanTerm - 24)}-month loan to save approximately{" "}
                {formatCurrency(results.totalInterest * 0.3)} in interest.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 bg-muted rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">About This Calculator</h2>
        <p className="text-muted-foreground mb-4">
          This car loan calculator helps you estimate your monthly car payments based on the purchase price, down
          payment, loan term, and interest rate. It also calculates the total amount you'll pay over the life of the
          loan and how much of that will go toward interest.
        </p>
        <p className="text-muted-foreground mb-4">
          Keep in mind that this is an estimate, and actual loan terms may vary based on your credit score, the lender,
          and other factors. For a more accurate assessment, contact your bank or credit union.
        </p>
        <h3 className="text-lg font-semibold mb-2">Tips for Getting the Best Auto Loan</h3>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>Check your credit score before applying for a loan</li>
          <li>Shop around and compare rates from multiple lenders</li>
          <li>Consider getting pre-approved before visiting a dealership</li>
          <li>Make a larger down payment to reduce your loan amount and monthly payments</li>
          <li>Choose a shorter loan term to save on interest, if you can afford the higher monthly payments</li>
        </ul>
      </div>
    </div>
  )
}

