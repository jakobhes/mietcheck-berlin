import { Badge, Button, Group, List, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { IconClock, IconFileText, IconFlame, IconLock, IconRuler, IconShieldLock } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Help, Notice } from '../components/fields';
import { ChapterIntro } from '../flow/chapters';

export function StartStep({ onStart, canResume, onResume }: { onStart: () => void; canResume: boolean; onResume: () => void }) {
  const { t } = useTranslation();
  return (
    <Stack gap="xl" className="start">
      <Stack gap="md">
        <Title order={1} className="hero-title">
          {t('start.title')}
        </Title>
        <Text size="xl" className="lead">
          {t('start.lead')}
        </Text>
        <Group gap="xs">
          <Badge variant="light" size="lg" radius="xl" leftSection={<IconFileText size={14} />}>
            {t('start.pillPdf')}
          </Badge>
          <Badge variant="light" size="lg" radius="xl" color="gray" leftSection={<IconClock size={14} />}>
            {t('start.need4')}
          </Badge>
          <Badge variant="light" size="lg" radius="xl" color="teal" leftSection={<IconLock size={14} />}>
            {t('start.pillPrivate')}
          </Badge>
        </Group>
      </Stack>

      <Stack gap="sm">
        <Button size="xl" onClick={canResume ? onResume : onStart}>
          {canResume ? t('start.resumeButton') : t('start.startButton')}
        </Button>
        {canResume && (
          <Button size="lg" variant="subtle" onClick={onStart}>
            {t('start.startButton')}
          </Button>
        )}
      </Stack>

      <Help>
        <p>{t('start.intro')}</p>
        <ol>
          <li>{t('start.out1')}</li>
          <li>{t('start.out2')}</li>
        </ol>
      </Help>

      <Text size="sm" c="dimmed">
        {t('start.disclaimer')}
      </Text>
    </Stack>
  );
}

/** Vorbereitung: was man griffbereit haben sollte */
export function PrepIntro() {
  const { t } = useTranslation();
  const item = (Icon: typeof IconFileText, text: string) => (
    <List.Item
      icon={
        <ThemeIcon size={40} radius="md" variant="light">
          <Icon size={22} />
        </ThemeIcon>
      }
    >
      <Text size="lg">{text}</Text>
    </List.Item>
  );
  return (
    <ChapterIntro chapter="contract" title={t('start.needTitle')}>
      <List spacing="md" center ta="start" mt="sm" className="need-list">
        {item(IconFileText, t('start.need1'))}
        {item(IconFlame, t('start.need2'))}
        {item(IconRuler, t('start.need3'))}
        {item(IconClock, t('start.need4'))}
      </List>
      <Notice kind="ok">
        <Group gap={6} wrap="nowrap" align="flex-start">
          <IconShieldLock size={18} style={{ flex: 'none', marginTop: 2 }} />
          <span>{t('start.privacy')}</span>
        </Group>
      </Notice>
    </ChapterIntro>
  );
}
