"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface PetActionsProps {
  onAction: (action: string, cost: number) => void
  money: number
}

const actions = [
  { id: "feed", label: "Feed", icon: "🍖", cost: 5, description: "Give your pet food" },
  { id: "play", label: "Play", icon: "🎾", cost: 3, description: "Play with your pet" },
  { id: "rest", label: "Rest", icon: "😴", cost: 0, description: "Let your pet sleep" },
  { id: "clean", label: "Clean", icon: "🫧", cost: 4, description: "Give your pet a bath" },
  { id: "vet", label: "Vet Visit", icon: "🏥", cost: 25, description: "Take to the vet" },
  { id: "toy", label: "Buy Toy", icon: "🧸", cost: 15, description: "Purchase a new toy" },
  { id: "treat", label: "Give Treat", icon: "🍪", cost: 8, description: "Special treat" },
]

export function PetActions({ onAction, money }: PetActionsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span>🎮</span>
            Pet Care Actions
          </CardTitle>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Your Money</div>
            <div className="text-2xl font-bold text-secondary">${money.toFixed(2)}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((action) => {
            const canAfford = money >= action.cost

            return (
              <Button
                key={action.id}
                onClick={() => onAction(action.id, action.cost)}
                disabled={!canAfford && action.cost > 0}
                variant={canAfford || action.cost === 0 ? "default" : "outline"}
                className="h-auto flex-col gap-2 p-4"
              >
                <span className="text-3xl">{action.icon}</span>
                <span className="font-semibold">{action.label}</span>
                <span className="text-xs opacity-80">{action.description}</span>
                {action.cost > 0 && (
                  <span className={`text-sm font-bold ${canAfford ? "text-primary-foreground" : "text-destructive"}`}>
                    ${action.cost}
                  </span>
                )}
                {action.cost === 0 && <span className="text-sm font-bold text-secondary">Free</span>}
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
