"use client"

import { useState, useEffect } from "react"
import { PetSetup } from "@/components/pet-setup"
import { PetDisplay } from "@/components/pet-display"
import { PetActions } from "@/components/pet-actions"
import { PetStats } from "@/components/pet-stats"
import { FinancialTracker } from "@/components/financial-tracker"
import { EarningsSystem } from "@/components/earnings-system"
import type { Pet, Transaction } from "@/lib/types"
import { calculatePetState, updatePetNeeds } from "@/lib/pet-logic"

export default function VirtualPetPage() {
  const [pet, setPet] = useState<Pet | null>(null)
  const [money, setMoney] = useState(100)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [lastUpdate, setLastUpdate] = useState(Date.now())

  // Load pet data from localStorage on mount
  useEffect(() => {
    const savedPet = localStorage.getItem("virtualPet")
    const savedMoney = localStorage.getItem("petMoney")
    const savedTransactions = localStorage.getItem("petTransactions")
    const savedLastUpdate = localStorage.getItem("lastUpdate")

    if (savedPet) {
      const parsedPet = JSON.parse(savedPet)
      const lastUpdateTime = savedLastUpdate ? Number.parseInt(savedLastUpdate) : Date.now()

      // Update pet needs based on time passed
      const updatedPet = updatePetNeeds(parsedPet, lastUpdateTime)
      setPet(updatedPet)
    }

    if (savedMoney) setMoney(Number.parseFloat(savedMoney))
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions))
    setLastUpdate(Date.now())
  }, [])

  // Save pet data to localStorage whenever it changes
  useEffect(() => {
    if (pet) {
      localStorage.setItem("virtualPet", JSON.stringify(pet))
      localStorage.setItem("petMoney", money.toString())
      localStorage.setItem("petTransactions", JSON.stringify(transactions))
      localStorage.setItem("lastUpdate", Date.now().toString())
    }
  }, [pet, money, transactions])

  // Auto-update pet needs every minute
  useEffect(() => {
    if (!pet) return

    const interval = setInterval(() => {
      setPet((prevPet) => {
        if (!prevPet) return null
        return updatePetNeeds(prevPet, lastUpdate)
      })
      setLastUpdate(Date.now())
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [pet, lastUpdate])

  const handlePetCreated = (newPet: Pet) => {
    setPet(newPet)
    setLastUpdate(Date.now())
  }

  const handleAction = (action: string, cost: number) => {
    if (cost > 0 && money < cost) {
      alert("Not enough money!")
      return
    }

    setPet((prevPet) => {
      if (!prevPet) return null

      const updatedPet = { ...prevPet }

      switch (action) {
        case "feed":
          updatedPet.hunger = Math.min(100, updatedPet.hunger + 30)
          updatedPet.health = Math.min(100, updatedPet.health + 5)
          break
        case "play":
          updatedPet.happiness = Math.min(100, updatedPet.happiness + 25)
          updatedPet.energy = Math.max(0, updatedPet.energy - 15)
          updatedPet.hunger = Math.max(0, updatedPet.hunger - 10)
          break
        case "rest":
          updatedPet.energy = Math.min(100, updatedPet.energy + 40)
          updatedPet.health = Math.min(100, updatedPet.health + 10)
          break
        case "clean":
          updatedPet.hygiene = Math.min(100, updatedPet.hygiene + 35)
          updatedPet.happiness = Math.min(100, updatedPet.happiness + 10)
          break
        case "vet":
          updatedPet.health = 100
          updatedPet.happiness = Math.max(0, updatedPet.happiness - 10)
          break
        case "toy":
          updatedPet.happiness = Math.min(100, updatedPet.happiness + 30)
          updatedPet.energy = Math.max(0, updatedPet.energy - 10)
          break
        case "treat":
          updatedPet.happiness = Math.min(100, updatedPet.happiness + 20)
          updatedPet.hunger = Math.min(100, updatedPet.hunger + 15)
          break
      }

      // Update experience and level
      updatedPet.experience += 10
      const newLevel = Math.floor(updatedPet.experience / 100) + 1
      if (newLevel > updatedPet.level) {
        updatedPet.level = newLevel
        updatedPet.stage = newLevel < 5 ? "baby" : newLevel < 10 ? "child" : "adult"
      }

      return updatedPet
    })

    if (cost > 0) {
      setMoney((prev) => prev - cost)
      addTransaction(action, -cost)
    }

    setLastUpdate(Date.now())
  }

  const handleEarnMoney = (amount: number, description: string) => {
    setMoney((prev) => prev + amount)
    addTransaction(description, amount)
  }

  const addTransaction = (description: string, amount: number) => {
    const transaction: Transaction = {
      id: Date.now().toString(),
      description,
      amount,
      timestamp: Date.now(),
    }
    setTransactions((prev) => [transaction, ...prev].slice(0, 50)) // Keep last 50 transactions
  }

  const handleReset = () => {
    if (confirm("Are you sure you want to reset your pet? This cannot be undone.")) {
      localStorage.removeItem("virtualPet")
      localStorage.removeItem("petMoney")
      localStorage.removeItem("petTransactions")
      localStorage.removeItem("lastUpdate")
      setPet(null)
      setMoney(100)
      setTransactions([])
      setLastUpdate(Date.now())
    }
  }

  if (!pet) {
    return <PetSetup onPetCreated={handlePetCreated} />
  }

  const petState = calculatePetState(pet)

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Virtual Pet Care</h1>
            <p className="text-muted-foreground">Take care of your pet and manage your budget!</p>
          </div>
          <button
            onClick={handleReset}
            className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
          >
            Reset Pet
          </button>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <PetDisplay pet={pet} petState={petState} />
            <PetActions onAction={handleAction} money={money} />
          </div>

          <div className="space-y-6">
            <PetStats pet={pet} petState={petState} />
            <EarningsSystem onEarnMoney={handleEarnMoney} />
            <FinancialTracker money={money} transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  )
}
