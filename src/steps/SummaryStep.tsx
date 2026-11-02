import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckField, Notice, TextField } from '../components/fields';
import { formatDateDe, refundRule, todayIso } from '../data/logic';
import { photoCredits } from '../data/media';
import type { FormVersion } from '../data/types';
import { featureText } from '../i18n';
import { useAnswers } from '../state/AnswersContext';
import { groupStats } from '../state/derive';

function download(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export function SummaryStep({ form }: { form: FormVersion }) {
  const { t, i18n } = useTranslation();
  const { a, set } = useAnswers();
  const [busy, setBusy] = useState<'form' | 'ruege' | null>(null);
  const today = todayIso();
  const stats = groupStats(form, a);
  const unsure = stats.reduce((n, s) => n + s.unsure.length, 0);
  const rule = a.contractDate ? refundRule(a.contractDate, a.rentStart, today) : undefined;

  const missing = [
    !a.rent && t('contract.rent'),
    !a.area && t('flat.area'),
    !a.buildYear && t('flat.buildYear'),
    !a.tenant.name && t('persons.name'),
    !a.landlord.name && t('persons.landlordName'),
  ].filter(Boolean) as string[];

  async function makeForm() {
    setBusy('form');
    try {
      const { buildPruefbogen } = await import('../pdf/pruefbogen');
      download(await buildPruefbogen(form, a, today), `Pruefbogen-169A-Mietspiegel-${form.id}.pdf`);
    } finally {
      setBusy(null);
    }
  }

  async function makeRuege() {
    setBusy('ruege');
    try {
      const { buildRuege } = await import('../pdf/ruege');
      download(await buildRuege(form, a, today), `Ruege-556g-BGB-${today}.pdf`);
    } finally {
      setBusy(null);
    }
  }

  const credits = photoCredits();

  return (
    <section className="step">
      <h2>{t('summary.title')}</h2>

      {rule?.kind === 'fromStart' && <Notice kind="ok">{t('summary.deadlineFromStart', { date: formatDateDe(rule.deadline) })}</Notice>}
      {rule?.kind === 'fromRuegeLate' && <Notice kind="warn">{t('summary.deadlineLate', { date: formatDateDe(rule.deadline) })}</Notice>}
      {rule?.kind === 'fromRuegeOld' && <Notice kind="warn">{t('summary.deadlineOld')}</Notice>}

      <h3>{t('summary.groupsTitle')}</h3>
      <div className="stats">
        {stats.map((s) => (
          <div key={s.group.id} className={`stat tendency-${s.tendency}`}>
            <h4>{t(`steps.${s.group.id}`)}</h4>
            <p className="stat-numbers">
              <span className="n-minus">− {s.minus.length}</span> <span className="n-plus">+ {s.plus.length}</span>
            </p>
            <p className="stat-tendency">
              {s.tendency === 'minus' ? t('summary.tendencyMinus') : s.tendency === 'plus' ? t('summary.tendencyPlus') : t('summary.tendencyNeutral')}
            </p>
            {(s.minus.length > 0 || s.plus.length > 0) && (
              <ul>
                {[...s.minus, ...s.plus].map((m) => (
                  <li key={m.id} className={m.sign === '+' ? 'plus' : 'minus'}>
                    {featureText(i18n.language, m.id, m.de).q}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      <p className="small">{t('summary.tendencyExplain')}</p>
      {unsure > 0 && <Notice>{t('summary.unsureCount', { count: unsure })}</Notice>}

      <TextField label={`${t('summary.maxRent')} (${t('common.optional')})`} help={t('summary.maxRentHelp')} inputMode="decimal" suffix="€" value={a.maxRent} onChange={(v) => set({ maxRent: v })} />
      <CheckField label={t('summary.demandInfo')} checked={a.demandInfo} onChange={(v) => set({ demandInfo: v })} />

      {missing.length > 0 && <Notice kind="warn">{t('summary.missing', { fields: missing.join(' · ') })}</Notice>}

      <div className="downloads">
        <button type="button" className="primary big" disabled={busy !== null} onClick={makeForm}>
          📄 {busy === 'form' ? t('summary.generating') : t('summary.downloadForm', { year: form.id })}
        </button>
        <button type="button" className="primary big" disabled={busy !== null} onClick={makeRuege}>
          ✉️ {busy === 'ruege' ? t('summary.generating') : t('summary.downloadRuege')}
        </button>
      </div>

      <h3>{t('summary.nextTitle')}</h3>
      <ol className="next-steps">
        <li>{t('summary.next1', { address: form.sendTo.post.join(', '), email: form.sendTo.email ? ` · ${form.sendTo.email}` : '' })}</li>
        <li>{t('summary.next2')}</li>
        <li>{t('summary.next3')}</li>
        <li>{t('summary.next4')}</li>
      </ol>

      {credits.length > 0 && (
        <details className="credits">
          <summary>{t('credits.open')}</summary>
          <p className="small">{t('credits.intro')}</p>
          <ul>
            {credits.map((c) => (
              <li key={c.src}>
                {c.alt} – {c.author},{' '}
                <a href={c.licenseUrl ?? c.sourceUrl} target="_blank" rel="noopener noreferrer">
                  {c.license}
                </a>
                ,{' '}
                <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer">
                  Wikimedia Commons
                </a>
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}
