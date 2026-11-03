---
layout: default
title: Andalus AI Documentation
---

# Andalus AI Documentation

Andalus AI is an open-source Java AI/ML ecosystem with separate projects for reusable machine-learning foundations, training workflows and inference serving.

## Choose a project

| Project | Responsibility | Current documentation |
|---|---|---|
| [Aljabr](https://github.com/andalus-ai/aljabr) | Java ML framework: tensors, operators, model abstractions and compute backends | [README](https://github.com/andalus-ai/aljabr/blob/main/README.md) · [Architecture](https://github.com/andalus-ai/aljabr/blob/main/docs/architecture/FRAMEWORK_ARCHITECTURE.md) |
| [Tafkir](https://github.com/andalus-ai/tafkir) | Training, fine-tuning, evaluation and adaptation workflows | [Repository](https://github.com/andalus-ai/tafkir) · [Quantization integration](https://github.com/andalus-ai/tafkir/blob/main/docs/architecture/ALJABR_QUANTIZATION_INTEGRATION.md) |
| [AQLI](https://github.com/andalus-ai/aqli) | Inference runtime, runners, scheduling, streaming and serving | [README](https://github.com/andalus-ai/aqli/blob/main/README.md) · [Architecture](https://github.com/andalus-ai/aqli/blob/main/docs/architecture/SYSTEM_ARCHITECTURE.md) |

## Architecture

Aljabr provides the shared computation foundation. Tafkir and AQLI are independent consumers:

- **Aljabr** does not depend on Tafkir or AQLI.
- **Tafkir** builds training and adaptation workflows on Aljabr.
- **AQLI** builds inference and serving workflows on Aljabr.
- Tafkir is not required for ordinary inference, and AQLI is not required for training.

## Documentation migration

The existing pages on this site were written when these capabilities were presented together as Gollek. They are being reviewed and migrated by project ownership rather than mechanically renamed.

See the [documentation ownership and migration map](/docs/migration/) for the page inventory, canonical source documents, migration sequence and acceptance criteria.

## Historical Gollek documentation

The legacy setup guides, tutorials, generated API references and release notes remain available in the site navigation while they are reviewed. They describe earlier versions and architecture. Old Gollek commands, package coordinates, API signatures and capability claims are not current instructions unless independently verified against the relevant project.

## Contributing

For implementation and API changes, use the issue tracker and contribution guidance in the owning project repository. Website-specific documentation changes belong in the [website repository](https://github.com/andalus-ai/website).
