"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Database, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export function DatabaseSetup() {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const setupDatabase = async () => {
    setIsLoading(true)
    setStatus("idle")

    try {
      const response = await fetch("/api/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage("Database setup completed! Refresh the page to see listings.")
      } else {
        setStatus("error")
        setMessage(data.message || "Setup failed")
      }
    } catch (error) {
      setStatus("error")
      setMessage("Network error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Database className="h-8 w-8 text-primary" />
        </div>
        <CardTitle>Database Setup Required</CardTitle>
        <CardDescription>Initialize your StayFinder database with sample data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === "success" && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {status === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <Button onClick={setupDatabase} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Setting up database...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Setup Database
            </>
          )}
        </Button>

        <div className="text-sm text-muted-foreground space-y-1">
          <p>This will create:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Database tables (users, listings, bookings, reviews)</li>
            <li>Sample users and property listings</li>
            <li>Sample reviews and data</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
