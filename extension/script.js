import {
  FilesetResolver,
  LlmInference,
} from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai/genai_bundle.mjs';

async function main() {
  const genai = await FilesetResolver.forGenAiTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai@latest/wasm'
  );
  const llmInference = await LlmInference.createFromOptions(genai, {
    baseOptions: {
      modelAssetPath: '/assets/gemma-2b-it-gpu-int4.bin',
    },
    maxTokens: 1000,
    topK: 40,
    temperature: 0.8,
    randomSeed: 101,
  });

  console.log(llmInference);
  console.time('LLM');

  const inputPrompt =
    'Compose an email to remind Brett of lunch plans at noon on Saturday.';
  const response = await llmInference.generateResponse(inputPrompt);

  console.log(response);
  console.timeEnd('LLM');
}

main();
