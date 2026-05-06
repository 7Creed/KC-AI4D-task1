require('dotenv').config();

async function callLLM(prompt) {
  const BASE_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
  //   https://openrouter.ai/api/v1/chat/completions
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.MODEL_NAME;

  //   console.log(apiKey);

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is missing in .env');
  }

  if (!model) {
    throw new Error('MODEL_NAME is missing in .env');
  }

  const response = await fetch(BASE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// module.exports = { callLLM };

async function main() {
  //   const prompt = 'What is the capital of France?';
  const prompt = process.argv.slice(2).join(' ');

  if (!prompt) {
    console.log('Usage: node main.js "Your prompt here"');
    process.exit(1);
  }
  try {
    const response = await callLLM(prompt);
    console.log('LLM Response:', response);
  } catch (error) {
    console.error('Error calling LLM:', error);
  }
}

main();
