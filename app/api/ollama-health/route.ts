import { NextRequest, NextResponse } from 'next/server';

/**
 * Ollama Health Check & Diagnostics Endpoint
 * Checks Ollama service status, available models, and system capabilities
 */
export async function GET(request: NextRequest) {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    service: {
      running: false,
      url: 'http://localhost:11434',
      port: 11434,
    },
    models: {
      available: [],
      recommended: ['llama3', 'llama2', 'mistral', 'phi3'],
    },
    performance: {
      gpuAvailable: false,
      backend: 'CPU',
      recommendations: [],
    },
    errors: [],
  };

  try {
    // 1. Check if Ollama service is running
    console.log('🔍 Checking Ollama service at localhost:11434...');
    
    const serviceCheck = await fetch('http://localhost:11434/api/version', {
      method: 'GET',
      signal: AbortSignal.timeout(5000), // 5 second timeout
    }).catch((err) => {
      diagnostics.errors.push({
        type: 'CONNECTION_FAILED',
        message: 'Cannot connect to Ollama service',
        details: err.message,
        solution: 'Start Ollama: ollama serve',
      });
      return null;
    });

    if (serviceCheck && serviceCheck.ok) {
      const version = await serviceCheck.json();
      diagnostics.service.running = true;
      diagnostics.service.version = version.version || 'unknown';
      console.log('✅ Ollama service is running:', version);
    } else {
      diagnostics.service.running = false;
      diagnostics.errors.push({
        type: 'SERVICE_NOT_RUNNING',
        message: 'Ollama service is not responding',
        solution: 'Run: ollama serve (in a separate terminal)',
      });
    }

    // 2. Check available models
    if (diagnostics.service.running) {
      console.log('🔍 Checking available models...');
      
      const modelsCheck = await fetch('http://localhost:11434/api/tags', {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      }).catch((err) => {
        diagnostics.errors.push({
          type: 'MODELS_CHECK_FAILED',
          message: 'Cannot retrieve model list',
          details: err.message,
        });
        return null;
      });

      if (modelsCheck && modelsCheck.ok) {
        const modelsData = await modelsCheck.json();
        diagnostics.models.available = modelsData.models || [];
        console.log('📦 Available models:', diagnostics.models.available.length);

        // Check for recommended models
        const installedModels = diagnostics.models.available.map((m: any) => m.name.split(':')[0]);
        const missingModels = diagnostics.models.recommended.filter(
          (m: string) => !installedModels.includes(m)
        );

        if (missingModels.length > 0) {
          diagnostics.errors.push({
            type: 'MODELS_MISSING',
            message: `Recommended models not installed: ${missingModels.join(', ')}`,
            solution: `Install with: ollama pull llama3`,
          });
        }

        // Check if llama2 specifically is available (used by the app)
        const hasLlama2 = installedModels.includes('llama2');
        if (!hasLlama2) {
          diagnostics.errors.push({
            type: 'LLAMA2_MISSING',
            message: 'Llama2 model is required but not installed',
            solution: 'Run: ollama pull llama2',
            priority: 'HIGH',
          });
        }
      }
    }

    // 3. Performance diagnostics
    console.log('🔍 Checking performance capabilities...');
    
    // Check for GPU availability (approximate - actual check requires system info)
    diagnostics.performance.recommendations.push(
      'For better performance, ensure GPU acceleration is enabled'
    );
    diagnostics.performance.recommendations.push(
      'Preload models with: ollama run llama2 (then exit with /bye)'
    );
    
    // Check if model is loaded (attempt a quick test)
    if (diagnostics.service.running && diagnostics.models.available.length > 0) {
      console.log('🔍 Testing model response time...');
      
      const testStart = Date.now();
      const testPrompt = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama2',
          prompt: 'Say "OK"',
          stream: false,
          options: {
            num_predict: 2, // Minimal tokens
          },
        }),
        signal: AbortSignal.timeout(10000), // 10 second timeout
      }).catch((err) => {
        diagnostics.errors.push({
          type: 'MODEL_TEST_FAILED',
          message: 'Model test failed',
          details: err.message,
        });
        return null;
      });

      const testEnd = Date.now();
      const responseTime = testEnd - testStart;

      if (testPrompt && testPrompt.ok) {
        diagnostics.performance.testResponseTime = `${responseTime}ms`;
        diagnostics.performance.status = responseTime < 5000 ? 'GOOD' : 'SLOW';
        
        if (responseTime > 5000) {
          diagnostics.performance.recommendations.push(
            'Response time is slow. Consider using a lighter model like phi3'
          );
          diagnostics.performance.recommendations.push(
            'Enable GPU acceleration if available (CUDA/Metal)'
          );
        }

        console.log(`✅ Model test completed in ${responseTime}ms`);
      } else {
        diagnostics.errors.push({
          type: 'MODEL_NOT_RESPONDING',
          message: 'Llama2 model exists but is not responding',
          solution: 'Restart Ollama service or pull model again',
        });
      }
    }

    // 4. System recommendations
    diagnostics.recommendations = [
      {
        priority: 'HIGH',
        action: 'Ensure Ollama service is running',
        command: 'ollama serve',
        description: 'Start the Ollama background service',
      },
      {
        priority: 'HIGH',
        action: 'Install Llama2 model',
        command: 'ollama pull llama2',
        description: 'Download the Llama2 model (required by the app)',
      },
      {
        priority: 'MEDIUM',
        action: 'Preload model into memory',
        command: 'ollama run llama2',
        description: 'Reduces cold start latency (type /bye to exit)',
      },
      {
        priority: 'MEDIUM',
        action: 'Consider lighter models for faster responses',
        command: 'ollama pull phi3',
        description: 'Phi3 is faster and uses less memory',
      },
      {
        priority: 'LOW',
        action: 'Enable GPU acceleration',
        command: 'Check CUDA/Metal setup',
        description: 'Significantly improves performance',
      },
    ];

    // Return diagnostics
    return NextResponse.json({
      success: diagnostics.service.running && diagnostics.models.available.length > 0,
      diagnostics,
      summary: {
        serviceRunning: diagnostics.service.running,
        modelsInstalled: diagnostics.models.available.length,
        errorsFound: diagnostics.errors.length,
        status: diagnostics.service.running 
          ? (diagnostics.errors.some((e: any) => e.priority === 'HIGH') ? 'WARNING' : 'READY')
          : 'NOT_READY',
      },
    });

  } catch (error: any) {
    console.error('❌ Ollama health check failed:', error);
    
    return NextResponse.json({
      success: false,
      diagnostics,
      error: {
        message: 'Health check failed',
        details: error.message,
      },
    });
  }
}

/**
 * POST endpoint to restart/reinitialize Ollama model
 */
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action === 'preload') {
      // Attempt to preload the model
      console.log('🔄 Preloading Llama2 model...');
      
      const preloadResponse = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama2',
          prompt: 'Initialize',
          stream: false,
          options: {
            num_predict: 1,
          },
        }),
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });

      if (preloadResponse.ok) {
        return NextResponse.json({
          success: true,
          message: 'Model preloaded successfully',
          action: 'preload',
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'Failed to preload model',
          details: await preloadResponse.text(),
        }, { status: 500 });
      }
    }

    if (action === 'test') {
      // Quick test of the model
      console.log('🧪 Testing Ollama model...');
      
      const testResponse = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama2',
          prompt: 'Say "Ollama is working"',
          stream: false,
          options: {
            temperature: 0.7,
            num_predict: 10,
          },
        }),
        signal: AbortSignal.timeout(15000),
      });

      if (testResponse.ok) {
        const result = await testResponse.json();
        return NextResponse.json({
          success: true,
          message: 'Model test successful',
          response: result.response,
          action: 'test',
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'Model test failed',
          details: await testResponse.text(),
        }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid action',
      validActions: ['preload', 'test'],
    }, { status: 400 });

  } catch (error: any) {
    console.error('❌ Ollama action failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
