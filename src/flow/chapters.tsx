import { Badge, Group, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import {
  IconAlertTriangle,
  IconBath,
  IconBolt,
  IconBuilding,
  IconBuildingSkyscraper,
  IconFileCheck,
  IconFileText,
  IconHome,
  IconMessage,
  IconSofa,
  IconSparkles,
  IconToolsKitchen2,
  IconTrees,
  IconUser,
  type Icon,
} from '@tabler/icons-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useLayout } from './LayoutContext';
import type { ChapterId } from './types';

export const CHAPTER_ICONS: Record<ChapterId, Icon> = {
  house: IconBuildingSkyscraper,
  contract: IconFileText,
  exceptions: IconAlertTriangle,
  flat: IconHome,
  energy: IconBolt,
  sonder: IconSparkles,
  bad: IconBath,
  kueche: IconToolsKitchen2,
  wohnung: IconSofa,
  gebaeude: IconBuilding,
  umfeld: IconTrees,
  remarks: IconMessage,
  persons: IconUser,
  summary: IconFileCheck,
};

/** Einstieg in ein Kapitel: ein klares Teilziel statt einer langen Liste */
export function ChapterIntro({ chapter, title, lead, questions, children }: { chapter: ChapterId; title?: ReactNode; lead?: ReactNode; questions?: number; children?: ReactNode }) {
  const { t } = useTranslation();
  const Icon = CHAPTER_ICONS[chapter];
  // Desktop: kompakter Kopf über den Fragekarten statt eigener Seite
  if (useLayout() === 'stacked') {
    return (
      <Stack gap="lg" className="chapter-head">
        <Group gap="lg" wrap="nowrap" align="center">
          <ThemeIcon size={64} radius={20} variant="gradient" gradient={{ from: 'brand.4', to: 'violet.6', deg: 135 }} className="chapter-icon">
            <Icon size={32} stroke={1.6} />
          </ThemeIcon>
          <Stack gap={4}>
            <Title order={1} className="question-title">
              {title ?? t(`steps.${chapter}`)}
            </Title>
            {lead && (
              <Text className="lead" size="lg">
                {lead}
              </Text>
            )}
          </Stack>
        </Group>
        {children}
      </Stack>
    );
  }
  return (
    <Stack align="center" ta="center" gap="md" className="chapter-intro">
      <ThemeIcon size={88} radius={28} variant="gradient" gradient={{ from: 'brand.4', to: 'violet.6', deg: 135 }} className="chapter-icon">
        <Icon size={44} stroke={1.6} />
      </ThemeIcon>
      {questions !== undefined && (
        <Badge variant="light" size="lg" radius="xl">
          {t('common.questionsCount', { count: questions })}
        </Badge>
      )}
      <Title order={1} className="question-title">
        {title ?? t(`steps.${chapter}`)}
      </Title>
      {lead && (
        <Text className="lead" size="lg" maw={520}>
          {lead}
        </Text>
      )}
      {children}
    </Stack>
  );
}
