export default {
  'meta.title': 'How a language model writes',
  'head.kicker': 'A hands-on introduction',
  'head.title': 'How a language model writes',
  'head.lead':
    'Try out prompting, roles, randomness and “thinking” on a small language model that runs entirely in your browser. Nothing you type leaves your computer.',
  'head.by': 'by Philipp Haslbauer',

  // 0 · start
  'start.h': 'Start the model',
  'start.p1':
    'A language model is a program that continues text. It has read an enormous amount of writing and learned which word is likely to come next. That is all it does, and it turns out to be enough to write, summarise and answer questions.',
  'start.p2':
    'The model on this page is tiny compared with ChatGPT or Claude, and it runs on your own laptop. Because it is small, it makes mistakes. That is useful here: you can see how it works.',
  'start.small': 'Small',
  'start.smallNote': 'Qwen3 0.6B · ≈ 0.5 GB · fast, runs on most laptops',
  'start.better': 'Better',
  'start.betterNote': 'Qwen3 1.7B · ≈ 1.2 GB · smarter, slower, needs a stronger laptop',
  'start.load': 'Load model',
  'start.switch': 'Switch model',
  'start.note': 'The first download takes a few minutes. After that the model is stored in your browser.',
  'gpu.checking': 'Checking your browser…',
  'gpu.ok': 'Your browser can run the model.',
  'gpu.none':
    'Your browser cannot run the model (WebGPU is missing). Please open this page in Chrome, Edge or Safari on a laptop. You can still read everything.',
  'load.loading': 'Loading…',
  'load.ready': 'Model ready: {name}. Click “Next” to try it.',
  'err.no-webgpu': 'This browser has no WebGPU. Please use Chrome, Edge or Safari.',
  'err.no-adapter': 'No usable graphics chip was found. Try Chrome, Edge or Safari, or another computer.',
  'err.memory': 'Not enough graphics memory. Close other tabs or choose the small model.',
  'err.download': 'Loading failed: {msg}. Check your internet connection and try again.',

  // shared box UI
  'box.run': 'Run',
  'box.stop': 'Stop',
  'box.think': 'Think first',
  'box.thinkHint': 'The model writes notes to itself before answering.',
  'box.prompt': 'Prompt',
  'box.output': 'Answer',
  'box.needModel': 'Load the model first (slide 0).',
  'box.busy': 'Wait until the current answer is finished.',
  'out.thinking': 'Thinking…',
  'out.thoughtFor': 'Thought for {s} s',
  'out.thoughts': 'Thoughts',
  'out.writing': 'Writing…',
  'out.tokens': '{n} tokens',
  'out.stats': '{n} tokens · {s} s',
  'out.capped': 'Stopped: the length limit was reached.',
  'out.cappedThinking': 'Stopped while still thinking. The limit was reached before an answer.',
  'out.stopped': 'Stopped.',
  'out.error': 'Something went wrong: {msg}',

  // 1 · prompt
  'prompt.h': 'The prompt',
  'prompt.p1':
    'What you write to the model is called a <em>prompt</em>. The model has no idea what you have in mind; it only has your words. A vague prompt gets a generic answer.',
  'prompt.p2':
    'Treat it like a brief for a colleague: who is it for, what tone, how long, what format?',
  'prompt.try': 'Run both and compare. Then change the specific one: another shop, another tone.',
  'prompt.vagueLabel': 'Vague',
  'prompt.specificLabel': 'Specific',
  'p.vague': 'Write a slogan.',
  'p.specific':
    'Write 3 slogans for a small bakery in Lucerne that sells sourdough bread. Tone: warm and a little funny. Max. 6 words each.',

  // 2 · role
  'role.h': 'Giving the model a role',
  'role.p1':
    'Besides the prompt you can give standing instructions: who the model should be and how it should write. This is called a <em>system prompt</em>. Apps like ChatGPT use one that you never see.',
  'role.try': 'Keep the task, switch the role, run again.',
  'role.roleLabel': 'Role (system prompt)',
  'role.taskLabel': 'Task (prompt)',
  'role.pick.none': 'No role',
  'role.none': '',
  'role.pick.copywriter': 'Advertising copywriter',
  'role.pick.kids': 'Children’s book author',
  'role.pick.critic': 'Grumpy art critic',
  'role.pick.own': 'Your own role…',
  'role.task': 'Describe a rainy Monday morning in 3 sentences.',
  'role.copywriter': 'You are an advertising copywriter. You write short, punchy and persuasive.',
  'role.kids': 'You are a children’s book author. You write for 5-year-olds: simple words, lots of sounds and colours.',
  'role.critic': 'You are a grumpy art critic. Nothing impresses you.',
  'role.own': 'You are …',

  // 3 · examples
  'fewshot.h': 'Show, don’t tell',
  'fewshot.p1':
    'Sometimes it is easier to show what you want than to describe it. Give the model two or three examples and it continues the pattern: length, rhythm, style. This is called <em>few-shot prompting</em>.',
  'fewshot.try': 'Rewrite the two examples in a completely different style and run again.',
  'fewshot.prompt':
    'Turn a product into a poetic tagline.\n\nProduct: umbrella\nTagline: A small roof that walks with you.\n\nProduct: pencil\nTagline: Thoughts, waiting in graphite.\n\nProduct: coffee cup\nTagline:',

  // 4 · randomness
  'rand.h': 'Randomness',
  'rand.p1':
    'The model does not have one fixed next word. It has a list of likely candidates and draws one, like a loaded die. The <em>temperature</em> sets how adventurous that draw is: low gives safe, repetitive text; high gives surprises, and sometimes nonsense.',
  'rand.try': 'Generate three continuations at a low temperature, then at a high one.',
  'rand.temp': 'Temperature',
  'rand.low': 'predictable',
  'rand.high': 'wild',
  'rand.run': 'Generate 3×',
  'rand.prompt': 'The new colour between blue and green is called "',

  // 5 · tokens
  'tokens.h': 'One word at a time',
  'tokens.p1':
    'Here you can look over the model’s shoulder. It only ever decides the next small piece of text, called a <em>token</em>: a word or part of a word. Below are its five favourite candidates and how likely it finds each one.',
  'tokens.try': 'Click a candidate to choose it, or let the model draw. You can also edit the text.',
  'tokens.show': 'Show next words',
  'tokens.auto': 'Let the model pick',
  'tokens.reset': 'Start over',
  'tokens.other': 'everything else',
  'tokens.legend': '␣ = starts with a space · ↵ = new line',
  'tokens.start': 'Once upon a time, in a small studio full of paper, an illustrator',

  // 6 · reasoning
  'reason.h': 'Thinking before answering',
  'reason.p1':
    'Newer models can “think” first. Before the answer they write notes to themselves: trying ideas, checking, correcting. These notes are ordinary text, produced the same way as everything else, one token at a time. The answer that follows can build on them.',
  'reason.p2':
    'Thinking takes longer and helps most with puzzles, numbers and planning. It helps much less with taste. Every box on this page has a “Think first” switch, so try it on the slogans too.',
  'reason.try': 'Ask the same question twice: once directly, once with thinking. We ask for a one-sentence answer, so without thinking the model has no room to work it out. Open the thoughts and read how it gets there.',
  'reason.run': 'Ask both',
  'reason.direct': 'Answer directly',
  'reason.think': 'Think first',
  'reason.q': 'A pencil and an eraser cost 1.10 francs together. The pencil costs 1.00 franc more than the eraser. How much does the eraser cost? Answer in one short sentence.',

  // 7 · failures
  'fail.h': 'Where it goes wrong',
  'fail.p1':
    'Language models sound confident even when they are wrong. They do not look anything up; they produce text that sounds likely. Try these, with and without thinking.',
  'fail.countH': 'Counting letters',
  'fail.countNote': 'The model does not see letters, only tokens. Counting characters is surprisingly hard for it.',
  'fail.count': 'How many times does the letter r appear in the word strawberry?',
  'fail.bioH': 'A person who does not exist',
  'fail.bioNote': 'We made Severin Quaderer up. Does the model admit it, or invent a life?',
  'fail.bio': 'Write a short biography of the Swiss illustrator Severin Quaderer (1921–1987).',
  'fail.sourcesH': 'Sources',
  'fail.sourcesNote': 'Invented sources with real-sounding authors are common. Never use a source from a model without checking it.',
  'fail.sources': 'Give me two scientific sources (authors, year, title) about how children perceive colour.',
  'fail.dateH': 'Today’s date',
  'fail.dateNote': 'The model has no clock and no internet. It only knows the text it was trained on.',
  'fail.date': 'What is today’s date?',

  // takeaways
  'end.h': 'To take with you',
  'end.1': 'A prompt is a brief. Say who it is for, the tone, the length and the format.',
  'end.2': 'Roles and examples steer style better than piling up adjectives.',
  'end.3': 'Randomness is useful: generate several versions and choose.',
  'end.4': 'Thinking helps with logic. It does not give the model taste.',
  'end.5': 'Check every fact, name and source.',
  'foot':
    'Runs with <a href="https://github.com/mlc-ai/web-llm">WebLLM</a> and <a href="https://huggingface.co/Qwen">Qwen3</a> (Apache 2.0). Made by <a href="https://philipphaslbauer.com">Philipp Haslbauer</a>.',
  'start.recommend': 'Tip: if your laptop is fairly new, try the better model. Its answers are noticeably better.',
  'cont.h': 'Type a few words',
  'cont.p1': 'At its core, a language model does one thing: it continues text. Type the beginning of a sentence and let it carry on.',
  'cont.p2': 'No question, no instruction. Just text that wants to be continued.',
  'cont.try': 'Try the opening of a recipe, a fairy tale or a letter.',
  'cont.start': 'The best thing about working with paper is',
  'cont.run': 'Continue',
  'ask.h': 'Ask a question',
  'ask.p1': 'Chat apps wrap your message in a hidden template, roughly “User: … Assistant: …”. The model then continues that text, in the role of the assistant. A chatbot is text continuation in costume.',
  'ask.try': 'Ask anything. Notice that it now answers instead of continuing your sentence.',
  'ask.prompt': 'What should I draw today?',
  'chat.h': 'Chatting',
  'chat.p1': 'In a chat you can refer back: “shorter”, “now in French”, “the second one”. Yet the model has no memory. Every time you send something, the whole conversation is sent again and the model reads all of it from the start.',
  'chat.try': 'Ask for ideas, then write “Make the second one funnier.” Then press “Forget everything” and write it again.',
  'chat.prompt': 'Give me 3 ideas for a poster about a summer festival.',
  'chat.send': 'Send',
  'chat.forget': 'Forget everything',
  'chat.reread': 'With your next message the model reads {n} earlier messages again.',
  'chat.you': 'You',
  'chat.model': 'Model',
  'reason.p3': 'Small models often think in English even when you write in German, and sometimes they then answer in English too.',
  'play.p2': 'This last box has every control from the previous slides. Pick a test or write your own.',
  'play.tests': 'Tests',
  'nav.back': 'Back',
  'nav.next': 'Next',
  'nav.slide': 'Slide {n}',
  'nav.keys': 'Tip: ← → keys switch slides.',
  'pill.none': 'No model loaded',
  'pill.loading': 'Loading model…',
  'pill.ready': '{name} ready',
  'box.noGpu': 'This browser cannot run the model. Please use Chrome, Edge or Safari.',
  'err.lost': 'The model stopped working, probably not enough graphics memory. Load it again on slide 0; the small model needs less.',
  'err.context': 'The conversation is too long for the model. Press “Forget everything” and start again.',
  'out.thoughtsUnfinished': 'Thoughts (unfinished)',
  'tokens.broken': 'Only part of a character (e.g. half an umlaut). It cannot be chosen on its own.',
  'gpu.limits': 'Your browser has WebGPU, but not enough of it for this model (Firefox, for example). Please open this page in Chrome, Edge or Safari. You can still read everything.',
  'err.limits': 'This browser’s WebGPU is too limited for the model. Please use Chrome, Edge or Safari.',
};
