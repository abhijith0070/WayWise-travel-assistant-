"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, TestTube, CheckCircle, XCircle } from "lucide-react"

export default function TestOllamaPage() {
  const [prompt, setPrompt] = useState("Plan a 1 day trip to Delhi")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testOllama = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/plan-trip-ollama', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || 'Unknown error')
      }
    } catch (err) {
      setError('Network error: ' + (err instanceof Error ? err.message : 'Unknown'))
    } finally {
      setIsLoading(false)
    }
  }

  const testMainAPI = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/plan-trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || 'Unknown error')
      }
    } catch (err) {
      setError('Network error: ' + (err instanceof Error ? err.message : 'Unknown'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="w-5 h-5" />
              Ollama API Test Page
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Test Prompt:</label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter a travel request..."
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={testOllama}
                disabled={isLoading}
                variant="outline"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <TestTube className="w-4 h-4 mr-2" />
                )}
                Test Ollama Direct
              </Button>

              <Button
                onClick={testMainAPI}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <TestTube className="w-4 h-4 mr-2" />
                )}
                Test Main API (with fallbacks)
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Error:</strong> {error}
                </AlertDescription>
              </Alert>
            )}

            {result && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Success!</strong> API response received.
                  {result.source && (
                    <Badge variant="outline" className="ml-2">
                      Source: {result.source}
                    </Badge>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {result && (
              <Card className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-lg">API Response</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-white p-4 rounded overflow-auto max-h-96">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        <Alert>
          <AlertDescription>
            <strong>Setup Instructions:</strong>
            <br />
            1. Download and install Ollama from <a href="https://ollama.com/download" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ollama.com/download</a>
            <br />
            2. Open terminal and run: <code className="bg-gray-100 px-1 rounded">ollama run llama2</code>
            <br />
            3. Wait for model download to complete
            <br />
            4. Test the APIs above
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}