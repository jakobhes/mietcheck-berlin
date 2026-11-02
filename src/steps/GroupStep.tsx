import type { TFunction } from 'i18next';
import { Notice } from '../components/fields';
import { MerkmalCard } from '../components/MerkmalCard';
import { applicableMerkmale } from '../data/logic';
import type { MerkmalGroup } from '../data/types';
import { ChapterIntro } from '../flow/chapters';
import type { Screen } from '../flow/types';
import type { Answers } from '../state/answers';
import { conditionContext } from '../state/derive';

export function groupScreens(group: MerkmalGroup, a: Answers, t: TFunction): Screen[] {
  const visible = applicableMerkmale(group.merkmale, conditionContext(a));
  const hidden = group.merkmale.length - visible.length;
  // wie im Prüfbogen: erst wohnwertmindernde, dann wohnwerterhöhende Merkmale
  const ordered = [...visible.filter((m) => m.sign === '-'), ...visible.filter((m) => m.sign === '+')];
  return [
    {
      id: `${group.id}.intro`,
      chapter: group.id,
      intro: true,
      element: (
        <ChapterIntro chapter={group.id} lead={t('groups.intro')} questions={ordered.length}>
          {hidden > 0 && <Notice>{t('common.notApplicableHidden', { count: hidden })}</Notice>}
        </ChapterIntro>
      ),
    },
    ...ordered.map((m): Screen => ({ id: `feature.${m.id}`, chapter: group.id, answered: !!a.features[m.id], element: <MerkmalCard m={m} siblings={visible} /> })),
  ];
}
