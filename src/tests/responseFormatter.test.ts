import { describe, test, expect, vi } from 'vitest';
import { formatResponse } from '../utils/responseFormatter';
import { personas } from '../config/personas';
import { ValidationError } from '../utils/errors';
import * as personaFormatter from '../utils/personaFormatter';

vi.mock('../utils/personaFormatter', () => ({
  formatPersonaResponse: vi.fn(content => content)
}));

vi.mock('../utils/logger');

describe('responseFormatter', () => {
  const testMessage = { id: '1', role: 'assistant' as const, content: 'Test response' };
  const testPersona = personas.okai;

  test('formats response with persona style', () => {
    const result = formatResponse(testMessage, testPersona);
    expect(result).toBeDefined();
    expect(personaFormatter.formatPersonaResponse).toHaveBeenCalledWith(
      testMessage.content,
      testPersona
    );
  });

  test('preserves message structure', () => {
    const result = formatResponse(testMessage, testPersona);
    expect(result.id).toBe(testMessage.id);
    expect(result.role).toBe(testMessage.role);
  });

  test('throws on empty content', () => {
    expect(() => formatResponse({ ...testMessage, content: '' }, testPersona))
      .toThrow(ValidationError);
  });

  test('throws on non-assistant message', () => {
    expect(() => formatResponse({ ...testMessage, role: 'user' as const }, testPersona))
      .toThrow(ValidationError);
  });
});