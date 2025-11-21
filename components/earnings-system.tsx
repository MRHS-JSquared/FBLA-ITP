"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface EarningsSystemProps {
  onEarnMoney: (amount: number, description: string) => void
}

const chores = [
  { id: "dishes", label: "Wash Dishes", icon: "🍽️", reward: 10, time: 5 },
  { id: "vacuum", label: "Vacuum Room", icon: "🧹", reward: 15, time: 10 },
  { id: "laundry", label: "Do Laundry", icon: "👕", reward: 12, time: 8 },
  { id: "homework", label: "Complete Homework", icon: "📚", reward: 20, time: 15 },
  { id: "yard", label: "Yard Work", icon: "🌱", reward: 25, time: 20 },
  { id: "organize", label: "Organize Closet", icon: "🗄️", reward: 18, time: 12 },
]

export function EarningsSystem({ onEarnMoney }: EarningsSystemProps) {
  const [completedChores, setCompletedChores] = useState<Set<string>>(new Set())
  const [cooldowns, setCooldowns] = useState<Map<string, number>>(new Map())

  const handleChore = (chore: (typeof chores)[0]) => {
    const now = Date.now()
    const cooldownEnd = cooldowns.get(chore.id) || 0

    if (now < cooldownEnd) {
      const remainingSeconds = Math.ceil((cooldownEnd - now) / 1000)
      alert(`Please wait ${remainingSeconds} seconds before doing this chore again!`)
      return
    }

    onEarnMoney(chore.reward, chore.label)
    setCompletedChores((prev) => new Set(prev).add(chore.id))

    // Set cooldown (30 seconds for demo purposes)
    const newCooldowns = new Map(cooldowns)
    newCooldowns.set(chore.id, now + 30000)
    setCooldowns(newCooldowns)

    // Remove from completed after animation
    setTimeout(() => {
      setCompletedChores((prev) => {
        const next = new Set(prev)
        next.delete(chore.id)
        return next
      })
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>💰</span>
          Earn Money
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">Complete chores to earn money for pet care!</p>
        <div className="space-y-2">
          {chores.map((chore) => {
            const isCompleted = completedChores.has(chore.id)
            const cooldownEnd = cooldowns.get(chore.id) || 0
            const isOnCooldown = Date.now() < cooldownEnd

            return (
              <Button
                key={chore.id}
                onClick={() => handleChore(chore)}
                disabled={isOnCooldown}
                variant={isCompleted ? "secondary" : "outline"}
                className="w-full justify-between"
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl">{chore.icon}</span>
                  <span>{chore.label}</span>
                </span>
                <span className="font-bold text-secondary">+${chore.reward}</span>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
