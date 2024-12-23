# Contributing to OKai-S

Thank you for your interest in contributing to OKai-S! This document provides guidelines and instructions for contributing.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Making Changes](#making-changes)
5. [Testing](#testing)
6. [Pull Request Process](#pull-request-process)

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/okai-s.git
   cd okai-s
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your OpenRouter API key to `.env`:
   ```
   VITE_OPENROUTER_API_KEY=your_api_key_here
   VITE_SITE_URL=http://localhost:5173
   VITE_APP_NAME="OKai S Development"
   ```

## Making Changes

1. Follow our coding standards:
   - Use TypeScript
   - Follow ESLint rules
   - Write meaningful commit messages
   - Add tests for new features

2. Keep changes focused:
   - One feature per PR
   - Small, reviewable changes
   - Clear documentation updates

3. Code organization:
   - Keep files small and focused
   - Use appropriate directory structure
   - Extract reusable logic into utilities

## Testing

1. Run tests:
   ```bash
   npm run test        # Run all tests
   npm run test:watch  # Watch mode
   npm run coverage    # Coverage report
   ```

2. Test requirements:
   - Maintain >80% coverage
   - Add tests for new features
   - Update existing tests as needed

## Pull Request Process

1. Update documentation
2. Add tests
3. Update CHANGELOG.md
4. Create PR with:
   - Clear description
   - Link to related issues
   - Screenshots if UI changes
   - Test coverage report

## Need Help?

Join our community:
- Discord: [discord.gg/grvpc8c](https://discord.gg/grvpc8c)
- Telegram: [t.me/ok_heroes](https://t.me/ok_heroes)