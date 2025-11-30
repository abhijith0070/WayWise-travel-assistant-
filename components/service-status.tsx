"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, XCircle, Clock } from "lucide-react"

interface ServiceStatus {
  name: string
  status: 'operational' | 'degraded' | 'outage' | 'maintenance'
  description: string
  lastChecked?: Date
}

export function ServiceStatus() {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: "OpenAI GPT",
      status: 'operational',
      description: "Primary AI trip planning service"
    },
    {
      name: "Google Gemini",
      status: 'operational', 
      description: "Backup AI trip planning service"
    }
  ])

  const [isChecking, setIsChecking] = useState(false)

  const checkServiceHealth = async () => {
    setIsChecking(true)
    
    try {
      // Test OpenAI service
      const openaiTest = await fetch('/api/plan-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: 'Quick test - plan a 1 day trip to Delhi' 
        })
      })

      // Test Gemini service  
      const geminiTest = await fetch('/api/plan-trip-gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: 'Quick test - plan a 1 day trip to Mumbai' 
        })
      })

      setServices([
        {
          name: "OpenAI GPT",
          status: openaiTest.ok ? 'operational' : (openaiTest.status === 429 ? 'degraded' : 'outage'),
          description: "Primary AI trip planning service",
          lastChecked: new Date()
        },
        {
          name: "Google Gemini", 
          status: geminiTest.ok ? 'operational' : (geminiTest.status === 429 ? 'degraded' : 'outage'),
          description: "Backup AI trip planning service",
          lastChecked: new Date()
        }
      ])
    } catch (error) {
      console.error('Service health check failed:', error)
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkServiceHealth()
  }, [])

  const getStatusIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'degraded':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      case 'outage':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'maintenance':
        return <Clock className="w-4 h-4 text-blue-600" />
    }
  }

  const getStatusBadge = (status: ServiceStatus['status']) => {
    const variants = {
      operational: 'default',
      degraded: 'secondary', 
      outage: 'destructive',
      maintenance: 'outline'
    } as const

    const labels = {
      operational: 'Operational',
      degraded: 'Degraded',
      outage: 'Outage', 
      maintenance: 'Maintenance'
    }

    return (
      <Badge variant={variants[status]} className="text-xs">
        {labels[status]}
      </Badge>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <span>Service Status</span>
          {isChecking && <Clock className="w-4 h-4 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {services.map((service, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(service.status)}
              <div>
                <p className="font-medium text-sm">{service.name}</p>
                <p className="text-xs text-gray-600">{service.description}</p>
              </div>
            </div>
            {getStatusBadge(service.status)}
          </div>
        ))}
        
        {services.some(s => s.lastChecked) && (
          <p className="text-xs text-gray-500 text-center pt-2">
            Last checked: {services[0]?.lastChecked?.toLocaleTimeString()}
          </p>
        )}
      </CardContent>
    </Card>
  )
}