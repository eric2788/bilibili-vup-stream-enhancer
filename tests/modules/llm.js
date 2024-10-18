import createLLMProvider from '~llms'


console.log('llm.js loaded!')
console.log(createLLMProvider)

window.llms = { createLLMProvider }