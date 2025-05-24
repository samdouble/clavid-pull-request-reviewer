import core from '@actions/core';
import github from '@actions/github';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: core.getInput('anthropic_api_key') || process.env['ANTHROPIC_API_KEY'],
});

try {
  const additionalInstructions = core.getInput('additional_instructions');
  console.log(`Additional instructions: ${additionalInstructions}`);

  const message = await client.messages.create({
    max_tokens: 1024,
    messages: [{ role: 'user', content: additionalInstructions }],
    model: 'claude-3-7-sonnet-latest',
  });
  console.log(message.content);

  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
