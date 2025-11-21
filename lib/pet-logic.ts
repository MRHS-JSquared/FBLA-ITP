import type { Pet, PetState, PetMood } from "./types"

/**
 * Calculate the current state and mood of the pet based on its stats
 */
export function calculatePetState(pet: Pet): PetState {
  const { hunger, happiness, health, energy, hygiene } = pet

  // Determine mood based on stats
  let mood: PetMood = "happy"
  let emoji = "😊"
  let message = `${pet.name} is doing great!`
  let color = "text-secondary"

  // Priority: health issues first
  if (health < 30) {
    mood = "sick"
    emoji = "🤒"
    message = `${pet.name} is feeling sick and needs a vet visit!`
    color = "text-destructive"
  } else if (hunger < 20) {
    mood = "hungry"
    emoji = "😋"
    message = `${pet.name} is very hungry!`
    color = "text-accent"
  } else if (hygiene < 25) {
    mood = "dirty"
    emoji = "🫧"
    message = `${pet.name} needs a bath!`
    color = "text-muted-foreground"
  } else if (energy < 20) {
    mood = "tired"
    emoji = "😴"
    message = `${pet.name} is exhausted and needs rest.`
    color = "text-muted-foreground"
  } else if (happiness < 30) {
    mood = "sad"
    emoji = "😢"
    message = `${pet.name} is feeling sad. Play with them!`
    color = "text-primary"
  } else if (energy > 70 && happiness > 70) {
    mood = "energetic"
    emoji = "🤩"
    message = `${pet.name} is full of energy and joy!`
    color = "text-secondary"
  } else if (happiness > 60 && health > 60 && hunger > 50) {
    mood = "happy"
    emoji = "😊"
    message = `${pet.name} is happy and healthy!`
    color = "text-secondary"
  }

  return { mood, emoji, message, color }
}

/**
 * Update pet needs based on time passed since last update
 */
export function updatePetNeeds(pet: Pet, lastUpdateTime: number): Pet {
  const now = Date.now()
  const minutesPassed = Math.floor((now - lastUpdateTime) / 60000)

  if (minutesPassed === 0) return pet

  // Decay rates per minute
  const hungerDecay = 0.5
  const happinessDecay = 0.3
  const energyDecay = 0.2
  const hygieneDecay = 0.25
  const healthDecay = 0.1

  return {
    ...pet,
    hunger: Math.max(0, pet.hunger - hungerDecay * minutesPassed),
    happiness: Math.max(0, pet.happiness - happinessDecay * minutesPassed),
    energy: Math.max(0, pet.energy - energyDecay * minutesPassed),
    hygiene: Math.max(0, pet.hygiene - hygieneDecay * minutesPassed),
    health: Math.max(0, pet.health - healthDecay * minutesPassed),
  }
}

/**
 * Get pet emoji based on type and stage
 */
export function getPetEmoji(type: string, stage: string): string {
  const emojiMap: Record<string, Record<string, string>> = {
    dog: { baby: "🐕", child: "🐕", adult: "🐕" },
    cat: { baby: "🐱", child: "🐱", adult: "🐈" },
    rabbit: { baby: "🐰", child: "🐰", adult: "🐇" },
    hamster: { baby: "🐹", child: "🐹", adult: "🐹" },
  }

  return emojiMap[type]?.[stage] || "🐾"
}
