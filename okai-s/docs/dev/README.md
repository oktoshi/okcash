# OKai-S Development Workflow

This guide outlines the development workflow and best practices for contributing to OKai-S. Whether you're adding new personas, extending knowledge bases, or implementing features, following these guidelines ensures consistent quality and maintainable code.

## Table of Contents

1. [Branch Strategy](#branch-strategy)
2. [Development Workflow](#development-workflow)
3. [Adding New Features](#adding-new-features)
4. [Knowledge Base Development](#knowledge-base-development)
5. [Persona Development](#persona-development)
6. [Testing Guidelines](#testing-guidelines)
7. [Release Process](#release-process)

## Branch Strategy

### Main Branches
- `main`: Production-ready code
- `develop`: Integration branch for features

### Feature Branches
Create from `develop` with the format:
```bash
feature/descriptive-name
fix/issue-description
docs/documentation-update
```

## Development Workflow

1. **Start New Feature**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Regular Development**
   ```bash
   # Make changes
   git add .
   git commit -m "feat: add new feature"
   
   # Keep branch updated
   git fetch origin develop
   git rebase origin/develop
   ```

3. **Submit Changes**
   ```bash
   git push origin feature/your-feature-name
   # Create PR to develop branch
   ```

4. **After Review**
   - Address review comments
   - Update PR
   - Wait for approval
   - Merge to develop

## Adding New Features

### 1. Planning
- Create issue describing feature
- Discuss implementation approach
- Define acceptance criteria

### 2. Implementation
- Follow code organization principles:
  ```
  src/
  ├── components/     # React components
  ├── hooks/         # Custom hooks
  ├── utils/         # Utility functions
  ├── config/        # Configuration files
  └── types/         # TypeScript types
  ```

### 3. Code Guidelines
- Keep files small and focused
- Write meaningful comments
- Use TypeScript strictly
- Follow existing patterns

### 4. Testing
- Write unit tests for new features
- Test edge cases
- Verify UI responsiveness
- Check console for errors

## Knowledge Base Development

### 1. Create New Knowledge Base
```typescript
// src/config/knowledge/yourDomain.ts
import type { KnowledgeBase } from './types';

const knowledge: KnowledgeBase = {
  name: "Domain Name",
  topics: {
    category1: [
      "Topic 1",
      "Topic 2"
    ]
  },
  prompts: {
    context1: "Prompt for specific context"
  },
  sampleQA: {
    category1: [
      {
        question: "Common question?",
        answer: "Detailed answer"
      }
    ]
  }
};

export default knowledge;
```

### 2. Best Practices
- Organize topics logically
- Write clear, concise answers
- Include common variations
- Test pattern matching
- Update documentation

## Persona Development

### 1. Create New Persona
```typescript
// src/config/personas/newPersona.ts
import type { AIPersona } from './types';

const persona: AIPersona = {
  name: "Persona Name",
  description: "Brief description",
  systemPrompt: `Detailed character instructions...`,
  knowledgeBases: ['relevantKnowledge'],
  customKnowledge: [
    "Specific expertise",
    "Domain knowledge"
  ],
  displayOrder: 1
};

export default persona;
```

### 2. Persona Guidelines
- Define clear personality
- Write consistent prompts
- Link relevant knowledge
- Test responses
- Document behavior

## Testing Guidelines

### 1. Unit Tests
```typescript
import { expect, test } from 'vitest';
import { yourFunction } from './yourModule';

test('function description', () => {
  expect(yourFunction()).toBe(expectedResult);
});
```

### 2. Test Categories
- Component rendering
- User interactions
- API responses
- Error handling
- Edge cases

### 3. Running Tests
```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run coverage
```

## Release Process

### 1. Prepare Release
```bash
# Update develop
git checkout develop
git pull origin develop

# Create release branch
git checkout -b release/v1.2.3
```

### 2. Version Update
```bash
# Update version
npm run release minor  # or major/patch

# Review changes
git diff
```

### 3. Testing
- Run all tests
- Check build process
- Verify documentation
- Test key features

### 4. Finalize Release
```bash
# Merge to main
git checkout main
git merge release/v1.2.3

# Create tag
git tag -a v1.2.3 -m "Release v1.2.3"

# Push changes
git push origin main --tags
```

### 5. Post-Release
- Monitor deployment
- Update documentation
- Notify contributors
- Plan next release

## Continuous Integration

GitHub Actions automatically:
- Builds project
- Runs tests
- Checks types
- Lints code
- Analyzes security
- Creates releases

## Need Help?

- Check existing issues
- Ask in Discord
- Review documentation
- Contact maintainers

Remember: Quality > Speed. Take time to write good code, tests, and documentation.