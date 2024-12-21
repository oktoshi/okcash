import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PersonaSidebar } from '../../components/PersonaSidebar';
import { personas } from '../../config/personas';

describe('PersonaSidebar', () => {
  const mockOnPersonaChange = vi.fn();
  const availablePersonas = Object.keys(personas).filter(key => key !== 'default');
  const currentPersona = personas.okai;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders all personas', () => {
    render(
      <PersonaSidebar
        personas={availablePersonas}
        currentPersona={currentPersona}
        onPersonaChange={mockOnPersonaChange}
      />
    );

    availablePersonas.forEach(personaKey => {
      const persona = personas[personaKey];
      expect(screen.getByText(persona.name)).toBeInTheDocument();
    });
  });
});