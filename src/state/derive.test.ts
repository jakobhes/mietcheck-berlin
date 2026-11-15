import { describe, expect, it } from 'vitest';
import { initialAnswers } from './answers';
import { pdfFileName } from './derive';

describe('pdfFileName', () => {
  const name = (n: string) => pdfFileName({ ...initialAnswers, tenant: { ...initialAnswers.tenant, name: n } }, 'Pruefbogen.pdf');

  it('puts the last name first', () => {
    expect(name('Erika Mustermann')).toBe('Mustermann_Pruefbogen.pdf');
    expect(name('Mustermann, Erika')).toBe('Mustermann_Pruefbogen.pdf');
    expect(name('  Jörg  Müller-Lüdenscheidt ')).toBe('Müller-Lüdenscheidt_Pruefbogen.pdf');
  });

  it('keeps the file name without a usable name', () => {
    expect(name('')).toBe('Pruefbogen.pdf');
    expect(name('/?*')).toBe('Pruefbogen.pdf');
  });
});
