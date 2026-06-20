import { describe, expect, it } from 'vitest';
import { splitNumberedListItems } from './report-text';

describe('splitNumberedListItems', () => {
  it('splits inline numbered remedies on one line', () => {
    const text =
      '1. Strengthen Venus and Mars energies. 2. Chant the Gayatri mantra daily. 3. Engage in acts of charity. 4. Practice daily mindfulness.';
    expect(splitNumberedListItems(text)).toEqual([
      'Strengthen Venus and Mars energies.',
      'Chant the Gayatri mantra daily.',
      'Engage in acts of charity.',
      'Practice daily mindfulness.',
    ]);
  });

  it('splits newline-separated numbered items', () => {
    const text = '1. First remedy.\n2. Second remedy.\n3. Third remedy.';
    expect(splitNumberedListItems(text)).toEqual([
      'First remedy.',
      'Second remedy.',
      'Third remedy.',
    ]);
  });

  it('returns null for plain paragraphs', () => {
    expect(splitNumberedListItems('A calm week ahead with steady progress.')).toBeNull();
  });

  it('handles parenthesis numbering', () => {
    const text = '1) First remedy. 2) Second remedy. 3) Third remedy.';
    expect(splitNumberedListItems(text)).toEqual([
      'First remedy.',
      'Second remedy.',
      'Third remedy.',
    ]);
  });
});
