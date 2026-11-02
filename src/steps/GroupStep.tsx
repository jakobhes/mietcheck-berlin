import { useTranslation } from 'react-i18next';
import { Notice } from '../components/fields';
import { MerkmalCard } from '../components/MerkmalCard';
import { applicableMerkmale } from '../data/logic';
import type { MerkmalGroup } from '../data/types';
import { useAnswers } from '../state/AnswersContext';
import { conditionContext, counts } from '../state/derive';

export function GroupStep({ group }: { group: MerkmalGroup }) {
  const { t } = useTranslation();
  const { a } = useAnswers();
  const ctx = conditionContext(a);
  const visible = applicableMerkmale(group.merkmale, ctx);
  const hidden = group.merkmale.length - visible.length;
  const minus = visible.filter((m) => m.sign === '-');
  const plus = visible.filter((m) => m.sign === '+');
  const nMinus = minus.filter((m) => counts(m, a, ctx)).length;
  const nPlus = plus.filter((m) => counts(m, a, ctx)).length;

  return (
    <section className="step">
      <h2>{t(`steps.${group.id}`)}</h2>
      <p className="lead">{t('groups.intro')}</p>
      <p className="counter" aria-live="polite">
        {t('groups.counter', { minus: nMinus, plus: nPlus })}
      </p>
      {hidden > 0 && <Notice>{t('common.notApplicableHidden', { count: hidden })}</Notice>}

      <h3 className="col-title minus">{t('groups.minus')}</h3>
      {minus.map((m) => (
        <MerkmalCard key={m.id} m={m} siblings={visible} />
      ))}
      <h3 className="col-title plus">{t('groups.plus')}</h3>
      {plus.map((m) => (
        <MerkmalCard key={m.id} m={m} siblings={visible} />
      ))}
    </section>
  );
}
