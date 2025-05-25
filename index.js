import axios from 'axios';
import core from '@actions/core';
import github from '@actions/github';
import Anthropic from '@anthropic-ai/sdk';

const anthropicApiKey = core.getInput('anthropic_api_key') || process.env['ANTHROPIC_API_KEY'];
if (!anthropicApiKey) {
  core.setFailed('Anthropic API key must be set, through the anthropic_api_key input or ANTHROPIC_API_KEY environment variable');
}
const githubToken = core.getInput('github_token') || process.env['GITHUB_TOKEN'];
if (!githubToken) {
  core.setFailed('GitHub token must be set, through the github_token input or GITHUB_TOKEN environment variable');
}

const client = new Anthropic({
  apiKey: anthropicApiKey,
});

try {
  const additionalInstructions = core.getInput('additional_instructions');

  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);

  const instance = axios.create({
    baseURL: 'https://api.github.com',
    timeout: 1000,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${githubToken}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  const res = await instance.get(payload.pull_request._links.commits.href)
    .then(response => console.log(response))
    .catch(error => console.log(error))
    .finally(() => console.log('finally'));
  console.log("Commits: ", res.data);

  // const message = await client.messages.create({
  //   max_tokens: 1024,
  //   messages: [{ role: 'user', content: additionalInstructions }],
  //   model: 'claude-3-7-sonnet-latest',
  // });
  // console.log(message.content);

  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
} catch (error) {
  core.setFailed(error.message);
}
