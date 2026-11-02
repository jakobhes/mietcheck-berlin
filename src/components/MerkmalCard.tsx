import { Anchor, Badge, Collapse, Group, Image, SimpleGrid, Stack, Text, UnstyledButton } from '@mantine/core';
import { IconCheck, IconChevronDown, IconMinus, IconPlus, IconQuestionMark, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MEDIA } from '../data/media';
import type { Merkmal } from '../data/types';
import { useFlow } from '../flow/FlowContext';
import { useLayout } from '../flow/LayoutContext';
import { featureText } from '../i18n';
import type { FeatureAnswer } from '../state/answers';
import { useAnswers } from '../state/AnswersContext';
import { CheckField, ExtLink, OptionList, Question, TextField } from './fields';

const NOISE_MAP = 'https://www.berlin.de/sen/uvk/umwelt/laerm/laermminderungsplanung-berlin/laermkarten/';

/** Ein Merkmal als eigener Bildschirm: Frage, kurze Erläuterung, Beispielbild, Antwort */
export function MerkmalCard({ m, siblings }: { m: Merkmal; siblings: Merkmal[] }) {
  const { t, i18n } = useTranslation();
  const { a, set } = useAnswers();
  const { advance } = useFlow();
  const [showOriginal, setShowOriginal] = useState(false);
  const text = featureText(i18n.language, m.id, m.de);
  const answer = a.features[m.id];
  const media = MEDIA[m.id] ?? [];
  const plus = m.sign === '+';
  const stacked = useLayout() === 'stacked';

  function choose(v: FeatureAnswer) {
    const deselect = a.features[m.id] === v;
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
    // Bei Zusatzfragen auf dem Bildschirm bleiben
    const hasExtra = (v === 'yes' && plus) || ((v === 'yes' || v === 'unsure') && !!m.followUp);
    if (!deselect && !hasExtra) advance();
  }

  const mediaEl = media.length > 0 && (
    <SimpleGrid cols={media.length > 1 && !stacked ? 2 : 1} spacing="sm">
      {media.map((img) => (
        <figure key={img.src} className={`media media-${img.kind}`}>
          <Image src={img.src} alt={img.alt} loading="lazy" radius="md" />
          {img.kind === 'photo' && (
            <Text component="figcaption" size="xs" c="dimmed" mt={4}>
              {t('common.imageCredit')}: {img.author} ·{' '}
              <Anchor href={img.sourceUrl} target="_blank" rel="noopener noreferrer" size="xs">
                {img.license}
              </Anchor>
            </Text>
          )}
        </figure>
      ))}
    </SimpleGrid>
  );

  const answerEl = (
    <>
      <OptionList<FeatureAnswer>
        value={answer ?? ''}
        onChange={choose}
        options={[
          { value: 'yes', label: t('common.applies'), icon: <IconCheck size={20} /> },
          { value: 'no', label: t('common.notApplies'), icon: <IconX size={20} /> },
          { value: 'unsure', label: t('common.unsure'), icon: <IconQuestionMark size={20} /> },
        ]}
      />

      {answer === 'yes' && plus && (
        <CheckField
          label={t('common.selfInstalled')}
          checked={!!a.selfInstalled[m.id]}
          onChange={(v) => set((prev) => ({ selfInstalled: { ...prev.selfInstalled, [m.id]: v } }))}
        />
      )}

      {(answer === 'yes' || answer === 'unsure') && m.followUp && (
        <Stack gap="sm" className="followup">
          {m.followUp === 'laerm' && (
            <>
              {(['strasse', 'schiene', 'flug'] as const).map((k) => (
                <CheckField
                  key={k}
                  label={t(`groups.laerm${k[0].toUpperCase()}${k.slice(1)}`)}
                  checked={a.laermArt[k]}
                  onChange={(v) => set((prev) => ({ laermArt: { ...prev.laermArt, [k]: v } }))}
                />
              ))}
              <ExtLink href={NOISE_MAP}>{t('groups.noiseMapLink')}</ExtLink>
            </>
          )}
          <TextField
            label={t(`followUp.${m.followUp}`)}
            value={a.followUps[m.followUp] ?? ''}
            pdf
            onChange={(v) => set((prev) => ({ followUps: { ...prev.followUps, [m.followUp!]: v } }))}
          />
        </Stack>
      )}
    </>
  );

  return (
    <Question
      eyebrow={
        <Group gap="xs">
          <Badge
            variant="light"
            color={plus ? 'teal' : 'orange'}
            size="lg"
            radius="xl"
            leftSection={plus ? <IconPlus size={14} /> : <IconMinus size={14} />}
          >
            {plus ? t('groups.plusShort') : t('groups.minusShort')}
          </Badge>
        </Group>
      }
      title={text.q}
      lead={text.help || undefined}
      leadSize="md"
    >
      {stacked && mediaEl ? (
        <div className="merkmal-split">
          <Stack gap="md">{answerEl}</Stack>
          {mediaEl}
        </div>
      ) : (
        <>
          {mediaEl}
          {answerEl}
        </>
      )}

      <div>
        <UnstyledButton className="help-toggle subtle" aria-expanded={showOriginal} onClick={() => setShowOriginal(!showOriginal)}>
          <span>{t('common.originalWording')}</span>
          <IconChevronDown size={16} className="chevron" data-open={showOriginal || undefined} />
        </UnstyledButton>
        <Collapse expanded={showOriginal}>
          <Text component="blockquote" lang="de" dir="ltr" className="original" size="sm">
            {m.de}
          </Text>
        </Collapse>
      </div>
    </Question>
  );
}
