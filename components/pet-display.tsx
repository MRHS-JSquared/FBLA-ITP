import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Pet, PetState } from "@/lib/types"
import { getPetEmoji } from "@/lib/pet-logic"

interface PetDisplayProps {
  pet: Pet
  petState: PetState
}

export function PetDisplay({ pet, petState }: PetDisplayProps) {
  const petEmoji = getPetEmoji(pet.type, pet.stage)

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-3xl font-bold">{pet.name}</CardTitle>
            <div className="mt-2 flex gap-2">
              <Badge variant="secondary" className="text-sm">
                Level {pet.level}
              </Badge>
              <Badge variant="outline" className="text-sm capitalize">
                {pet.stage} {pet.type}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Experience</div>
            <div className="text-2xl font-bold">{pet.experience} XP</div>
            <div className="text-xs text-muted-foreground">{100 - (pet.experience % 100)} XP to next level</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className="text-9xl animate-bounce-slow">{petEmoji}</div>
            <div className="absolute -right-4 -top-4 text-6xl">{petState.emoji}</div>
          </div>

          <div className="text-center">
            <p className={`text-2xl font-bold ${petState.color}`}>{petState.message}</p>
            <p className="mt-2 text-sm text-muted-foreground capitalize">Mood: {petState.mood}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
