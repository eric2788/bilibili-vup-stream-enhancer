import type { AIResponse, Result } from "~types/cloudflare";
import { parseSSEResponses } from "~utils/binary";

const BASE_URL = "https://api.cloudflare.com/client/v4";

export const CLOUDFLARE_MODELS = [
  "@cf/qwen/qwen1.5-14b-chat-awq",
  "@cf/qwen/qwen1.5-7b-chat-awq",
  "@cf/qwen/qwen1.5-1.8b-chat",
  "@hf/google/gemma-7b-it",
  "@hf/nousresearch/hermes-2-pro-mistral-7b"
];

export async function runAI(
  data: any,
  { token, account, model }: { token: string; account: string; model: string }
): Promise<Result<AIResponse>> {
  const res = await fetch(`${BASE_URL}/accounts/${account}/ai/run/${model}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ ...data, stream: false })
  });
  const json = (await res.json()) as Result<AIResponse>;
  if (!res.ok) throw new Error(json.errors.join("\n"));
  return json;
}

export async function* runAIStream(
  data: any,
  { token, account, model }: { token: string; account: string; model: string }
): AsyncGenerator<string> {
  const res = await fetch(`${BASE_URL}/accounts/${account}/ai/run/${model}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ ...data, stream: true })
  });
  if (!res.ok) {
    const json = (await res.json()) as Result<AIResponse>;
    throw new Error(json.errors.join("\n"));
  }
  if (!res.body) throw new Error("Cloudflare AI response body is not readable");
  const reader = res.body.getReader();
  for await (const response of parseSSEResponses(reader, "[DONE]")) {
    yield response;
  }
}

export async function validateAIToken(
  accountId: string,
  token: string,
  model: string
): Promise<string | boolean> {
  const res = await fetch(
    `${BASE_URL}/accounts/${accountId}/ai/models/search?search=${model}&per_page=1`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  const data = (await res.json()) as Result<any>;
  if (!data.success) {
    return false;
  } else if (data.result.length === 0) {
    return "找不到指定 AI 模型";
  } else {
    return true;
  }
}
