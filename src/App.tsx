import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { selectFormVersion } from './data/forms';
import type { FormVersion, GroupId } from './data/types';
import { LANGUAGES } from './i18n';
import { useAnswers } from './state/AnswersContext';
import { ContractStep } from './steps/ContractStep';
import { EnergyStep } from './steps/EnergyStep';
import { ExceptionsStep } from './steps/ExceptionsStep';
import { FlatStep } from './steps/FlatStep';
import { GroupStep } from './steps/GroupStep';
import { PersonsStep } from './steps/PersonsStep';
import { RemarksStep } from './steps/RemarksStep';
import { SonderStep } from './steps/SonderStep';
import { StartStep } from './steps/StartStep';
import { SummaryStep } from './steps/SummaryStep';

type StepId = 'contract' | 'exceptions' | 'flat' | 'energy' | 'sonder' | GroupId | 'remarks' | 'persons' | 'summary';

const STEP_KEY = 'mietcheck-berlin:step';

function stepsFor(form: FormVersion | undefined): StepId[] {
  if (!form) return ['contract'];
  return [
    'contract',
    'exceptions',
    'flat',
    'energy',
    ...(form.sonder ? (['sonder'] as const) : []),
    ...form.groups.map((g) => g.id),
    'remarks',
    'persons',
    'summary',
  ];
}

export default function App() {
  const { t, i18n } = useTranslation();
  const { a, reset } = useAnswers();
  const form = useMemo(() => selectFormVersion(a.contractDate), [a.contractDate]);
  const steps = stepsFor(form);
  const [requested, setCurrent] = useState<StepId | 'start'>('start');
  const [savedStep, setSavedStep] = useState(() => localStorage.getItem(STEP_KEY) as StepId | null);
  const mainRef = useRef<HTMLElement>(null);

  // Wenn sich der Prüfbogen ändert, kann ein Schritt (z. B. Sondermerkmale) wegfallen
  const current: StepId | 'start' = requested === 'start' || steps.includes(requested) ? requested : 'contract';
  const index = current === 'start' ? -1 : steps.indexOf(current);

  useEffect(() => {
    if (current !== 'start') localStorage.setItem(STEP_KEY, current);
    window.scrollTo({ top: 0 });
    mainRef.current?.focus({ preventScroll: true });
  }, [current]);

  const canResume = !!savedStep && !!a.contractDate;
  const nextDisabled = current === 'contract' && !form;

  function restart() {
    if (window.confirm(t('common.restartConfirm'))) {
      reset();
      localStorage.removeItem(STEP_KEY);
      setSavedStep(null);
      setCurrent('start');
    }
  }

  function renderStep() {
    if (current === 'start') {
      return (
        <StartStep
          canResume={canResume}
          onStart={() => setCurrent('contract')}
          onResume={() => setCurrent(savedStep && steps.includes(savedStep) ? savedStep : 'contract')}
        />
      );
    }
    if (current === 'contract' || !form) return <ContractStep />;
    switch (current) {
      case 'exceptions':
        return <ExceptionsStep />;
      case 'flat':
        return <FlatStep form={form} />;
      case 'energy':
        return <EnergyStep form={form} />;
      case 'sonder':
        return <SonderStep form={form} />;
      case 'remarks':
        return <RemarksStep />;
      case 'persons':
        return <PersonsStep form={form} />;
      case 'summary':
        return <SummaryStep form={form} />;
      default: {
        const group = form.groups.find((g) => g.id === current)!;
        return <GroupStep key={group.id} group={group} />;
      }
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <button type="button" className="brand" onClick={() => setCurrent('start')}>
          <span className="logo" aria-hidden="true">
            🏠
          </span>
          <span>
            <strong>{t('app.name')}</strong>
            <small>{t('app.tagline')}</small>
          </span>
        </button>
        <div className="lang" role="group" aria-label={t('common.language')}>
          {LANGUAGES.map((l) => (
            <button
              type="button"
              key={l.code}
              lang={l.code}
              className={i18n.language === l.code ? 'selected' : ''}
              aria-pressed={i18n.language === l.code}
              onClick={() => void i18n.changeLanguage(l.code)}
            >
              {l.label}
            </button>
          ))}
        </div>
      </header>

      {index >= 0 && (
        <nav className="progress" aria-label="Fortschritt">
          <div className="progress-bar">
            <div style={{ width: `${((index + 1) / steps.length) * 100}%` }} />
          </div>
          <p>
            {t('common.step', { n: index + 1, total: steps.length })} · <strong>{t(`steps.${current}`)}</strong>
            {form && <span className="badge">Mietspiegel {form.id}</span>}
          </p>
          <ol className="step-list">
            {steps.map((s, i) => (
              <li key={s} className={i === index ? 'current' : i < index ? 'done' : ''}>
                <button type="button" disabled={nextDisabled && i > index} onClick={() => setCurrent(s)}>
                  {t(`steps.${s}`)}
                </button>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <main ref={mainRef} tabIndex={-1}>
        {renderStep()}

        {index >= 0 && (
          <div className="nav">
            <button type="button" className="secondary" onClick={() => setCurrent(index > 0 ? steps[index - 1] : 'start')}>
              {i18n.dir() === 'rtl' ? '→' : '←'} {t('common.back')}
            </button>
            {index < steps.length - 1 && (
              <button type="button" className="primary" disabled={nextDisabled} onClick={() => setCurrent(steps[index + 1])}>
                {t('common.next')} {i18n.dir() === 'rtl' ? '←' : '→'}
              </button>
            )}
          </div>
        )}
      </main>

      <footer className="footer">
        <p>{t('start.disclaimer')}</p>
        <p>
          <button type="button" className="link-button" onClick={restart}>
            {t('common.restart')}
          </button>{' '}
          ·{' '}
          <a href="https://github.com/jakobhes/mietcheck-berlin" target="_blank" rel="noopener noreferrer">
            GitHub · MIT License
          </a>
        </p>
      </footer>
    </div>
  );
}
