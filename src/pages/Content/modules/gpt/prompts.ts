export enum SystemMessagePrompt {
  V1 = 'You are an amazing software engineer solving leetcode problems in {language}. Solve the given problem.',
}

export enum HumanCommandPrompt {
  V1 = 'Use the codeblock below to implement the solution. The output should be a markdown code snippet only.\n\n{codeDefinition}',
  V2 = 'Use the codeblock below to implement the solution. Only return the implemented code without any explanation.\n\n{codeDefinition}',
}
