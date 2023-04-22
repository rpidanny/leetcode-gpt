import { BaseLanguageModel } from 'langchain/base_language';
import { LLMChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from 'langchain/prompts';

import { OpenAIChatModel } from './models';
import { HumanCommandPrompt, SystemMessagePrompt } from './prompts';

export class GPT {
  private readonly llmModel: BaseLanguageModel;
  private readonly codeSolverChain: LLMChain;

  constructor(apiKey: string, model?: string) {
    this.llmModel = new ChatOpenAI({
      temperature: 0,
      openAIApiKey: apiKey,
      modelName: model || OpenAIChatModel.GPT_3_5_TURBO,
    });

    this.codeSolverChain = this.createCodeSolverChain();
  }

  private createCodeSolverChain(): LLMChain {
    const chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(SystemMessagePrompt.V1),
      HumanMessagePromptTemplate.fromTemplate('{problem}'),
      HumanMessagePromptTemplate.fromTemplate(HumanCommandPrompt.V2),
    ]);
    return new LLMChain({
      prompt: chatPrompt,
      llm: this.llmModel,
    });
  }

  private parseOutput(text: string, language: string): string {
    try {
      const code = text.trim().split(`\`\`\`${language}`)[1].split('```')[0];
      if (code && code.length) return code.trim();
      return text;
    } catch (err) {
      return text;
    }
  }

  async solveLeetCodeProblem(
    problem: string,
    language: string,
    codeDefinition: string
  ): Promise<string> {
    console.log(`Solving ${language} question`);
    const resp = await this.codeSolverChain.call({
      problem,
      language,
      codeDefinition,
    });

    console.log(resp);
    return this.parseOutput(resp.text, language);
  }
}
