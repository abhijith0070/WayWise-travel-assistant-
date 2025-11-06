"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, HelpCircle, Clock, Zap, Shield } from "lucide-react"

const faqs = [
  {
    id: 1,
    question: "Why am I seeing 'API quota exceeded' error?",
    answer: "Our AI services have usage limits to manage costs and ensure fair access for all users. When these limits are reached, you'll need to wait a few minutes before trying again.",
    icon: <Clock className="w-4 h-4 text-blue-600" />
  },
  {
    id: 2,
    question: "How long do I need to wait?",
    answer: "Usually just 1-5 minutes! Our quotas reset frequently. You can also try using simpler trip requests which use fewer AI resources.",
    icon: <Zap className="w-4 h-4 text-green-600" />
  },
  {
    id: 3,
    question: "Are there alternatives when this happens?",
    answer: "Yes! We have multiple AI services (OpenAI and Google Gemini) that automatically serve as backups for each other. If one is at capacity, the other usually works.",
    icon: <Shield className="w-4 h-4 text-purple-600" />
  },
  {
    id: 4,
    question: "How can I avoid hitting limits?",
    answer: "Be specific in your requests, avoid generating multiple trips rapidly, and try during off-peak hours. More focused requests also tend to get better results!",
    icon: <HelpCircle className="w-4 h-4 text-orange-600" />
  }
]

export function ApiQuotaFAQ() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          Frequently Asked Questions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {faqs.map((faq) => (
          <Collapsible
            key={faq.id}
            open={openItems.includes(faq.id)}
            onOpenChange={() => toggleItem(faq.id)}
          >
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3 text-left">
                  {faq.icon}
                  <span className="font-medium text-gray-900">{faq.question}</span>
                </div>
                {openItems.includes(faq.id) ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-10 pb-3 text-sm text-gray-600">
                {faq.answer}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>💡 Pro Tip:</strong> If you continue experiencing issues, try refreshing the page or starting a new trip planning session. Our system automatically distributes load across multiple AI providers for the best experience.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}