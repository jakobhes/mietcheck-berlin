import { useTranslation } from 'react-i18next';
import { Notice } from '../components/fields';

export function StartStep({ onStart, canResume, onResume }: { onStart: () => void; canResume: boolean; onResume: () => void }) {
  const { t } = useTranslation();
  return (
    <section className="step start">
      <h2>{t('start.title')}</h2>
      <p>{t('start.intro')}</p>
      <ol className="outputs">
        <li>{t('start.out1')}</li>
        <li>{t('start.out2')}</li>
      </ol>
      <h3>{t('start.needTitle')}</h3>
      <ul className="need">
        <li>📄 {t('start.need1')}</li>
        <li>🔥 {t('start.need2')}</li>
        <li>📏 {t('start.need3')}</li>
        <li>⏱️ {t('start.need4')}</li>
      </ul>
      <Notice kind="ok">🔒 {t('start.privacy')}</Notice>
      <Notice>{t('start.disclaimer')}</Notice>
      <div className="nav nav-start">
        {canResume && (
          <button type="button" className="secondary" onClick={onResume}>
            {t('start.resumeButton')}
          </button>
        )}
        <button type="button" className="primary" onClick={onStart}>
          {t('start.startButton')}
        </button>
      </div>
    </section>
  );
}
