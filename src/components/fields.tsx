import { Alert, Anchor, Checkbox, Collapse, Group, NativeSelect, Paper, Radio, SimpleGrid, Stack, Text, TextInput, Textarea, Title, UnstyledButton } from '@mantine/core';
import { IconAlertTriangle, IconChevronDown, IconCircleCheck, IconExternalLink, IconInfoCircle } from '@tabler/icons-react';
import { createContext, useContext, useId, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useFlow } from '../flow/FlowContext';
import { useLayout } from '../flow/LayoutContext';
import type { YesNo } from '../state/answers';
import { hasNonLatin } from '../state/derive';

/** ID der Überschrift des aktuellen Bildschirms – Eingaben ohne eigenes Label verweisen darauf */
const TitleIdContext = createContext<string | undefined>(undefined);

interface QuestionProps {
  title: ReactNode;
  /** kleine Zeile über der Überschrift, z. B. ein Merkmal-Badge */
  eyebrow?: ReactNode;
  lead?: ReactNode;
  help?: ReactNode;
  children?: ReactNode;
  /** längere Erläuterungen etwas kleiner */
  leadSize?: 'md' | 'lg';
}

/** Layout eines Bildschirms: eine Frage, kurze Einleitung, Hilfe nur auf Wunsch */
export function Question({ title, eyebrow, lead, help, children, leadSize = 'lg' }: QuestionProps) {
  const titleId = useId();
  const stacked = useLayout() === 'stacked';
  const body = (
    <Stack gap={stacked ? 'md' : 'lg'}>
      <Stack gap="xs">
        {eyebrow}
        <Title order={stacked ? 2 : 1} id={titleId} className={stacked ? 'card-title' : 'question-title'}>
          {title}
        </Title>
        {lead && (
          <Text className="lead" size={stacked ? 'md' : leadSize}>
            {lead}
          </Text>
        )}
        {help && <Help>{help}</Help>}
      </Stack>
      {children}
    </Stack>
  );
  return (
    <TitleIdContext.Provider value={titleId}>
      {stacked ? (
        <Paper withBorder radius="xl" p="xl" className="q-card">
          {body}
        </Paper>
      ) : (
        body
      )}
    </TitleIdContext.Provider>
  );
}

/** Aufklappbarer Hilfetext (progressive disclosure) */
export function Help({ children, label }: { children: ReactNode; label?: ReactNode }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <div>
      <UnstyledButton className="help-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>
        <IconInfoCircle size={18} stroke={1.8} />
        <span>{label ?? (open ? t('common.lessInfo') : t('common.moreInfo'))}</span>
        <IconChevronDown size={16} className="chevron" data-open={open || undefined} />
      </UnstyledButton>
      <Collapse expanded={open}>
        <div className="help-body">{children}</div>
      </Collapse>
    </div>
  );
}

interface TextProps {
  /** ohne Label wird die Überschrift des Bildschirms als Beschriftung verwendet */
  label?: ReactNode;
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
  autoFocus?: boolean;
}

export function TextField({ label, value, onChange, type = 'text', inputMode, placeholder, multiline, pdf, suffix, autoComplete, autoFocus }: TextProps) {
  const { t } = useTranslation();
  const titleId = useContext(TitleIdContext);
  const stacked = useLayout() === 'stacked';
  const error = pdf && hasNonLatin(value) ? t('common.latinWarning') : undefined;
  const a11y = label ? {} : { 'aria-labelledby': titleId };
  if (multiline) {
    return <Textarea label={label} value={value} placeholder={placeholder} error={error} autoFocus={autoFocus && !stacked} onChange={(e) => onChange(e.currentTarget.value)} {...a11y} />;
  }
  return (
    <TextInput
      label={label}
      type={type}
      value={value}
      inputMode={inputMode}
      placeholder={placeholder}
      autoComplete={autoComplete}
      autoFocus={autoFocus && !stacked}
      error={error}
      dir={type === 'date' || inputMode ? 'ltr' : undefined}
      rightSection={suffix ? <Text c="dimmed" size="sm">{suffix}</Text> : undefined}
      rightSectionWidth={suffix ? Math.max(44, suffix.length * 9 + 16) : undefined}
      onChange={(e) => onChange(e.currentTarget.value)}
      {...a11y}
    />
  );
}

/**
 * Monat + Jahr als zwei native Auswahllisten (auf dem Handy das System-Auswahlrad).
 * Wert „yyyy-mm“, leer solange nicht beides gewählt ist; ältere Werte „yyyy-mm-dd“ werden angezeigt.
 */
export function MonthField({ value, onChange, fromYear, toYear }: { value: string; onChange: (v: string) => void; fromYear: number; toYear: number }) {
  const { t, i18n } = useTranslation();
  const [month, setMonth] = useState(value.slice(5, 7));
  const [year, setYear] = useState(value.slice(0, 4));
  const monthName = new Intl.DateTimeFormat(i18n.language, { month: 'long' });
  const months = Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1).padStart(2, '0'), label: monthName.format(new Date(2000, i, 1)) }));
  const years = Array.from({ length: toYear - fromYear + 1 }, (_, i) => String(toYear - i));
  function update(m: string, y: string) {
    setMonth(m);
    setYear(y);
    onChange(m && y ? `${y}-${m}` : '');
  }
  return (
    <Group grow align="flex-start" wrap="nowrap">
      <NativeSelect size="lg" radius="md" label={t('common.month')} value={month} data={[{ value: '', label: '–' }, ...months]} onChange={(e) => update(e.currentTarget.value, year)} />
      <NativeSelect size="lg" radius="md" label={t('common.year')} value={year} data={['', ...years].map((y) => ({ value: y, label: y || '–' }))} onChange={(e) => update(month, e.currentTarget.value)} />
    </Group>
  );
}

export interface Option<T extends string> {
  value: T;
  label: ReactNode;
  icon?: ReactNode;
}

/** Große, gut antippbare Antwortkarten */
export function OptionList<T extends string>({ value, options, onChange, label }: { value: T | ''; options: Option<T>[]; onChange: (v: T) => void; label?: string }) {
  const titleId = useContext(TitleIdContext);
  const name = useId();
  const stacked = useLayout() === 'stacked';
  const Wrapper = stacked ? SimpleGrid : Stack;
  return (
    <Wrapper {...(stacked ? { cols: Math.min(options.length, 3), spacing: 'sm' } : { gap: 'sm' })} role="radiogroup" aria-label={label} aria-labelledby={label ? undefined : titleId}>
      {options.map((o) => (
        <Radio.Card key={o.value} className="option" name={name} value={o.value} checked={value === o.value} withBorder onClick={() => onChange(o.value)}>
          <Group wrap="nowrap" gap={stacked ? 'sm' : 'md'}>
            <Radio.Indicator size="md" />
            {o.icon && !stacked && <span className="option-icon">{o.icon}</span>}
            <Text fw={500} size={stacked ? 'md' : 'lg'}>
              {o.label}
            </Text>
          </Group>
        </Radio.Card>
      ))}
    </Wrapper>
  );
}

/** Einfachauswahl; ein zweiter Klick hebt die Auswahl auf. Springt nach der Auswahl weiter, außer `stayIf` trifft zu. */
export function ChoiceField<T extends string>({ value, options, onChange, stayIf }: { value: T | ''; options: Option<T>[]; onChange: (v: T | '') => void; stayIf?: (v: T) => boolean }) {
  const { advance } = useFlow();
  return (
    <OptionList
      value={value}
      options={options}
      onChange={(v) => {
        const next = v === value ? '' : v;
        onChange(next);
        if (next && !stayIf?.(next)) advance();
      }}
    />
  );
}

export function YesNoField({ value, onChange, stayIf }: { value: YesNo; onChange: (v: YesNo) => void; stayIf?: (v: 'ja' | 'nein') => boolean }) {
  const { t } = useTranslation();
  return (
    <ChoiceField<'ja' | 'nein'>
      value={value}
      onChange={onChange}
      stayIf={stayIf}
      options={[
        { value: 'ja', label: t('common.yes') },
        { value: 'nein', label: t('common.no') },
      ]}
    />
  );
}

export function CheckField({ label, checked, onChange }: { label: ReactNode; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <Checkbox.Card className="option" checked={checked} withBorder onClick={() => onChange(!checked)}>
      <Group wrap="nowrap" gap="md">
        <Checkbox.Indicator size="md" />
        <Text fw={500}>{label}</Text>
      </Group>
    </Checkbox.Card>
  );
}

const NOTICE = {
  info: { color: 'brand', icon: <IconInfoCircle /> },
  warn: { color: 'orange', icon: <IconAlertTriangle /> },
  ok: { color: 'teal', icon: <IconCircleCheck /> },
} as const;

export function Notice({ kind = 'info', children }: { kind?: 'info' | 'warn' | 'ok'; children: ReactNode }) {
  const n = NOTICE[kind];
  return (
    <Alert variant="light" color={n.color} icon={n.icon} radius="lg" role={kind === 'warn' ? 'alert' : undefined} className="notice">
      {children}
    </Alert>
  );
}

export function ExtLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Anchor href={href} target="_blank" rel="noopener noreferrer" inline>
      {children} <IconExternalLink size={14} style={{ verticalAlign: '-2px' }} />
    </Anchor>
  );
}
