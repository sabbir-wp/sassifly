"use client"

import { useState } from "react"
import { Calculator, CreditCard, DollarSign, Info, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface IncomeItem {
  id: string
  name: string
  amount: number
  frequency: "weekly" | "biweekly" | "monthly" | "annually"
}

interface ExpenseItem {
  id: string
  name: string
  amount: number
  category: string
  frequency: "weekly" | "biweekly" | "monthly" | "annually"
}

export default function BudgetCalculatorPage() {
  const [incomes, setIncomes] = useState<IncomeItem[]>([
    { id: "1", name: "Primary Job", amount: 4000, frequency: "monthly" },
    { id: "2", name: "Side Hustle", amount: 500, frequency: "monthly" },
  ])

  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    { id: "1", name: "Rent/Mortgage", amount: 1500, category: "Housing", frequency: "monthly" },
    { id: "2", name: "Utilities", amount: 200, category: "Housing", frequency: "monthly" },
    { id: "3", name: "Groceries", amount: 400, category: "Food", frequency: "monthly" },
    { id: "4", name: "Dining Out", amount: 200, category: "Food", frequency: "monthly" },
    { id: "5", name: "Car Payment", amount: 300, category: "Transportation", frequency: "monthly" },
    { id: "6", name: "Gas", amount: 150, category: "Transportation", frequency: "monthly" },
    { id: "7", name: "Insurance", amount: 200, category: "Insurance", frequency: "monthly" },
    { id: "8", name: "Subscriptions", amount: 50, category: "Entertainment", frequency: "monthly" },
  ])

  const [savingsGoal, setSavingsGoal] = useState(1000)
  const [calculated, setCalculated] = useState(false)

  // Add a new income
  const addIncome = () => {
    const newId = (Math.max(0, ...incomes.map((i) => Number.parseInt(i.id))) + 1).toString()
    setIncomes([
      ...incomes,
      {
        id: newId,
        name: "New Income",
        amount: 0,
        frequency: "monthly",
      },
    ])
  }

  // Remove an income
  const removeIncome = (id: string) => {
    setIncomes(incomes.filter((income) => income.id !== id))
  }

  // Update an income property
  const updateIncome = (id: string, field: keyof IncomeItem, value: string | number) => {
    setIncomes(incomes.map((income) => (income.id === id ? { ...income, [field]: value } : income)))
  }

  // Add a new expense
  const addExpense = () => {
    const newId = (Math.max(0, ...expenses.map((e) => Number.parseInt(e.id))) + 1).toString()
    setExpenses([
      ...expenses,
      {
        id: newId,
        name: "New Expense",
        amount: 0,
        category: "Other",
        frequency: "monthly",
      },
    ])
  }

  // Remove an expense
  const removeExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id))
  }

  // Update an expense property
  const updateExpense = (id: string, field: keyof ExpenseItem, value: string | number) => {
    setExpenses(expenses.map((expense) => (expense.id === id ? { ...expense, [field]: value } : expense)))
  }

  // Convert all amounts to monthly
  const convertToMonthly = (amount: number, frequency: string): number => {
    switch (frequency) {
      case "weekly":
        return amount * 4.33
      case "biweekly":
        return amount * 2.17
      case "annually":
        return amount / 12
      default:
        return amount
    }
  }

  // Calculate budget
  const calculateBudget = () => {
    // Calculate total monthly income
    const totalMonthlyIncome = incomes.reduce(
      (sum, income) => sum + convertToMonthly(income.amount, income.frequency),
      0,
    )

    // Calculate total monthly expenses by category
    const expensesByCategory: Record<string, number> = {}
    let totalMonthlyExpenses = 0

    expenses.forEach((expense) => {
      const monthlyAmount = convertToMonthly(expense.amount, expense.frequency)
      totalMonthlyExpenses += monthlyAmount

      if (expensesByCategory[expense.category]) {
        expensesByCategory[expense.category] += monthlyAmount
      } else {
        expensesByCategory[expense.category] = monthlyAmount
      }
    })

    // Calculate monthly surplus/deficit
    const monthlySurplus = totalMonthlyIncome - totalMonthlyExpenses

    // Calculate if savings goal is met
    const savingsGoalMet = monthlySurplus >= savingsGoal

    // Calculate expense percentages
    const expensePercentages: Record<string, number> = {}
    Object.keys(expensesByCategory).forEach((category) => {
      expensePercentages[category] = (expensesByCategory[category] / totalMonthlyIncome) * 100
    })

    // Calculate recommended budget based on 50/30/20 rule
    const recommendedBudget = {
      needs: totalMonthlyIncome * 0.5, // 50% for needs
      wants: totalMonthlyIncome * 0.3, // 30% for wants
      savings: totalMonthlyIncome * 0.2, // 20% for savings
    }

    // Categorize expenses as needs or wants (simplified)
    const needsCategories = ["Housing", "Transportation", "Food", "Insurance", "Healthcare", "Debt"]
    const wantsCategories = ["Entertainment", "Shopping", "Travel", "Dining Out", "Other"]

    let actualNeeds = 0
    let actualWants = 0

    Object.keys(expensesByCategory).forEach((category) => {
      if (needsCategories.includes(category)) {
        actualNeeds += expensesByCategory[category]
      } else if (wantsCategories.includes(category)) {
        actualWants += expensesByCategory[category]
      }
    })

    const actualSavings = monthlySurplus

    return {
      totalMonthlyIncome,
      totalMonthlyExpenses,
      monthlySurplus,
      savingsGoalMet,
      expensesByCategory,
      expensePercentages,
      recommendedBudget,
      actualNeeds,
      actualWants,
      actualSavings,
    }
  }

  const results = calculateBudget()

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
    }).format(value / 100)
  }

  // Get unique expense categories
  const expenseCategories = [
    "Housing",
    "Transportation",
    "Food",
    "Insurance",
    "Healthcare",
    "Debt",
    "Entertainment",
    "Shopping",
    "Travel",
    "Dining Out",
    "Other",
  ]

  return (
    <div className="container py-10">
      <div className="flex flex-col items-center space-y-4 text-center mb-10">
        <div className="inline-flex items-center justify-center p-2 bg-muted rounded-full">
          <CreditCard className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Budget Planner</h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Create a personalized budget based on your income and expenses
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Income</CardTitle>
              <CardDescription>Enter all sources of income</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {incomes.map((income) => (
                <div key={income.id} className="space-y-4 p-4 border rounded-lg relative">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Income Source</h3>
                    {incomes.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => removeIncome(income.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove income</span>
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`income-name-${income.id}`}>Description</Label>
                    <Input
                      id={`income-name-${income.id}`}
                      value={income.name}
                      onChange={(e) => updateIncome(income.id, "name", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`income-amount-${income.id}`}>Amount</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id={`income-amount-${income.id}`}
                          type="number"
                          className="pl-7"
                          value={income.amount}
                          onChange={(e) => updateIncome(income.id, "amount", Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`income-frequency-${income.id}`}>Frequency</Label>
                      <Select
                        value={income.frequency}
                        onValueChange={(value) =>
                          updateIncome(income.id, "frequency", value as "weekly" | "biweekly" | "monthly" | "annually")
                        }
                      >
                        <SelectTrigger id={`income-frequency-${income.id}`}>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="biweekly">Bi-weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="annually">Annually</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}

              <Button variant="outline" className="w-full" onClick={addIncome}>
                <Plus className="mr-2 h-4 w-4" />
                Add Another Income
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expenses</CardTitle>
              <CardDescription>Enter your regular expenses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {expenses.map((expense) => (
                <div key={expense.id} className="space-y-4 p-4 border rounded-lg relative">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Expense</h3>
                    <Button variant="ghost" size="icon" onClick={() => removeExpense(expense.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove expense</span>
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`expense-name-${expense.id}`}>Description</Label>
                    <Input
                      id={`expense-name-${expense.id}`}
                      value={expense.name}
                      onChange={(e) => updateExpense(expense.id, "name", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`expense-amount-${expense.id}`}>Amount</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id={`expense-amount-${expense.id}`}
                          type="number"
                          className="pl-7"
                          value={expense.amount}
                          onChange={(e) => updateExpense(expense.id, "amount", Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`expense-frequency-${expense.id}`}>Frequency</Label>
                      <Select
                        value={expense.frequency}
                        onValueChange={(value) =>
                          updateExpense(
                            expense.id,
                            "frequency",
                            value as "weekly" | "biweekly" | "monthly" | "annually",
                          )
                        }
                      >
                        <SelectTrigger id={`expense-frequency-${expense.id}`}>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="biweekly">Bi-weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="annually">Annually</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`expense-category-${expense.id}`}>Category</Label>
                    <Select
                      value={expense.category}
                      onValueChange={(value) => updateExpense(expense.id, "category", value)}
                    >
                      <SelectTrigger id={`expense-category-${expense.id}`}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {expenseCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}

              <Button variant="outline" className="w-full" onClick={addExpense}>
                <Plus className="mr-2 h-4 w-4" />
                Add Another Expense
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Savings Goal</CardTitle>
              <CardDescription>Set your monthly savings target</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="savingsGoal">Monthly Savings Goal</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">How much you want to save each month</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="savingsGoal"
                    type="number"
                    className="pl-7"
                    value={savingsGoal}
                    onChange={(e) => setSavingsGoal(Number(e.target.value))}
                  />
                </div>
              </div>

              <Button className="w-full mt-6" onClick={() => setCalculated(true)}>
                <Calculator className="mr-2 h-4 w-4" />
                Calculate Budget
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className={calculated ? "border-primary" : ""}>
          <CardHeader>
            <CardTitle>Budget Summary</CardTitle>
            <CardDescription>Based on your income and expenses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Monthly Income</div>
                <div className="text-2xl font-bold mt-1">{formatCurrency(results.totalMonthlyIncome)}</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Monthly Expenses</div>
                <div className="text-2xl font-bold mt-1">{formatCurrency(results.totalMonthlyExpenses)}</div>
              </div>
              <div
                className={`text-center p-4 rounded-lg ${
                  results.monthlySurplus >= 0 ? "bg-primary/20" : "bg-destructive/20"
                }`}
              >
                <div className="text-sm text-muted-foreground">Monthly Surplus</div>
                <div className="text-2xl font-bold mt-1">{formatCurrency(results.monthlySurplus)}</div>
              </div>
            </div>

            <Tabs defaultValue="breakdown">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="breakdown">Expense Breakdown</TabsTrigger>
                <TabsTrigger value="analysis">Budget Analysis</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>
              <TabsContent value="breakdown" className="space-y-4 pt-4">
                <div className="space-y-4">
                  {Object.keys(results.expensesByCategory).map((category) => (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>{category}</span>
                        <span className="font-medium">{formatCurrency(results.expensesByCategory[category])}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: `${results.expensePercentages[category]}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground text-right">
                        {formatPercent(results.expensePercentages[category])} of income
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="flex justify-between py-2">
                  <span className="font-bold">Total Expenses</span>
                  <span className="font-bold">{formatCurrency(results.totalMonthlyExpenses)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-bold">Percentage of Income</span>
                  <span className="font-bold">
                    {formatPercent((results.totalMonthlyExpenses / results.totalMonthlyIncome) * 100)}
                  </span>
                </div>
              </TabsContent>
              <TabsContent value="analysis" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <h3 className="font-medium">50/30/20 Budget Rule</h3>
                  <p className="text-sm text-muted-foreground">
                    The 50/30/20 rule suggests spending 50% of your income on needs, 30% on wants, and 20% on savings.
                    Here's how your budget compares:
                  </p>

                  <div className="space-y-3 mt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Needs (50%)</span>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(results.actualNeeds)}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatPercent((results.actualNeeds / results.totalMonthlyIncome) * 100)} vs{" "}
                            {formatPercent(50)} recommended
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5 flex">
                        <div
                          className="bg-primary h-2.5 rounded-l-full"
                          style={{ width: `${(results.actualNeeds / results.totalMonthlyIncome) * 100}%` }}
                        ></div>
                        <div
                          className="bg-primary/30 h-2.5 rounded-r-full"
                          style={{
                            width: `${Math.max(0, 50 - (results.actualNeeds / results.totalMonthlyIncome) * 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Wants (30%)</span>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(results.actualWants)}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatPercent((results.actualWants / results.totalMonthlyIncome) * 100)} vs{" "}
                            {formatPercent(30)} recommended
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5 flex">
                        <div
                          className="bg-primary h-2.5 rounded-l-full"
                          style={{ width: `${(results.actualWants / results.totalMonthlyIncome) * 100}%` }}
                        ></div>
                        <div
                          className="bg-primary/30 h-2.5 rounded-r-full"
                          style={{
                            width: `${Math.max(0, 30 - (results.actualWants / results.totalMonthlyIncome) * 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Savings (20%)</span>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(results.actualSavings)}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatPercent((results.actualSavings / results.totalMonthlyIncome) * 100)} vs{" "}
                            {formatPercent(20)} recommended
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5 flex">
                        <div
                          className={`${
                            results.actualSavings >= 0 ? "bg-primary" : "bg-destructive"
                          } h-2.5 rounded-l-full`}
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(0, (results.actualSavings / results.totalMonthlyIncome) * 100),
                            )}%`,
                          }}
                        ></div>
                        {results.actualSavings >= 0 && (
                          <div
                            className="bg-primary/30 h-2.5 rounded-r-full"
                            style={{
                              width: `${Math.max(0, 20 - (results.actualSavings / results.totalMonthlyIncome) * 100)}%`,
                            }}
                          ></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg border border-muted mt-4">
                  <h3 className="font-medium mb-2">Savings Goal Progress</h3>
                  <div className="flex justify-between items-center mb-2">
                    <span>Monthly Goal: {formatCurrency(savingsGoal)}</span>
                    <span
                      className={results.savingsGoalMet ? "text-primary font-medium" : "text-destructive font-medium"}
                    >
                      {results.savingsGoalMet ? "On Track" : "Not Met"}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                      className={`${results.savingsGoalMet ? "bg-primary" : "bg-destructive"} h-2.5 rounded-full`}
                      style={{
                        width: `${Math.min(100, Math.max(0, (results.monthlySurplus / savingsGoal) * 100))}%`,
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {results.savingsGoalMet
                      ? `You're saving ${formatCurrency(
                          results.monthlySurplus - savingsGoal,
                        )} more than your goal each month.`
                      : `You need to find an additional ${formatCurrency(
                          savingsGoal - results.monthlySurplus,
                        )} in your budget to meet your goal.`}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="recommendations" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <h3 className="font-medium">Budget Recommendations</h3>
                  <ul className="space-y-3">
                    {results.monthlySurplus < 0 && (
                      <li className="flex items-start p-3 bg-destructive/10 rounded-lg">
                        <DollarSign className="h-5 w-5 text-destructive mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-destructive">Reduce Expenses</span>
                          <p className="text-sm text-muted-foreground mt-1">
                            You're spending {formatCurrency(Math.abs(results.monthlySurplus))} more than you earn each
                            month. Look for ways to reduce expenses, especially in non-essential categories.
                          </p>
                        </div>
                      </li>
                    )}

                    {results.monthlySurplus >= 0 && results.monthlySurplus < savingsGoal && (
                      <li className="flex items-start p-3 bg-amber-500/10 rounded-lg">
                        <DollarSign className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-amber-500">Increase Savings</span>
                          <p className="text-sm text-muted-foreground mt-1">
                            You're saving {formatCurrency(results.monthlySurplus)} each month, but this is{" "}
                            {formatCurrency(savingsGoal - results.monthlySurplus)} short of your goal. Consider reducing
                            discretionary spending.
                          </p>
                        </div>
                      </li>
                    )}

                    {(results.actualNeeds / results.totalMonthlyIncome) * 100 > 60 && (
                      <li className="flex items-start p-3 bg-amber-500/10 rounded-lg">
                        <DollarSign className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-amber-500">High Essential Expenses</span>
                          <p className="text-sm text-muted-foreground mt-1">
                            Your essential expenses are{" "}
                            {formatPercent((results.actualNeeds / results.totalMonthlyIncome) * 100)} of your income,
                            which is higher than the recommended 50%. Consider finding more affordable housing or
                            transportation options.
                          </p>
                        </div>
                      </li>
                    )}

                    {(results.actualWants / results.totalMonthlyIncome) * 100 > 40 && (
                      <li className="flex items-start p-3 bg-amber-500/10 rounded-lg">
                        <DollarSign className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-amber-500">High Discretionary Spending</span>
                          <p className="text-sm text-muted-foreground mt-1">
                            You're spending {formatPercent((results.actualWants / results.totalMonthlyIncome) * 100)} of
                            your income on wants, which is higher than the recommended 30%. Look for ways to reduce
                            spending on entertainment, dining out, and other non-essentials.
                          </p>
                        </div>
                      </li>
                    )}

                    {results.monthlySurplus >= savingsGoal && (
                      <li className="flex items-start p-3 bg-primary/10 rounded-lg">
                        <DollarSign className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-primary">Savings Goal Met</span>
                          <p className="text-sm text-muted-foreground mt-1">
                            Great job! You're saving {formatCurrency(results.monthlySurplus)} each month, which exceeds
                            your goal of {formatCurrency(savingsGoal)}. Consider investing the extra{" "}
                            {formatCurrency(results.monthlySurplus - savingsGoal)} for long-term growth.
                          </p>
                        </div>
                      </li>
                    )}

                    {Object.keys(results.expensesByCategory).some(
                      (category) => results.expensePercentages[category] > 40,
                    ) && (
                      <li className="flex items-start p-3 bg-amber-500/10 rounded-lg">
                        <DollarSign className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-amber-500">Budget Imbalance</span>
                          <p className="text-sm text-muted-foreground mt-1">
                            One or more expense categories are taking up a large portion of your income. Consider
                            rebalancing your budget to ensure you're not overspending in any single area.
                          </p>
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 bg-muted rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">About Budgeting</h2>
        <p className="text-muted-foreground mb-4">
          A budget is a financial plan that helps you track your income, expenses, and savings. It's a powerful tool for
          achieving your financial goals, whether you're saving for a vacation, paying off debt, or building an
          emergency fund.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Budgeting Tips</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Track your spending for at least a month to understand your habits</li>
              <li>Prioritize paying off high-interest debt</li>
              <li>Build an emergency fund with 3-6 months of expenses</li>
              <li>Review and adjust your budget regularly</li>
              <li>Use the 50/30/20 rule as a starting point, but customize it to your needs</li>
              <li>Automate your savings to make it easier to stick to your budget</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Common Budgeting Methods</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>
                <strong>50/30/20 Budget:</strong> 50% needs, 30% wants, 20% savings
              </li>
              <li>
                <strong>Zero-Based Budget:</strong> Every dollar has a job, income minus expenses equals zero
              </li>
              <li>
                <strong>Envelope System:</strong> Cash in envelopes for different spending categories
              </li>
              <li>
                <strong>Pay Yourself First:</strong> Set aside savings before spending on anything else
              </li>
              <li>
                <strong>Values-Based Budget:</strong> Align spending with your personal values and priorities
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

