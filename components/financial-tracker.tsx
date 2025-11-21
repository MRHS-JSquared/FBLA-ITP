import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Transaction } from "@/lib/types"

interface FinancialTrackerProps {
  money: number
  transactions: Transaction[]
}

export function FinancialTracker({ money, transactions }: FinancialTrackerProps) {
  const totalSpent = transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const totalEarned = transactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>💵</span>
          Financial Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted p-4">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Balance</div>
            <div className="text-lg font-bold text-secondary">${money.toFixed(2)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Earned</div>
            <div className="text-lg font-bold text-secondary">+${totalEarned.toFixed(2)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Spent</div>
            <div className="text-lg font-bold text-destructive">-${totalSpent.toFixed(2)}</div>
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold">Recent Transactions</h3>
          <ScrollArea className="h-[200px] rounded-lg border">
            <div className="space-y-1 p-2">
              {transactions.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No transactions yet</p>
              ) : (
                transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between rounded-md bg-card p-2 text-sm"
                  >
                    <span className="text-muted-foreground">{transaction.description}</span>
                    <span className={`font-bold ${transaction.amount > 0 ? "text-secondary" : "text-destructive"}`}>
                      {transaction.amount > 0 ? "+" : ""}${transaction.amount.toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}
