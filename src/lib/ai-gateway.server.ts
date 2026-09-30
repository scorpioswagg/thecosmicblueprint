import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

/**
 * Prefer a direct GEMINI_API_KEY (Google OpenAI-compatible endpoint) so report
 * generation does not depend on Lovable AI gateway credits. Fall back to
 * LOVABLE_API_KEY when Gemini is not configured.
 */
export function createLovableAiGatewayProvider(apiKey: string) {
  return createOpenAICompatible({
    name: "lovable-ai-gateway",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: { "Lovable-API-Key": apiKey },
  });
}

export function createGeminiProvider(apiKey: string) {
  return createOpenAICompatible({
    name: "google-gemini",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    apiKey,
  });
}

export type WritingModelResolution = {
  model: ReturnType<ReturnType<typeof createLovableAiGatewayProvider>>;
  source: "gemini" | "lovable";
  /** Key used for any secondary QA calls that still expect an API key string. */
  apiKey: string;
};

/**
 * Resolves the writing model for report generation.
 * Order: GEMINI_API_KEY → LOVABLE_API_KEY.
 */
export function resolveWritingModel(): WritingModelResolution {
  const gemini = process.env.GEMINI_API_KEY?.trim();
  if (gemini) {
    const provider = createGeminiProvider(gemini);
    return {
      model: provider("gemini-2.0-flash") as WritingModelResolution["model"],
      source: "gemini",
      apiKey: gemini,
    };
  }

  const lovable = process.env.LOVABLE_API_KEY?.trim();
  if (!lovable) {
    throw new Error(
      "Missing GEMINI_API_KEY and LOVABLE_API_KEY. Set GEMINI_API_KEY for direct Google routing, or LOVABLE_API_KEY for the Lovable AI gateway.",
    );
  }
  const provider = createLovableAiGatewayProvider(lovable);
  return {
    model: provider("google/gemini-3-flash-preview") as WritingModelResolution["model"],
    source: "lovable",
    apiKey: lovable,
  };
}
