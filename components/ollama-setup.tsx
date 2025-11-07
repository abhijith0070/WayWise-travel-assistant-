                                            "use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Download, Terminal, RefreshCw, ExternalLink } from "lucide-react"

export function OllamaSetup() {
  const [isChecking, setIsChecking] = useState(false)
  const [ollamaStatus, setOllamaStatus] = useState<'checking' | 'installed' | 'not-installed' | 'model-missing'>('checking')
  const [llamaStatus, setLlamaStatus] = useState<'checking' | 'ready' | 'not-ready'>('checking')

  const checkOllamaStatus = async () => {
    setIsChecking(true)
    
    try {
      // Check if Ollama API is running
      const response = await fetch('/api/plan-trip-ollama', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'test' })
      })

      if (response.ok) {
        setOllamaStatus('installed')
        setLlamaStatus('ready')
      } else if (response.status === 503) {
        const error = await response.json()
        if (error.details?.includes('ollama run llama2')) {
          setOllamaStatus('installed')
          setLlamaStatus('not-ready')
        } else {
          setOllamaStatus('not-installed')
          setLlamaStatus('not-ready')
        }
      } else {
        setOllamaStatus('not-installed')
        setLlamaStatus('not-ready')
      }
    } catch (error) {
      setOllamaStatus('not-installed')
      setLlamaStatus('not-ready')
    }
    
    setIsChecking(false)
  }

  useEffect(() => {
    checkOllamaStatus()
  }, [])

  const getStatusIcon = (status: string) => {
    if (status === 'ready' || status === 'installed') {
      return <CheckCircle className="w-5 h-5 text-green-600" />
    }
    return <XCircle className="w-5 h-5 text-red-600" />
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
      case 'installed':
        return <Badge className="bg-green-100 text-green-800">Ready</Badge>
      case 'not-ready':
      case 'not-installed':
        return <Badge variant="destructive">Not Ready</Badge>
      default:
        return <Badge variant="secondary">Checking...</Badge>
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>🦙 Ollama Local AI Setup</span>
          <Button
            onClick={checkOllamaStatus}
            disabled={isChecking}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            Check Status
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              {getStatusIcon(ollamaStatus)}
              <span className="font-medium">Ollama Installation</span>
            </div>
            {getStatusBadge(ollamaStatus)}
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              {getStatusIcon(llamaStatus)}
              <span className="font-medium">Llama2 Model</span>
            </div>
            {getStatusBadge(llamaStatus)}
          </div>
        </div>

        {/* Setup Instructions */}
        {ollamaStatus !== 'installed' || llamaStatus !== 'ready' ? (
          <div className="space-y-4">
            <Alert>
              <Download className="h-4 w-4" />
              <AlertDescription>
                <strong>Free & Unlimited AI:</strong> Set up Ollama + Llama2 for completely free, offline AI that never hits quota limits!
              </AlertDescription>
            </Alert>

            {ollamaStatus !== 'installed' && (
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-blue-900 mb-2">Step 1: Install Ollama</h4>
                <ol className="text-sm text-gray-700 space-y-2 mb-3">
                  <li>1. Download Ollama from <a href="https://ollama.com/download" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">ollama.com/download <ExternalLink className="w-3 h-3" /></a></li>
                  <li>2. Install and run the application</li>
                  <li>3. Restart this page and check status again</li>
                </ol>
                <Button
                  onClick={() => window.open('https://ollama.com/download', '_blank')}
                  variant="outline"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Ollama
                </Button>
              </div>
            )}

            {ollamaStatus === 'installed' && llamaStatus !== 'ready' && (
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-orange-900 mb-2">Step 2: Install Llama2 Model</h4>
                <p className="text-sm text-gray-700 mb-3">
                  Open your terminal/command prompt and run:
                </p>
                <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-3">
                  ollama run llama2
                </div>
                <p className="text-xs text-gray-600">
                  This will download the Llama2 model (~3.8GB) and start it. The first download may take a few minutes.
                </p>
              </div>
            )}
          </div>
        ) : (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>🎉 Ollama is ready!</strong> Your travel assistant is now running 100% free and offline with unlimited usage.
            </AlertDescription>
          </Alert>
        )}

        {/* Benefits */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">🚀 Benefits of Ollama Setup:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>100% Free:</strong> No API costs or usage limits</li>
            <li>• <strong>Complete Privacy:</strong> All data stays on your machine</li>
            <li>• <strong>Offline Capable:</strong> Works without internet connection</li>
            <li>• <strong>Unlimited Usage:</strong> Generate as many trip plans as you want</li>
            <li>• <strong>Fast Response:</strong> No network latency, runs locally</li>
          </ul>
        </div>

        {/* Troubleshooting */}
        <details className="border border-gray-200 rounded-lg p-4">
          <summary className="font-medium cursor-pointer">🔧 Troubleshooting</summary>
          <div className="mt-3 space-y-2 text-sm text-gray-600">
            <p><strong>Ollama not starting:</strong> Make sure you have enough disk space (~4GB) and restart your computer after installation.</p>
            <p><strong>Model download fails:</strong> Check your internet connection and try running <code className="bg-gray-100 px-1 rounded">ollama run llama2</code> again.</p>
            <p><strong>Port conflicts:</strong> Ollama runs on port 11434. Make sure it's not blocked by firewall or used by another app.</p>
          </div>
        </details>
      </CardContent>
    </Card>
  )
}