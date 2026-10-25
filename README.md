<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![License][license-shield]][license-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h3 align="center">Vigie</h3>

  <p align="center">
    <em>Vigie</em> (French for "lookout") warns you before your prompt reaches an AI assistant.
    <br />
    A local, private pre-check that flags prompts likely to break an AI provider's usage policy.
    <br />
    <br />
    <a href="https://github.com/Giovidoh/vigie/issues/new?labels=bug">Report Bug</a>
    &middot;
    <a href="https://github.com/Giovidoh/vigie/issues/new?labels=enhancement">Request Feature</a>
  </p>
</div>

> [!WARNING]
> **Early development.** The first version works with Claude Code and uses local keyword rules only. See the [roadmap](#roadmap).



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#how-it-works">How It Works</a></li>
        <li><a href="#limitations">Limitations</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

AI providers enforce usage policies, and accounts can be suspended when content is flagged, sometimes after a simple misunderstanding. Once a prompt is sent, it is too late: the content has already reached the provider.

Vigie runs **on your machine, before the prompt is sent**. If the prompt looks risky, it stops it and tells you which policy category is at stake. You stay in control: for most categories, you can resend the prompt knowingly.

Principles:
* **Local and private.** Nothing leaves your machine for analysis. Vigie never sends your prompt to the provider or to any third party to check it.
* **It warns, it does not disguise.** Vigie explains why a prompt is risky. It never suggests ways to rephrase a request so that it slips past moderation.
* **Fast.** The check must not slow down everyday work.
* **Tool-agnostic.** Vigie starts with [Claude Code](https://docs.claude.com/en/docs/claude-code/overview), but its core is independent of any one assistant.

Vigie is an independent project. It is **not affiliated with or endorsed by Anthropic** or any other AI provider.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### How It Works

A tool-agnostic **core** analyzes the content. Thin **adapters** plug it into each assistant. The first adapter is a Claude Code plugin that uses Claude Code hooks.

The analysis is a cascade that stops as soon as it has an answer:

1. **Local rules.** Instant pattern matching, organized by policy category.
2. **Small local model** *(planned)*. A lightweight classifier that runs in-process and is called only on doubtful prompts.

Each finding has a level:

| Level | What Vigie does |
|---|---|
| 🔴 **Critical** | Blocks. No override. |
| 🟠 **High** | Blocks. You can resend knowingly with an override prefix. |
| 🟡 **Moderate** | Warns. The prompt is sent. |
| 💙 **Support** | Never blocks. Shows help resources (personal distress). |

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Limitations

Vigie is a guardrail, not a compliance guarantee.

* **It can be wrong both ways.** Some risky prompts will pass, and some legitimate ones will be flagged.
* **It does not replace the provider's policy.** Its rules approximate a provider's usage policy. Always refer to the official text, such as [Anthropic's Usage Policy](https://www.anthropic.com/legal/aup).
* **Images pasted directly into the chat cannot be checked.** Hooks only receive the prompt text. Image files that the assistant reads, or that you reference with `@`, can be checked *(planned)*.
* **Each prompt is checked on its own**, without the conversation's context.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![Node.js][Node.js]][Node-url]

Vigie has no runtime dependencies.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

Vigie installs as a Claude Code plugin. This repository is its own plugin marketplace.

### Prerequisites

* [Node.js](https://nodejs.org/) 20 or later, available as `node` on your `PATH`
* [Claude Code](https://docs.claude.com/en/docs/claude-code/overview)

### Installation

1. Add the marketplace
   ```sh
   claude plugin marketplace add Giovidoh/vigie
   ```
2. Install the plugin
   ```sh
   claude plugin install vigie@vigie
   ```
3. Start a new Claude Code session. Vigie now checks every prompt before it is sent.

To try it from a local clone instead:
```sh
claude --plugin-dir ./vigie
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

Use Claude Code as usual. Most prompts pass silently. When a prompt matches a rule, Vigie reacts according to its level.

A **High** prompt is blocked and never sent:

```text
Vigie blocked this prompt (category: explosives and weapons).
The provider's usage policy (Anthropic) restricts this content. The prompt was not sent.
If your use is legitimate, resend it starting with !jassume.
Usage policy: https://www.anthropic.com/legal/aup
```

If you know your use is legitimate, resend the prompt starting with `!jassume`. The prompt is then sent, with a notice. The prefix is sent along with the prompt. A **Critical** prompt cannot be sent this way.

A **Moderate** prompt is sent, with a warning. A prompt that suggests personal distress is always sent, and Vigie shows where to find help.

### Language

Messages are in English or French. Vigie follows your system language. To choose it, set `VIGIE_LANG`:

```sh
export VIGIE_LANG=fr
```

### Rules

The rules live in [`rules/anthropic.json`](rules/anthropic.json), one rule set per provider. Each rule has a policy category, a level, and patterns matched against the prompt after it is lowercased and stripped of accents:

* `anyOf`: the rule matches when one of these patterns matches.
* `allOf`: the rule matches only when all of these patterns match. Most rules combine two groups of words, so that a single word such as "child" or "bomb" never triggers anything by itself.
* `unless` and `unlessLevel`: when this pattern also matches, such as "prevention" or "unit tests", the level is lowered instead of cleared.

### Run the tests

```sh
npm test
```

The test suite includes everyday prompts that sit close to a rule on purpose, to keep false positives in check.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [x] **Phase 1: Claude Code MVP**
    - [x] Local rules for text, organized by policy category and level
    - [x] Claude Code hook that checks the prompt before it is sent (`UserPromptSubmit`)
    - [x] Alert messages, and an override prefix for the High level
    - [x] Test suite: prompts that must pass and prompts that must be flagged, with false-positive measurement
    - [x] Packaging as a Claude Code plugin, with a marketplace
- [ ] **Phase 2: Smarter text analysis**
    - [ ] Small local classifier, called after the rules on doubtful prompts
    - [ ] Fall back to rules only when the model is unavailable
- [ ] **Phase 3: Images**
    - [ ] Check image files before the assistant reads them (`PreToolUse`)
    - [ ] Check files referenced with `@` in the prompt
    - [ ] Small local nudity classifier
- [ ] **Phase 4: Beyond Claude**
    - [ ] Split the tool-agnostic core from the Claude Code adapter
    - [ ] Rule sets per provider, mapped to each provider's own usage policy
    - [ ] Adapters for other AI assistants that offer pre-prompt hooks (to be evaluated)
- [ ] **Multi-language Support**
    - [x] Alert messages in English and French
    - [ ] French README

See the [open issues](https://github.com/Giovidoh/vigie/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Rule contributions are especially welcome: false positives, missed cases, and new languages.

### Top contributors:

<a href="https://github.com/Giovidoh/vigie/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Giovidoh/vigie" alt="contrib.rocks image" />
</a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the Apache License 2.0. See [`LICENSE`](LICENSE) for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Project Link: [https://github.com/Giovidoh/vigie](https://github.com/Giovidoh/vigie)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Best-README-Template](https://github.com/othneildrew/Best-README-Template)
* [Claude Code hooks documentation](https://code.claude.com/docs/en/hooks)
* [Img Shields](https://shields.io)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/Giovidoh/vigie.svg?style=for-the-badge
[contributors-url]: https://github.com/Giovidoh/vigie/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Giovidoh/vigie.svg?style=for-the-badge
[forks-url]: https://github.com/Giovidoh/vigie/network/members
[stars-shield]: https://img.shields.io/github/stars/Giovidoh/vigie.svg?style=for-the-badge
[stars-url]: https://github.com/Giovidoh/vigie/stargazers
[issues-shield]: https://img.shields.io/github/issues/Giovidoh/vigie.svg?style=for-the-badge
[issues-url]: https://github.com/Giovidoh/vigie/issues
[license-shield]: https://img.shields.io/github/license/Giovidoh/vigie.svg?style=for-the-badge
[license-url]: https://github.com/Giovidoh/vigie/blob/main/LICENSE
[Node.js]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/
