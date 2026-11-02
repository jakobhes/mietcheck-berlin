import { useId, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { YesNo } from '../state/answers';
import { hasNonLatin } from '../state/derive';

/** Aufklappbarer Hilfetext */
export function Help({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <div className="help">
      <button type="button" className="help-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span aria-hidden="true">ⓘ</span> {open ? t('common.lessInfo') : t('common.moreInfo')}
      </button>
      {open && <div className="help-body">{children}</div>}
    </div>
  );
}

interface FieldProps {
  label: ReactNode;
  help?: ReactNode;
  children: ReactNode;
  htmlFor?: string;
}

export function Field({ label, help, children, htmlFor }: FieldProps) {
  return (
    <div className="field">
      <label className="field-label" htmlFor={htmlFor}>
        {label}
      </label>
      {help && <Help>{help}</Help>}
      {children}
    </div>
  );
}

interface TextProps {
  label: ReactNode;
  help?: ReactNode;
  value: string;
  onChange: (v: string) => void;
  type?: 'text' | 'date' | 'email' | 'tel';
  inputMode?: 'decimal' | 'numeric' | 'text';
  placeholder?: string;
  multiline?: boolean;
  /** Warnung zeigen, wenn Zeichen nicht ins PDF passen */
  pdf?: boolean;
  suffix?: string;
  autoComplete?: string;
}

export function TextField({ label, help, value, onChange, type = 'text', inputMode, placeholder, multiline, pdf, suffix, autoComplete }: TextProps) {
  const id = useId();
  const { t } = useTranslation();
  const warn = pdf && hasNonLatin(value);
  return (
    <Field label={label} help={help} htmlFor={id}>
      <div className="input-row">
        {multiline ? (
          <textarea id={id} value={value} rows={3} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
        ) : (
          <input
            id={id}
            type={type}
            value={value}
            inputMode={inputMode}
            placeholder={placeholder}
            autoComplete={autoComplete}
            dir={type === 'date' || inputMode ? 'ltr' : undefined}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
        {suffix && <span className="suffix">{suffix}</span>}
      </div>
      {warn && <p className="warn">{t('common.latinWarning')}</p>}
    </Field>
  );
}

interface ChoiceProps<T extends string> {
  label: ReactNode;
  help?: ReactNode;
  value: T;
  options: { value: T; label: ReactNode }[];
  onChange: (v: T) => void;
}

export function Choice<T extends string>({ label, help, value, options, onChange }: ChoiceProps<T>) {
  const name = useId();
  return (
    <fieldset className="field">
      <legend className="field-label">{label}</legend>
      {help && <Help>{help}</Help>}
      <div className="choices">
        {options.map((o) => (
          <label key={o.value} className={`chip ${value === o.value ? 'selected' : ''}`}>
            <input type="radio" name={name} checked={value === o.value} onChange={() => onChange(o.value)} />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function YesNoField({ label, help, value, onChange }: { label: ReactNode; help?: ReactNode; value: YesNo; onChange: (v: YesNo) => void }) {
  const { t } = useTranslation();
  return (
    <Choice<YesNo>
      label={label}
      help={help}
      value={value}
      onChange={(v) => onChange(v === value ? '' : v)}
      options={[
        { value: 'ja', label: t('common.yes') },
        { value: 'nein', label: t('common.no') },
      ]}
    />
  );
}

export function CheckField({ label, checked, onChange }: { label: ReactNode; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className={`check ${checked ? 'selected' : ''}`}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

export function Notice({ kind = 'info', children }: { kind?: 'info' | 'warn' | 'ok'; children: ReactNode }) {
  return (
    <div className={`notice notice-${kind}`} role={kind === 'warn' ? 'alert' : undefined}>
      {children}
    </div>
  );
}

export function ExtLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children} ↗
    </a>
  );
}
