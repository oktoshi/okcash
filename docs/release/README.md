# Release System Best Practices

This guide outlines the best practices for making code changes and managing releases in the project.

## Code Change Guidelines

### File Organization

1. **Create Small, Focused Files**
   - Keep files concise and single-purpose
   - Aim for files under 200 lines of code
   - Split large components into smaller subcomponents

2. **Module Breakdown**
   - Break large files into multiple smaller modules
   - Group related functionality together
   - Use clear, descriptive file names

3. **Single Responsibility**
   - Each file should have one clear purpose
   - Files should be self-contained and independent
   - Avoid mixing unrelated functionality

4. **Utility Extraction**
   - Move reusable logic into separate utility files
   - Create shared hooks for common functionality
   - Keep utilities pure and well-documented

## Release Process

### Making Changes

1. Use conventional commit messages:
   ```bash
   feat: add new feature
   fix: resolve bug issue
   docs: update documentation
   style: format code
   refactor: restructure code
   test: add tests
   chore: update dependencies
   ```

2. Keep commits focused and atomic

### Creating Releases

1. Ensure all changes are committed
2. Run the appropriate release command:
   ```bash
   # For bug fixes
   npm run release patch   # 0.0.x

   # For new features
   npm run release minor   # 0.x.0

   # For breaking changes
   npm run release major   # x.0.0
   ```

3. Follow the printed instructions to:
   - Push changes: `git push origin main`
   - Push tag: `git push origin v{version}`
   - Create GitHub release with the generated changelog

### Automatic Updates

The release system will:
- Update version in package.json
- Generate CHANGELOG.md entries
- Create git tags
- Build the project

## Best Practices

1. **Regular Releases**
   - Release often with smaller changes
   - Keep changes focused and well-documented
   - Test thoroughly before releasing

2. **Documentation**
   - Update documentation with changes
   - Include migration guides for breaking changes
   - Keep changelog entries clear and descriptive

3. **Version Numbers**
   - Follow semantic versioning
   - Use patch for bug fixes
   - Use minor for new features
   - Use major for breaking changes

4. **Quality Control**
   - Run tests before releasing
   - Review generated changelog
   - Verify build process completes successfully