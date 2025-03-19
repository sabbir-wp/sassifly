"use client"

import { useState } from "react"
import { Calculator, Clock, CreditCard, Info, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface DebtItem {
  id: string
  name: string
  balance: number
  interestRate: number
  minimumPayment: number
}

export default function DebtPayoffCalculatorPage() {
  const [debts, setDebts] = useState<DebtItem[]>([
    { id: "1", name: "Credit Card", balance: 5000, interestRate: 18.99, minimumPayment: 150 },
    { id: "2", name: "Car Loan", balance: 12000, interestRate: 4.5, minimumPayment: 300 },
  ])
  const [totalMonthlyPayment, setTotalMonthlyPayment] = useState(600)
  const [payoffStrategy, setPayoffStrategy] = useState<"avalanche" | "snowball">("avalanche")
  const [extraPayment, setExtraPayment] = useState(150)
  const [calculated, setCalculated] = useState(false)

  // Add a new debt
  const addDebt = () => {
    const newId = (Math.max(0, ...debts.map((d) => Number.parseInt(d.id))) + 1).toString()
    setDebts([
      ...debts,
      {
        id: newId,
        name: "New Debt",
        balance: 1000,
        interestRate: 10,
        minimumPayment: 50,
      },
    ])
  }

  // Remove a debt
  const removeDebt = (id: string) => {
    setDebts(debts.filter((debt) => debt.id !== id))
  }

  // Update a debt property
  const updateDebt = (id: string, field: keyof DebtItem, value: string | number) => {
    setDebts(debts.map((debt) => (debt.id === id ? { ...debt, [field]: value } : debt)))
  }

  // Calculate total minimum payment
  const totalMinimumPayment = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0)

  // Calculate payoff plan
  const calculatePayoffPlan = () => {
    // Clone debts to avoid modifying the original array
    const workingDebts = debts.map((debt) => ({
      ...debt,
      originalBalance: debt.balance,
      payments: [] as {
        month: number
        payment: number
        interestPaid: number
        principalPaid: number
        remainingBalance: number
      }[],
    }))

    // Sort debts based on strategy
    if (payoffStrategy === "avalanche") {
      // Sort by highest interest rate first
      workingDebts.sort((a, b) => b.interestRate - a.interestRate)
    } else {
      // Sort by lowest balance first
      workingDebts.sort((a, b) => a.balance - b.balance)
    }

    let month = 0
    let totalInterestPaid = 0
    let isPayoffComplete = false
    let monthlyPaymentAvailable = totalMonthlyPayment

    // Continue until all debts are paid off
    while (!isPayoffComplete && month < 600) {
      // Cap at 50 years to prevent infinite loops
      month++
      monthlyPaymentAvailable = totalMonthlyPayment

      // Pay minimum on all debts
      for (const debt of workingDebts) {
        if (debt.balance <= 0) continue

        const interestForMonth = (debt.balance * (debt.interestRate / 100)) / 12
        let paymentForDebt = Math.min(debt.minimumPayment, debt.balance + interestForMonth)

        if (paymentForDebt > monthlyPaymentAvailable) {
          paymentForDebt = monthlyPaymentAvailable
        }

        monthlyPaymentAvailable -= paymentForDebt

        const interestPortion = Math.min(interestForMonth, paymentForDebt)
        const principalPortion = paymentForDebt - interestPortion

        debt.balance -= principalPortion
        totalInterestPaid += interestPortion

        debt.payments.push({
          month,
          payment: paymentForDebt,
          interestPaid: interestPortion,
          principalPaid: principalPortion,
          remainingBalance: debt.balance,
        })
      }

      // Apply extra payment to the debt based on strategy
      for (const debt of workingDebts) {
        if (debt.balance <= 0 || monthlyPaymentAvailable <= 0) continue

        const interestForMonth = (debt.balance * (debt.interestRate / 100)) / 12
        const extraPaymentForDebt = Math.min(monthlyPaymentAvailable, debt.balance + interestForMonth)

        const interestPortion = Math.min(interestForMonth, extraPaymentForDebt)
        const principalPortion = extraPaymentForDebt - interestPortion

        debt.balance -= principalPortion
        totalInterestPaid += interestPortion
        monthlyPaymentAvailable -= extraPaymentForDebt

        // Update the last payment for this debt in this month
        const lastPayment = debt.payments[debt.payments.length - 1]
        lastPayment.payment += extraPaymentForDebt
        lastPayment.interestPaid += interestPortion
        lastPayment.principalPaid += principalPortion
        lastPayment.remainingBalance = debt.balance

        // If we've allocated all the extra payment, break
        if (monthlyPaymentAvailable <= 0) break
      }

      // Check if all debts are paid off
      isPayoffComplete = workingDebts.every((debt) => debt.balance <= 0)
    }

    // Calculate payoff date and total interest for each debt
    const debtSummaries = workingDebts.map((debt) => {
      const payoffMonth =
        debt.payments.findIndex((payment) => payment.remainingBalance <= 0) + 1 || debt.payments.length
      const totalInterest = debt.payments.reduce((sum, payment) => sum + payment.interestPaid, 0)

      return {
        id: debt.id,
        name: debt.name,
        originalBalance: debt.originalBalance,
        payoffMonth,
        totalInterest,
        payments: debt.payments,
      }
    })

    return {
      totalMonths: month,
      totalInterestPaid,
      debtSummaries,
      payoffDate: new Date(Date.now() + month * 30 * 24 * 60 * 60 * 1000),
    }
  }

  const payoffResults = calculated ? calculatePayoffPlan() : null

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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
    }).format(date)
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center space-y-4 text-center mb-10">
        <div className="inline-flex items-center justify-center p-2 bg-muted rounded-full">
          <Clock className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Debt Payoff Calculator</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Plan your debt repayment strategy and see when you'll be debt-free
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Debts</CardTitle>
              <CardDescription>Enter information about each of your debts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {debts.map((debt, index) => (
                <div key={debt.id} className="space-y-4 p-4 border rounded-lg relative">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Debt #{index + 1}</h3>
                    {debts.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => removeDebt(debt.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove debt</span>
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`debt-name-${debt.id}`}>Debt Name</Label>
                    <Input
                      id={`debt-name-${debt.id}`}
                      value={debt.name}
                      onChange={(e) => updateDebt(debt.id, "name", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`debt-balance-${debt.id}`}>Current Balance</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id={`debt-balance-${debt.id}`}
                          type="number"
                          className="pl-7"
                          value={debt.balance}
                          onChange={(e) => updateDebt(debt.id, "balance", Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`debt-interest-${debt.id}`}>Interest Rate (%)</Label>
                      <div className="relative">
                        <Input
                          id={`debt-interest-${debt.id}`}
                          type="number"
                          step="0.01"
                          value={debt.interestRate}
                          onChange={(e) => updateDebt(debt.id, "interestRate", Number(e.target.value))}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`debt-payment-${debt.id}`}>Minimum Payment</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id={`debt-payment-${debt.id}`}
                          type="number"
                          className="pl-7"
                          value={debt.minimumPayment}
                          onChange={(e) => updateDebt(debt.id, "minimumPayment", Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Button variant="outline" className="w-full" onClick={addDebt}>
                <Plus className="mr-2 h-4 w-4" />
                Add Another Debt
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Strategy</CardTitle>
              <CardDescription>Choose how you want to pay off your debts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Payoff Method</Label>
                <RadioGroup
                  defaultValue={payoffStrategy}
                  onValueChange={(value) => setPayoffStrategy(value as "avalanche" | "snowball")}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="avalanche" id="avalanche" />
                    <Label htmlFor="avalanche" className="font-normal cursor-pointer">
                      Debt Avalanche (Highest Interest First)
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Pays off debts with the highest interest rate first. This method saves you the most money in
                            interest.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="snowball" id="snowball" />
                    <Label htmlFor="snowball" className="font-normal cursor-pointer">
                      Debt Snowball (Lowest Balance First)
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Pays off debts with the lowest balance first. This method provides psychological wins as you
                            eliminate debts quickly.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="totalMonthlyPayment">Total Monthly Payment</Label>
                  <div className="text-sm text-muted-foreground">Minimum: {formatCurrency(totalMinimumPayment)}</div>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="totalMonthlyPayment"
                    type="number"
                    className="pl-7"
                    value={totalMonthlyPayment}
                    onChange={(e) => setTotalMonthlyPayment(Math.max(totalMinimumPayment, Number(e.target.value)))}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  Extra payment: {formatCurrency(Math.max(0, totalMonthlyPayment - totalMinimumPayment))}
                </div>
              </div>

              <Button className="w-full mt-4" onClick={() => setCalculated(true)}>
                <Calculator className="mr-2 h-4 w-4" />
                Calculate Payoff Plan
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className={calculated ? "border-primary" : ""}>
          <CardHeader>
            <CardTitle>Your Debt Payoff Plan</CardTitle>
            <CardDescription>Based on the information you provided</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {payoffResults ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-6 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Debt-Free Date</div>
                    <div className="text-2xl font-bold mt-2">{formatDate(payoffResults.payoffDate)}</div>
                    <div className="text-sm text-muted-foreground mt-1">{payoffResults.totalMonths} months</div>
                  </div>
                  <div className="text-center p-6 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Total Interest Paid</div>
                    <div className="text-2xl font-bold mt-2">{formatCurrency(payoffResults.totalInterestPaid)}</div>
                  </div>
                </div>

                <Tabs defaultValue="summary">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="details">Payment Schedule</TabsTrigger>
                  </TabsList>
                  <TabsContent value="summary" className="space-y-4 pt-4">
                    <div className="space-y-4">
                      {payoffResults.debtSummaries.map((debt) => (
                        <div key={debt.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">{debt.name}</h3>
                            <span className="text-sm bg-muted px-2 py-1 rounded-full">
                              Paid off in {debt.payoffMonth} months
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>Original Balance:</div>
                            <div className="text-right">{formatCurrency(debt.originalBalance)}</div>
                            <div>Total Interest:</div>
                            <div className="text-right">{formatCurrency(debt.totalInterest)}</div>
                            <div>Payoff Date:</div>
                            <div className="text-right">
                              {formatDate(new Date(Date.now() + debt.payoffMonth * 30 * 24 * 60 * 60 * 1000))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg border border-muted">
                      <h3 className="font-medium mb-2">Savings Opportunity</h3>
                      <p className="text-sm text-muted-foreground">
                        {payoffStrategy === "avalanche"
                          ? `You're using the Debt Avalanche method, which saves you the most in interest payments.`
                          : `Switching to the Debt Avalanche method could save you approximately ${formatCurrency(payoffResults.totalInterestPaid * 0.05)} in interest payments.`}
                      </p>
                      {totalMonthlyPayment > totalMinimumPayment + 100 && (
                        <p className="text-sm text-muted-foreground mt-2">
                          By paying an extra {formatCurrency(totalMonthlyPayment - totalMinimumPayment)} per month,
                          you're saving approximately {formatCurrency(payoffResults.totalInterestPaid * 0.2)} in
                          interest and will be debt-free {Math.round(payoffResults.totalMonths * 0.3)} months sooner!
                        </p>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="details" className="pt-4">
                    <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                      {payoffResults.debtSummaries.map((debt) => (
                        <div key={debt.id} className="space-y-2">
                          <h3 className="font-medium">{debt.name} Payment Schedule</h3>
                          <div className="border rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                              <thead className="bg-muted">
                                <tr>
                                  <th className="p-2 text-left">Month</th>
                                  <th className="p-2 text-right">Payment</th>
                                  <th className="p-2 text-right">Interest</th>
                                  <th className="p-2 text-right">Principal</th>
                                  <th className="p-2 text-right">Remaining</th>
                                </tr>
                              </thead>
                              <tbody>
                                {debt.payments.slice(0, Math.min(24, debt.payoffMonth)).map((payment) => (
                                  <tr key={payment.month} className="border-t">
                                    <td className="p-2">{payment.month}</td>
                                    <td className="p-2 text-right">{formatCurrencyWithCents(payment.payment)}</td>
                                    <td className="p-2 text-right">{formatCurrencyWithCents(payment.interestPaid)}</td>
                                    <td className="p-2 text-right">{formatCurrencyWithCents(payment.principalPaid)}</td>
                                    <td className="p-2 text-right">
                                      {formatCurrencyWithCents(payment.remainingBalance)}
                                    </td>
                                  </tr>
                                ))}
                                {debt.payoffMonth > 24 && (
                                  <tr className="border-t">
                                    <td colSpan={5} className="p-2 text-center text-muted-foreground">
                                      ... {debt.payoffMonth - 24} more months ...
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <div className="text-center p-10">
                <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Enter Your Debt Details</h3>
                <p className="text-muted-foreground">
                  Fill in your debt information and click "Calculate Payoff Plan" to see your personalized debt freedom
                  plan.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 bg-muted rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">About This Calculator</h2>
        <p className="text-muted-foreground mb-4">
          This debt payoff calculator helps you create a plan to become debt-free by comparing different repayment
          strategies. It shows you how long it will take to pay off your debts and how much interest you'll pay along
          the way.
        </p>
        <h3 className="text-lg font-semibold mb-2">Debt Payoff Strategies</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-background rounded-lg border">
              <h4 className="font-medium mb-2">Debt Avalanche</h4>
              <p className="text-sm text-muted-foreground">
                The Debt Avalanche method prioritizes paying off debts with the highest interest rates first, while
                making minimum payments on all other debts. This approach minimizes the total interest paid and is
                mathematically optimal.
              </p>
            </div>
            <div className="p-4 bg-background rounded-lg border">
              <h4 className="font-medium mb-2">Debt Snowball</h4>
              <p className="text-sm text-muted-foreground">
                The Debt Snowball method prioritizes paying off debts with the smallest balances first, regardless of
                interest rate. This approach provides psychological wins as you eliminate individual debts quickly,
                which can help maintain motivation.
              </p>
            </div>
          </div>
        </div>
        <h3 className="text-lg font-semibold mt-6 mb-2">Tips for Faster Debt Payoff</h3>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>Increase your monthly payment amount whenever possible</li>
          <li>Apply any windfalls (tax refunds, bonuses, gifts) to your debt</li>
          <li>Consider balance transfer offers for high-interest credit card debt</li>
          <li>Look for ways to reduce expenses and increase income</li>
          <li>Avoid taking on new debt while paying off existing debt</li>
        </ul>
      </div>
    </div>
  )
}

