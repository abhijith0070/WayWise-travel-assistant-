                                            "use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Download, Terminal, RefreshCw, ExternalLink, Zap, AlertTriangle } from "lucide-react"

interface HealthDiagnostics {
  service: {
    running: boolean
    url: string
    port: number
    version?: string
  }
  models: {
    available: any[]
    recommended: string[]
  }
  performance: {
    gpuAvailable?: boolean
    backend?: string
    testResponseTime?: string
    status?: string
    recommendations: string[]
  }
  errors: any[]
  recommendations: any[]
}

export function OllamaSetup() {
  const [isChecking, setIsChecking] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [isPreloading, setIsPreloading] = useState(false)
  const [diagnostics, setDiagnostics] = useState<HealthDiagnostics | null>(null)
  const [status, setStatus] = useState<'READY' | 'WARNING' | 'NOT_READY' | 'CHECKING'>('CHECKING')

  const checkOllamaHealth = async () => {
    setIsChecking(true)
    setStatus('CHECKING')
    
    try {
      const response = await fetch('/api/ollama-health', {
        method: 'GET',
      })

      if (response.ok) {
        const data = await response.json()
        setDiagnostics(data.diagnostics)
        setStatus(data.summary.status)
        console.log('🔍 Ollama diagnostics:', data)
      } else {
        setStatus('NOT_READY')
      }
    } catch (error) {
      console.error('Health check failed:', error)
      setStatus('NOT_READY')
    }
    
    setIsChecking(false)
  }

  const testModel = async () => {
    setIsTesting(true)
    try {
      const response = await fetch('/api/ollama-health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test' }),
      })

      const data = await response.json()
      if (data.success) {
        alert(`✅ Model test successful!\nResponse: ${data.response}`)
      } else {
        alert(`❌ Model test failed: ${data.message}`)
      }
    } catch (error) {
      alert('❌ Test failed - Ollama may not be running')
    }
    setIsTesting(false)
  }

  const preloadModel = async () => {
    setIsPreloading(true)
    try {
      const response = await fetch('/api/ollama-health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'preload' }),
      })

      const data = await response.json()
      if (data.success) {
        alert('✅ Model preloaded successfully! Future requests will be faster.')
        checkOllamaHealth() // Refresh status
      } else {
        alert(`❌ Preload failed: ${data.message}`)
      }
    } catch (error) {
      alert('❌ Preload failed - Ollama may not be running')
    }
    setIsPreloading(false)
  }

  useEffect(() => {
    checkOllamaHealth()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'READY':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'WARNING':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case 'NOT_READY':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'READY':
        return <Badge className="bg-green-100 text-green-800">Ready</Badge>
      case 'WARNING':
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
      case 'NOT_READY':
        return <Badge variant="destructive">Not Ready</Badge>
      default:
        return <Badge variant="secondary">Checking...</Badge>
    }
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            🦙 Ollama Local AI Diagnostics
            {getStatusIcon(status)}
          </span>
          <div className="flex gap-2">
            <Button
              onClick={checkOllamaHealth}
              disabled={isChecking}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            {getStatusBadge(status)}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Service Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              {diagnostics?.service.running ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span className="font-medium text-sm">Service</span>
            </div>
            <Badge variant={diagnostics?.service.running ? "default" : "destructive"} className="text-xs">
              {diagnostics?.service.running ? 'Running' : 'Stopped'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              {diagnostics && diagnostics.models.available.length > 0 ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span className="font-medium text-sm">Models</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {diagnostics?.models.available.length || 0} installed
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-sm">Performance</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {diagnostics?.performance.status || 'Unknown'}
            </Badge>
          </div>
        </div>

        {/* Performance Details */}
        {diagnostics?.performance.testResponseTime && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">⚡ Performance Metrics</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Response Time:</p>
                <p className="font-mono font-bold text-blue-900">{diagnostics.performance.testResponseTime}</p>
              </div>
              <div>
                <p className="text-gray-600">Backend:</p>
                <p className="font-mono font-bold text-blue-900">{diagnostics.performance.backend || 'CPU'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Errors & Warnings */}
        {diagnostics && diagnostics.errors.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-red-900">⚠️ Issues Found ({diagnostics.errors.length})</h4>
            {diagnostics.errors.map((error: any, index: number) => (
              <Alert key={index} variant={error.priority === 'HIGH' ? 'destructive' : 'default'} className="text-sm">
                <AlertDescription>
                  <strong>{error.type}:</strong> {error.message}
                  {error.solution && (
                    <div className="mt-2 p-2 bg-gray-900 text-green-400 rounded font-mono text-xs">
                      {error.solution}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {diagnostics?.service.running && (
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={testModel}
              disabled={isTesting}
              variant="outline"
              size="sm"
            >
              <Terminal className={`w-4 h-4 mr-2 ${isTesting ? 'animate-pulse' : ''}`} />
              {isTesting ? 'Testing...' : 'Test Model'}
            </Button>
            <Button
              onClick={preloadModel}
              disabled={isPreloading}
              variant="outline"
              size="sm"
            >
              <Zap className={`w-4 h-4 mr-2 ${isPreloading ? 'animate-pulse' : ''}`} />
              {isPreloading ? 'Preloading...' : 'Preload Model'}
            </Button>
          </div>
        )}

        {/* Setup Instructions */}
        {status === 'NOT_READY' && (
          <div className="space-y-4">
            <Alert>
              <Download className="h-4 w-4" />
              <AlertDescription>
                <strong>Free & Unlimited AI:</strong> Set up Ollama + Llama2 for completely free, offline AI that never hits quota limits!
              </AlertDescription>
            </Alert>

            {!diagnostics?.service.running && (
              <div className="border-l-4 border-blue-500 pl-4 space-y-3">
                <h4 className="font-semibold text-blue-900">Step 1: Install & Start Ollama</h4>
                <ol className="text-sm text-gray-700 space-y-2">
                  <li>1. Download from <a href="https://ollama.com/download" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">ollama.com/download <ExternalLink className="w-3 h-3" /></a></li>
                  <li>2. Install the application</li>
                  <li>3. Open terminal and run: <code className="bg-gray-900 text-green-400 px-2 py-1 rounded">ollama serve</code></li>
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

            {diagnostics?.service.running && diagnostics.models.available.length === 0 && (
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-orange-900 mb-2">Step 2: Install Llama2 Model</h4>
                <p className="text-sm text-gray-700 mb-3">
                  Open your terminal and run:
                </p>
                <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-3">
                  ollama pull llama2
                </div>
                <p className="text-xs text-gray-600">
                  Download size: ~3.8GB. First download may take a few minutes.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Success State */}
        {status === 'READY' && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>🎉 Ollama is fully operational!</strong> AI trip planning is running 100% free and offline.
            </AlertDescription>
          </Alert>
        )}

        {/* Recommendations */}
        {diagnostics && diagnostics.performance.recommendations.length > 0 && (
          <details className="border border-gray-200 rounded-lg p-4">
            <summary className="font-medium cursor-pointer text-sm">⚡ Performance Optimization Tips</summary>
            <div className="mt-3 space-y-2">
              {diagnostics.performance.recommendations.map((rec: string, index: number) => (
                <p key={index} className="text-sm text-gray-600">• {rec}</p>
              ))}
            </div>
          </details>
        )}

        {/* Benefits */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">🚀 Benefits of Ollama:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>100% Free:</strong> No API costs or usage limits</li>
            <li>• <strong>Complete Privacy:</strong> All data stays on your machine</li>
            <li>• <strong>Offline Capable:</strong> Works without internet connection</li>
            <li>• <strong>Unlimited Usage:</strong> Generate as many trip plans as you want</li>
            <li>• <strong>Fast Response:</strong> No network latency after initial load</li>
          </ul>
        </div>

        {/* Advanced Diagnostics */}
        {diagnostics && (
          <details className="border border-gray-200 rounded-lg p-4">
            <summary className="font-medium cursor-pointer text-sm">🔧 Advanced Diagnostics</summary>
            <div className="mt-3 space-y-3">
              <div className="bg-gray-50 p-3 rounded text-xs font-mono">
                <p><strong>Service URL:</strong> {diagnostics.service.url}</p>
                <p><strong>Port:</strong> {diagnostics.service.port}</p>
                <p><strong>Version:</strong> {diagnostics.service.version || 'Unknown'}</p>
                <p><strong>Models Installed:</strong> {diagnostics.models.available.map((m: any) => m.name).join(', ') || 'None'}</p>
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Troubleshooting:</strong></p>
                <p>• Port blocked: Make sure firewall allows port 11434</p>
                <p>• Service not starting: Restart computer after installation</p>
                <p>• Slow performance: Enable GPU acceleration (CUDA/Metal)</p>
                <p>• Check logs: Run <code className="bg-gray-100 px-1 rounded">ollama serve</code> in terminal</p>
              </div>
            </div>
          </details>
        )}
      </CardContent>
    </Card>
  )
}