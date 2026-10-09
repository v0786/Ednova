interface ConverseRequest {
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export async function generateBedrockText({
  systemPrompt,
  userPrompt,
  maxTokens = 1024,
}: ConverseRequest): Promise<string> {
  const token = process.env.AWS_BEARER_TOKEN_BEDROCK;
  const region = process.env.AWS_REGION;
  const modelId = process.env.BEDROCK_MODEL_ID;

  const missingConfiguration = [
    !token && 'AWS_BEARER_TOKEN_BEDROCK',
    !region && 'AWS_REGION',
    !modelId && 'BEDROCK_MODEL_ID',
  ].filter((name): name is string => Boolean(name));

  if (!token || !region || !modelId) {
    throw new Error(`Amazon Bedrock is not configured. Set: ${missingConfiguration.join(', ')}.`);
  }

  const response = await fetch(
    `https://bedrock-runtime.${region}.amazonaws.com/model/${encodeURIComponent(modelId)}/converse`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system: [{ text: systemPrompt }],
        messages: [{ role: 'user', content: [{ text: userPrompt }] }],
        inferenceConfig: { maxTokens, temperature: 0.2 },
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(60_000),
    }
  );

  if (!response.ok) {
    throw new Error(`Amazon Bedrock Converse request failed (HTTP ${response.status}).`);
  }

  const body: unknown = await response.json();
  if (!isRecord(body) || !isRecord(body.output) || !isRecord(body.output.message)) {
    throw new Error('Amazon Bedrock returned an invalid Converse response.');
  }

  const content = body.output.message.content;
  if (!Array.isArray(content)) {
    throw new Error('Amazon Bedrock returned no generated content.');
  }

  const generatedText = content
    .filter((item): item is Record<string, unknown> => isRecord(item) && typeof item.text === 'string')
    .map((item) => (typeof item.text === 'string' ? item.text : ''))
    .join('\n')
    .trim();

  if (!generatedText) {
    throw new Error('Amazon Bedrock returned no generated text.');
  }

  return generatedText;
}
