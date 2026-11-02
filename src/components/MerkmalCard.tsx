import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MEDIA } from '../data/media';
import type { Merkmal } from '../data/types';
import { featureText } from '../i18n';
import type { FeatureAnswer } from '../state/answers';
import { useAnswers } from '../state/AnswersContext';
import { CheckField, ExtLink, TextField } from './fields';

const NOISE_MAP = 'https://www.berlin.de/sen/uvk/umwelt/laerm/laermminderungsplanung-berlin/laermkarten/';

export function MerkmalCard({ m, siblings }: { m: Merkmal; siblings: Merkmal[] }) {
  const { t, i18n } = useTranslation();
  const { a, set } = useAnswers();
  const [showOriginal, setShowOriginal] = useState(false);
  const text = featureText(i18n.language, m.id, m.de);
  const answer = a.features[m.id];
  const media = MEDIA[m.id] ?? [];

  function choose(v: FeatureAnswer) {
    set((prev) => {
      const features = { ...prev.features };
      if (features[m.id] === v) delete features[m.id];
      else features[m.id] = v;
      // Energie-Stufen schließen sich gegenseitig aus
      if (v === 'yes' && m.exclusive) {
        siblings.filter((s) => s.exclusive === m.exclusive && s.id !== m.id).forEach((s) => (features[s.id] = 'no'));
      }
      return { features };
    });
  }

  const options: { v: FeatureAnswer; label: string }[] = [
    { v: 'yes', label: t('common.applies') },
    { v: 'no', label: t('common.notApplies') },
    { v: 'unsure', label: t('common.unsure') },
  ];

  return (
    <article className={`merkmal sign-${m.sign === '+' ? 'plus' : 'minus'} ${answer ? 'answered' : ''}`}>
      <header>
        <span className="sign-badge" aria-label={m.sign === '+' ? t('groups.plus') : t('groups.minus')}>
          {m.sign === '+' ? '+' : '−'}
        </span>
        <h3>{text.q}</h3>
      </header>

      {text.help && <p className="merkmal-help">{text.help}</p>}

      {media.length > 0 && (
        <div className="media">
          {media.map((img) => (
            <figure key={img.src} className={`media-${img.kind}`}>
              <img src={img.src} alt={img.alt} loading="lazy" />
              {img.kind === 'photo' && (
                <figcaption>
                  {t('common.imageCredit')}: {img.author} ·{' '}
                  <a href={img.sourceUrl} target="_blank" rel="noopener noreferrer">
                    {img.license}
                  </a>
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}

      <button type="button" className="link-button" aria-expanded={showOriginal} onClick={() => setShowOriginal(!showOriginal)}>
        {t('common.originalWording')} {showOriginal ? '▲' : '▼'}
      </button>
      {showOriginal && (
        <blockquote lang="de" dir="ltr">
          {m.de}
        </blockquote>
      )}

      <div className="answer-buttons" role="radiogroup" aria-label={text.q}>
        {options.map((o) => (
          <button
            type="button"
            key={o.v}
            role="radio"
            aria-checked={answer === o.v}
            className={`answer answer-${o.v} ${answer === o.v ? 'selected' : ''}`}
            onClick={() => choose(o.v)}
          >
            {o.label}
          </button>
        ))}
      </div>

      {answer === 'yes' && m.sign === '+' && (
        <CheckField
          label={t('common.selfInstalled')}
          checked={!!a.selfInstalled[m.id]}
          onChange={(v) => set((prev) => ({ selfInstalled: { ...prev.selfInstalled, [m.id]: v } }))}
        />
      )}

      {(answer === 'yes' || answer === 'unsure') && m.followUp && (
        <div className="followup">
          {m.followUp === 'laerm' && (
            <div className="checks">
              {(['strasse', 'schiene', 'flug'] as const).map((k) => (
                <CheckField
                  key={k}
                  label={t(`groups.laerm${k[0].toUpperCase()}${k.slice(1)}`)}
                  checked={a.laermArt[k]}
                  onChange={(v) => set((prev) => ({ laermArt: { ...prev.laermArt, [k]: v } }))}
                />
              ))}
              <ExtLink href={NOISE_MAP}>{t('groups.noiseMapLink')}</ExtLink>
            </div>
          )}
          <TextField
            label={t(`followUp.${m.followUp}`)}
            value={a.followUps[m.followUp] ?? ''}
            pdf
            onChange={(v) => set((prev) => ({ followUps: { ...prev.followUps, [m.followUp!]: v } }))}
          />
        </div>
      )}
    </article>
  );
}
