import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Pet, PetState } from "@/lib/types"

interface PetStatsProps {
  pet: Pet
  petState: PetState
}

const stats = [
  { key: "hunger", label: "Hunger", icon: "🍖", color: "bg-accent" },
  { key: "happiness", label: "Happiness", icon: "😊", color: "bg-secondary" },
  { key: "health", label: "Health", icon: "❤️", color: "bg-destructive" },
  { key: "energy", label: "Energy", icon: "⚡", color: "bg-primary" },
  { key: "hygiene", label: "Hygiene", icon: "🫧", color: "bg-chart-5" },
]

export function PetStats({ pet }: PetStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>📊</span>
          Pet Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.map(({ key, label, icon }) => {
          const value = pet[key as keyof Pet] as number
          const isLow = value < 30
          const isMedium = value >= 30 && value < 60

          return (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <span>{icon}</span>
                  {label}
                </span>
                <span
                  className={`text-sm font-bold ${isLow ? "text-destructive" : isMedium ? "text-accent" : "text-secondary"}`}
                >
                  {Math.round(value)}%
                </span>
              </div>
              <Progress
                value={value}
                className="h-2"
                indicatorClassName={isLow ? "bg-destructive" : isMedium ? "bg-accent" : "bg-secondary"}
              />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
