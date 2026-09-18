import { AIProvider, AIProviderConfig, AIRequest, AIResponse, AITask } from '../../types';
import { LocalAIAdapter } from './LocalAIAdapter';

export class ProviderRegistry {
  private static providers: Map<string, AIProvider> = new Map();
  private static defaultProviderId = 'darkmatter-local-engine';

  static init() {
    const local = new LocalAIAdapter();
    this.registerProvider(local);
  }

  static registerProvider(provider: AIProvider) {
    this.providers.set(provider.id, provider);
  }

  static getProvider(id?: string): AIProvider {
    const targetId = id || this.defaultProviderId;
    const provider = this.providers.get(targetId);
    if (!provider) {
      // Fallback to local
      return this.providers.get('darkmatter-local-engine') || new LocalAIAdapter();
    }
    return provider;
  }

  static getActiveProvider(id?: string): AIProvider {
    return this.getProvider(id);
  }

  static listProviders(): AIProviderConfig[] {
    const registered = Array.from(this.providers.values()).map((p) => p.getConfig());

    // Include future provider specifications as explicitly unconfigured adapters
    const futureStubs: AIProviderConfig[] = [
      {
        id: 'ollama-local-daemon',
        name: 'Ollama Local Daemon (localhost:11434)',
        endpointType: 'Local Engine',
        status: 'NOT_CONFIGURED',
        latencyMs: 0,
        contextLimit: '128k tokens',
        quantization: 'GGUF Q4_K_M',
        description: 'Direct local LLM daemon running Llama 3, Mistral, or DeepSeek without cloud egress.',
        isLocalOnly: true,
        models: [
          {
            id: 'llama3:8b',
            name: 'Llama 3 8B Instruct',
            contextWindow: 8192,
            description: 'Fast local open-weights model for ideation and outline drafting.',
            recommendedFor: ['ideas', 'research'],
          },
          {
            id: 'mistral-nemo:12b',
            name: 'Mistral Nemo 12B',
            contextWindow: 128000,
            description: 'High-context open-weights model for long-form screenplay continuity.',
            recommendedFor: ['script', 'story'],
          },
        ],
      },
      {
        id: 'gemini-adapter',
        name: 'Gemini Cloud Gateway Adapter',
        endpointType: 'Third-Party Adapter',
        status: 'STANDBY',
        latencyMs: 380,
        contextLimit: '1M tokens',
        description: 'Future adapter for multimodal Google Gemini models. (Phase 2 Provider Module)',
        isLocalOnly: false,
        models: [
          {
            id: 'gemini-2.5-flash',
            name: 'Gemini 2.5 Flash',
            contextWindow: 1048576,
            description: 'Ultra-fast multimodal reasoning and broad context analysis.',
            recommendedFor: ['research', 'ideas', 'seo'],
          },
        ],
      },
      {
        id: 'anthropic-adapter',
        name: 'Anthropic Claude Gateway Adapter',
        endpointType: 'Third-Party Adapter',
        status: 'STANDBY',
        latencyMs: 450,
        contextLimit: '200k tokens',
        description: 'Future adapter for nuanced creative screenplays. (Phase 2 Provider Module)',
        isLocalOnly: false,
        models: [
          {
            id: 'claude-3-5-sonnet',
            name: 'Claude 3.5 Sonnet',
            contextWindow: 200000,
            description: 'Advanced literary voice, prose, and dialogue writing.',
            recommendedFor: ['script', 'story'],
          },
        ],
      },
      {
        id: 'openai-adapter',
        name: 'OpenAI GPT Gateway Adapter',
        endpointType: 'Third-Party Adapter',
        status: 'STANDBY',
        latencyMs: 410,
        contextLimit: '128k tokens',
        description: 'Future adapter for structured JSON generation and production breakdowns. (Phase 2)',
        isLocalOnly: false,
        models: [
          {
            id: 'gpt-4o',
            name: 'GPT-4o Omnimodel',
            contextWindow: 128000,
            description: 'High-speed structured extraction and production scheduling.',
            recommendedFor: ['production', 'seo'],
          },
        ],
      },
    ];

    return [...registered, ...futureStubs];
  }

  static async routeTask(request: AIRequest): Promise<AIResponse> {
    const provider = this.getProvider(request.modelId?.startsWith('dm-') ? 'darkmatter-local-engine' : undefined);
    return await provider.execute(request);
  }
}

// Auto-initialize registry
ProviderRegistry.init();
