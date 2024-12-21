import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PersonaSidebar } from '../../components/PersonaSidebar';
import { personas } from '../../config/personas';

describe('PersonaSidebar', () => {
  const mockOnPersonaChange = vi.fn();
  const availablePersonas = Object.keys(personas).filter(key => key !== 'default');
  const currentPersona = personas.okai;

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

  test('highlights current persona', () => {
    render(
      <PersonaSidebar
        personas={availablePersonas}
        currentPersona={currentPersona}
        onPersonaChange={mockOnPersonaChange}
      />
    );

    const currentButton = screen.getByText(currentPersona.name).closest('button');
    expect(currentButton).toHaveClass('bg-blue-600');
  });

  test('calls onPersonaChange when clicking persona', () => {
    render(
      <PersonaSidebar
        personas={availablePersonas}
        currentPersona={currentPersona}
        onPersonaChange={mockOnPersonaChange}
      />
    );

    const elonButton = screen.getByText('Elon Musk');
    fireEvent.click(elonButton);
    expect(mockOnPersonaChange).toHaveBeenCalledWith('elonMusk');
  });
});