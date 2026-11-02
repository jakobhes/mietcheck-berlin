import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { ChoiceField, Question } from '../components/fields';
import { ChapterIntro } from '../flow/chapters';
import type { Screen } from '../flow/types';
import type { HousePreset } from '../house/presets';
import type { Answers, HouseVariant } from '../state/answers';
import { useAnswers } from '../state/AnswersContext';

function HouseNumber({ house }: { house: HousePreset }) {
  const { t } = useTranslation();
  const { a, set } = useAnswers();
  return (
    <Question title={t('house.number', { street: house.street })}>
      <ChoiceField
        value={a.houseNo}
        options={house.houseNumbers.map((n) => ({ value: n, label: `${house.street} ${n}` }))}
        onChange={(n) =>
          set((p) => {
            // Anschrift vorbelegen, solange sie leer ist oder noch zu diesem Haus gehört
            const own = !p.tenant.street || p.tenant.street.startsWith(house.street);
            const tenant = own ? { ...p.tenant, street: n ? `${house.street} ${n}` : '', zip: house.zip, city: house.city } : p.tenant;
            return { houseNo: n, tenant, ...house.defaults(p) };
          })
        }
      />
    </Question>
  );
}

function Variant({ house }: { house: HousePreset }) {
  const { t } = useTranslation();
  const { a, set } = useAnswers();
  return (
    <Question title={t('house.variant')} help={t('house.variantHelp')}>
      <ChoiceField<HouseVariant>
        value={a.houseVariant}
        options={(['unrenoviert', 'renoviert'] as const).map((v) => ({ value: v, label: t(`house.${v}`) }))}
        onChange={(v) => set((p) => ({ houseVariant: v, ...house.defaults(p) }))}
      />
    </Question>
  );
}

export function houseScreens(house: HousePreset, a: Answers, t: TFunction): Screen[] {
  return [
    { id: 'house.intro', chapter: 'house', intro: true, element: <ChapterIntro chapter="house" title={t('house.title', { name: house.name })} lead={t('house.intro', { name: house.name })} questions={2} /> },
    { id: 'house.number', chapter: 'house', answered: !!a.houseNo, element: <HouseNumber house={house} /> },
    // ohne Zustand wären alle Merkmale offen – deshalb Pflichtfrage
    { id: 'house.variant', chapter: 'house', answered: !!a.houseVariant, blocked: !a.houseVariant, element: <Variant house={house} /> },
  ];
}
