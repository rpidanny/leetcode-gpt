import { GPT } from './modules/gpt';
import { LeetCodeDOM } from './modules/leetcode-dom';

const leetcode = new LeetCodeDOM();

function init() {
  leetcode.injectScript(chrome.runtime.getURL('monaco.bundle.js'), 'body');

  leetcode.createSolveButton(solveQuestion);
}

async function solveQuestion() {
  const openAiApiKey = await leetcode.getOpenAiApiKey();
  const openAiModel = await leetcode.getOpenAiModel();

  const gpt = new GPT(openAiApiKey, openAiModel);

  const question = leetcode.getQuestion();
  const language = leetcode.getLanguage();
  const codeDefinition = leetcode.getCode();

  console.log(question);
  console.log(codeDefinition);

  await leetcode.runAsyncJob(async () => {
    const resp = await gpt.solveLeetCodeProblem(
      question,
      language,
      codeDefinition
    );

    await leetcode.updateCode(resp);
  });

  // await leetcode.runAsyncJob(async () => {
  //   await new Promise((resolve) => {
  //     setTimeout(resolve, 20000);
  //   });
  // });
}

init();
