import { Accordion, Anchor, Badge, Button, Group, List, Paper, SimpleGrid, Stack, Text, ThemeIcon, Timeline, Title } from '@mantine/core';
import { IconDownload, IconFileText, IconMail, IconMinus, IconPlus } from '@tabler/icons-react';
import type { TFunction } from 'i18next';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckField, Help, Notice, Question, TextField } from '../components/fields';
import { formatDateDe, parseNumber, refundRule, todayIso } from '../data/logic';
import { photoCredits } from '../data/media';
import type { RentCalculation } from '../data/mietspiegel';
import type { FormVersion } from '../data/types';
import { CHAPTER_ICONS, ChapterIntro } from '../flow/chapters';
import type { ChapterId, Screen } from '../flow/types';
import { featureText } from '../i18n';
import { INVERTED } from '../i18n/features/types';
import type { Answers } from '../state/answers';
import { useAnswers } from '../state/AnswersContext';
import { groupStats, rentCalculation } from '../state/derive';

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

function Deadline() {
  const { t } = useTranslation();
  const { a } = useAnswers();
  const rule = a.contractDate ? refundRule(a.contractDate, a.rentStart, todayIso()) : undefined;
  if (rule?.kind === 'fromStart') return <Notice kind="ok">{t('summary.deadlineFromStart', { date: formatDateDe(rule.deadline) })}</Notice>;
  if (rule?.kind === 'fromRuegeLate') return <Notice kind="warn">{t('summary.deadlineLate', { date: formatDateDe(rule.deadline) })}</Notice>;
  if (rule?.kind === 'fromRuegeOld') return <Notice kind="warn">{t('summary.deadlineOld')}</Notice>;
  return null;
}

function Result({ form }: { form: FormVersion }) {
  const { t, i18n } = useTranslation();
  const { a } = useAnswers();
  const stats = groupStats(form, a);
  const unsure = stats.reduce((n, s) => n + s.unsure.length, 0);
  return (
    <ChapterIntro chapter="summary" title={t('summary.title')}>
      <Stack gap="md" w="100%" ta="start">
        <Deadline />
        <Title order={2} size="h4">
          {t('summary.groupsTitle')}
        </Title>
        <Accordion variant="separated" radius="lg" chevronPosition="right" className="result-groups">
          {stats.map((s) => {
            const Icon = CHAPTER_ICONS[s.group.id];
            const items = [...s.minus, ...s.plus];
            return (
              <Accordion.Item key={s.group.id} value={s.group.id}>
                <Accordion.Control disabled={items.length === 0} icon={<ThemeIcon variant="light" radius="md" size="lg"><Icon size={20} /></ThemeIcon>}>
                  <Group justify="space-between" wrap="nowrap" gap="xs">
                    <div>
                      <Text fw={600}>{t(`steps.${s.group.id}`)}</Text>
                      <Text size="sm" c={s.tendency === 'minus' ? 'orange.6' : s.tendency === 'plus' ? 'teal.6' : 'dimmed'}>
                        {s.tendency === 'minus' ? t('summary.tendencyMinus') : s.tendency === 'plus' ? t('summary.tendencyPlus') : t('summary.tendencyNeutral')}
                      </Text>
                    </div>
                    <Group gap={4} wrap="nowrap">
                      <Badge color="orange" variant="light" leftSection={<IconMinus size={12} />}>{s.minus.length}</Badge>
                      <Badge color="teal" variant="light" leftSection={<IconPlus size={12} />}>{s.plus.length}</Badge>
                    </Group>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <List spacing={6} size="sm">
                    {items.map((m) => (
                      <List.Item key={m.id} icon={m.sign === '+' ? <IconPlus size={14} color="var(--mantine-color-teal-7)" /> : <IconMinus size={14} color="var(--mantine-color-orange-7)" />}>
                        {featureText(i18n.language, m.id, m.de).q}
                        {INVERTED.has(m.id) && ` – ${t('common.no')}`}
                      </List.Item>
                    ))}
                  </List>
                </Accordion.Panel>
              </Accordion.Item>
            );
          })}
        </Accordion>
        <Help>{t('summary.tendencyExplain')}</Help>
        {unsure > 0 && <Notice>{t('summary.unsureCount', { count: unsure })}</Notice>}
      </Stack>
    </ChapterIntro>
  );
}

const money = (n: number) => n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

/** Haus-Modus: zulässige Miete wird aus der Mietspiegeltabelle berechnet, soweit sie erfasst ist */
function useRentCalculation(form: FormVersion) {
  const { a, house } = useAnswers();
  return house ? rentCalculation(form, a) : undefined;
}

function RentCalculationNotice({ form, calc }: { form: FormVersion; calc: RentCalculation }) {
  const { t } = useTranslation();
  const { a } = useAnswers();
  const rent = parseNumber(a.rent);
  return (
    <>
      <Notice kind="ok">
        {t('summary.calcResult', {
          year: form.id,
          maxRent: money(calc.maxRent),
          perSqm: money(calc.ovmPerSqm),
          area: calc.area.toLocaleString('de-DE'),
          row: calc.field.row,
        })}
      </Notice>
      {rent !== undefined && rent > calc.maxRent && <Text size="sm">{t('summary.calcExcess', { excess: money(rent - calc.maxRent) })}</Text>}
      {rent !== undefined && rent <= calc.maxRent && <Notice kind="warn">{t('summary.calcNoExcess')}</Notice>}
    </>
  );
}

function LetterOptions({ form }: { form: FormVersion }) {
  const { t } = useTranslation();
  const { a, set, house } = useAnswers();
  const calc = useRentCalculation(form);
  return (
    <Question title={t('summary.lettersTitle')}>
      {calc ? (
        <RentCalculationNotice form={form} calc={calc} />
      ) : (
        <>
          {house && <Notice>{t(a.area ? 'summary.calcUnavailable' : 'summary.calcNeedsArea')}</Notice>}
          <TextField label={`${t('summary.maxRent')} (${t('common.optional')})`} inputMode="decimal" suffix="€" value={a.maxRent} onChange={(v) => set({ maxRent: v })} />
          <Text size="sm" c="dimmed" mt={-8}>
            {t('summary.maxRentHelp')}
          </Text>
        </>
      )}
      <CheckField label={t('summary.demandInfo')} checked={a.demandInfo} onChange={(v) => set({ demandInfo: v })} />
    </Question>
  );
}

/** `missing`: Kapitel mit offenen Pflichtfragen – solange es sie gibt, sind die PDFs gesperrt */
function Downloads({ form, missing }: { form: FormVersion; missing: ChapterId[] }) {
  const { t } = useTranslation();
  const { a } = useAnswers();
  const calc = useRentCalculation(form);
  const [busy, setBusy] = useState<'form' | 'ruege' | null>(null);

  async function make(kind: 'form' | 'ruege') {
    setBusy(kind);
    const today = todayIso();
    try {
      if (kind === 'form') {
        const { buildPruefbogen } = await import('../pdf/pruefbogen');
        download(await buildPruefbogen(form, a, today), `Pruefbogen-169A-Mietspiegel-${form.id}.pdf`);
      } else {
        const { buildRuege } = await import('../pdf/ruege');
        download(await buildRuege(form, a, today, calc), `Ruege-556g-BGB-${today}.pdf`);
      }
    } finally {
      setBusy(null);
    }
  }

  const card = (kind: 'form' | 'ruege', Icon: typeof IconFileText, title: string, text: string) => (
    <Paper withBorder radius="xl" p="lg" className="download-card">
      <Stack gap="sm" align="flex-start" h="100%">
        <ThemeIcon size={48} radius="md" variant="light">
          <Icon size={26} />
        </ThemeIcon>
        <div style={{ flex: 1 }}>
          <Text fw={700} size="lg">
            {title}
          </Text>
          <Text size="sm" c="dimmed">
            {text}
          </Text>
        </div>
        <Button fullWidth size="md" leftSection={<IconDownload size={18} />} loading={busy === kind} disabled={missing.length > 0 || (busy !== null && busy !== kind)} onClick={() => void make(kind)}>
          PDF
        </Button>
      </Stack>
    </Paper>
  );

  return (
    <Question title={t('summary.downloadTitle')} lead={t('summary.downloadLead')}>
      {missing.length > 0 && <Notice kind="warn">{t('summary.missing', { fields: missing.map((c) => t(`steps.${c}`)).join(' · ') })}</Notice>}
      <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="md">
        {card('form', IconFileText, t('summary.downloadForm', { year: form.id }), t('summary.formCardText'))}
        {card('ruege', IconMail, t('summary.downloadRuege'), t('summary.ruegeCardText'))}
      </SimpleGrid>
    </Question>
  );
}

function NextSteps({ form }: { form: FormVersion }) {
  const { t } = useTranslation();
  const credits = photoCredits();
  return (
    <Question title={t('summary.nextTitle')}>
      <Timeline active={-1} bulletSize={28} lineWidth={2}>
        {(['next1', 'next2', 'next3', 'next4'] as const).map((k, i) => (
          <Timeline.Item key={k} bullet={<Text size="xs" fw={700}>{i + 1}</Text>}>
            <Text>{t(`summary.${k}`, { address: form.sendTo.post.join(', '), email: form.sendTo.email ? ` · ${form.sendTo.email}` : '' })}</Text>
          </Timeline.Item>
        ))}
      </Timeline>
      {credits.length > 0 && (
        <Help label={t('credits.open')}>
          <p>{t('credits.intro')}</p>
          <ul>
            {credits.map((c) => (
              <li key={c.src}>
                {c.alt} – {c.author},{' '}
                <Anchor href={c.licenseUrl ?? c.sourceUrl} target="_blank" rel="noopener noreferrer" size="sm">
                  {c.license}
                </Anchor>
                ,{' '}
                <Anchor href={c.sourceUrl} target="_blank" rel="noopener noreferrer" size="sm">
                  Wikimedia Commons
                </Anchor>
              </li>
            ))}
          </ul>
        </Help>
      )}
    </Question>
  );
}

export function summaryScreens(form: FormVersion, _a: Answers, t: TFunction, missing: ChapterId[]): Screen[] {
  return [
    { id: 'summary.result', chapter: 'summary', intro: true, nextLabel: t('common.next'), element: <Result form={form} /> },
    { id: 'summary.letter', chapter: 'summary', answered: true, element: <LetterOptions form={form} /> },
    { id: 'summary.download', chapter: 'summary', answered: true, element: <Downloads form={form} missing={missing} /> },
    { id: 'summary.next', chapter: 'summary', answered: true, element: <NextSteps form={form} /> },
  ];
}
