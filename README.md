# Andalus AI Website

The public website and documentation hub for the Andalus AI ecosystem.

**Andalus AI** is an open-source ecosystem of focused projects for building, training and running AI/ML applications with Java.

## Project map

| Project | Responsibility | Repository |
|---|---|---|
| **Aljabr** | Java ML framework and reusable compute foundations | [andalus-ai/aljabr](https://github.com/andalus-ai/aljabr) |
| **Tafkir** | Training, fine-tuning, evaluation and adaptation workflows | [andalus-ai/tafkir](https://github.com/andalus-ai/tafkir) |
| **AQLI** | Inference runtime, scheduling, streaming and serving | [andalus-ai/aqli](https://github.com/andalus-ai/aqli) |
| **Andalus Framework** | Reusable agent-framework contracts and capabilities | [andalus-ai/andalus-framework](https://github.com/andalus-ai/andalus-framework) |
| **Andalus Runtime** | Agent execution and orchestration runtime | [andalus-ai/andalus](https://github.com/andalus-ai/andalus) |
| **Iket** | API gateway | [andalus-ai/iket](https://github.com/andalus-ai/iket) |

## Architecture boundaries

- Aljabr is the shared ML foundation and does not depend on AQLI or Tafkir.
- Tafkir builds training and adaptation workflows on Aljabr.
- AQLI builds inference and serving workflows on Aljabr.
- Tafkir and AQLI are independent consumers; neither is a required dependency of the other.
- Andalus application/runtime projects may integrate with model and inference services through explicit interfaces.

## Historical Gollek content

The former root README has been preserved at [Historical Gollek SDK README](docs/archive/gollek-sdk-readme.md.txt).

The website previously described the ML framework, training capabilities and inference runtime as one Gollek product. That architecture has since been split across Aljabr, Tafkir and AQLI.

Existing Gollek articles, tutorials and API references are retained during migration. They are historical sources until reviewed; old commands, artifact coordinates, API examples and capability claims must not be assumed to apply to current repositories.

## Local development

This site is built with Jekyll.

```bash
bundle install
bundle exec jekyll serve
```

Build and validate:

```bash
bundle exec jekyll build
ruby scripts/check-agent-serving-templates.rb
ruby scripts/check-docs-links.rb
```

## Contributing

Please open issues or pull requests in this repository for website and documentation changes. Project implementation issues should be filed in the relevant project repository.

The website build workflow runs on pull requests and pushes to the default branch.
