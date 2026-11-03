import {
  ActionIcon,
  Anchor,
  Badge,
  Button,
  Divider,
  Drawer,
  Group,
  Menu,
  Modal,
  NavLink,
  Stack,
  Text,
  ThemeIcon,
  useComputedColorScheme,
  useDirection,
  useMantineColorScheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconArrowLeft, IconArrowRight, IconBrandGithub, IconBuildingSkyscraper, IconCheck, IconHome, IconLanguage, IconListDetails, IconMoon, IconRefresh, IconSun } from '@tabler/icons-react';
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { selectFormVersion } from './data/forms';
import { CHAPTER_ICONS } from './flow/chapters';
import { FlowContext } from './flow/FlowContext';
import { LayoutContext } from './flow/LayoutContext';
import { paginate, type Page } from './flow/pages';
import { buildScreens } from './flow/screens';
import type { ChapterId, Screen } from './flow/types';
import { LANGUAGES } from './i18n';
import { useAnswers } from './state/AnswersContext';
import { StartStep } from './steps/StartStep';

const STEP_KEY = 'mietcheck-berlin:step';
const DESKTOP_QUERY = '(min-width: 62em)';

/** Handy: jede Seite enthält genau einen Bildschirm */
function singlePages(screens: Screen[]): Page[] {
  return screens.map((s) => ({ chapter: s.chapter, intro: s.intro ? s : undefined, questions: s.intro ? [] : [s], all: [s] }));
}

/** Desktop: nach einer Antwort sanft zur nächsten Fragekarte scrollen statt umzublättern */
function CardFlow({ id, nextId, children }: { id: string; nextId?: string; children: ReactNode }) {
  const value = useMemo(
    () => ({
      advance: () => {
        if (!nextId) return;
        window.setTimeout(() => {
          const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          document.querySelector(`[data-screen="${CSS.escape(nextId)}"]`)?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'nearest' });
        }, 150);
      },
    }),
    [nextId],
  );
  return (
    <FlowContext.Provider value={value}>
      <section data-screen={id} className="card-slot">
        {children}
      </section>
    </FlowContext.Provider>
  );
}

interface ChapterInfo {
  id: ChapterId;
  first: number;
  last: number;
  /** Fragen ohne Kapitel-Einstieg */
  questions: Screen[];
}

function chaptersOf(screens: Screen[]): ChapterInfo[] {
  const out: ChapterInfo[] = [];
  screens.forEach((s, i) => {
    let c = out[out.length - 1];
    if (!c || c.id !== s.chapter) out.push((c = { id: s.chapter, first: i, last: i, questions: [] }));
    c.last = i;
    if (!s.intro) c.questions.push(s);
  });
  return out;
}

export default function App() {
  const { t, i18n } = useTranslation();
  const { a, reset, house, setHouse } = useAnswers();
  const { setDirection } = useDirection();
  const { setColorScheme } = useMantineColorScheme();
  const scheme = useComputedColorScheme('light');
  const desktop = useMediaQuery(DESKTOP_QUERY, window.matchMedia(DESKTOP_QUERY).matches, { getInitialValueInEffect: false });
  const screens = buildScreens(a, t, house);
  const chapters = chaptersOf(screens);
  const pages = desktop ? paginate(screens) : singlePages(screens);
  const form = selectFormVersion(a.contractDate);
  const [currentId, setCurrentId] = useState('start');
  const [savedId, setSavedId] = useState(() => localStorage.getItem(STEP_KEY));
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const lastIndex = useRef(0);

  // Fällt der aktuelle Bildschirm weg (z. B. andere Antwort), bleibt man an derselben Position
  let index = currentId === 'start' ? -1 : screens.findIndex((s) => s.id === currentId);
  if (currentId !== 'start' && index < 0) index = Math.min(lastIndex.current, screens.length - 1);
  const screen = index >= 0 ? screens[index] : undefined;
  const pageIndex = screen ? pages.findIndex((p) => p.all.includes(screen)) : -1;
  const page = pageIndex >= 0 ? pages[pageIndex] : undefined;
  const chapter = screen && chapters.find((c) => c.id === screen.chapter)!;
  // Fortschritt bis zum letzten Bildschirm der aktuellen Seite
  const pos = page ? screens.indexOf(page.all[page.all.length - 1]) : -1;
  const firstBlocked = screens.findIndex((s) => s.blocked);
  const reachable = (i: number) => firstBlocked < 0 || i <= firstBlocked;
  const rtl = i18n.dir() === 'rtl';

  useEffect(() => setDirection(i18n.dir()), [i18n, i18n.language, setDirection]);

  useEffect(() => {
    if (index >= 0) {
      lastIndex.current = index;
      localStorage.setItem(STEP_KEY, screens[index].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    mainRef.current?.focus({ preventScroll: true });
  }, [currentId]);

  function go(i: number) {
    setCurrentId(i < 0 ? 'start' : screens[Math.min(i, screens.length - 1)].id);
  }

  function goPage(pi: number) {
    if (pi < 0) go(-1);
    else go(screens.indexOf(pages[pi].all[0]));
  }

  const canNext = !!page && !page.all.some((s) => s.blocked) && pageIndex < pages.length - 1;
  const next = () => canNext && goPage(pageIndex + 1);


  function resume() {
    const exact = screens.findIndex((s) => s.id === savedId);
    // ältere Versionen haben ganze Schritte gespeichert, z. B. „flat“
    const byChapter = screens.findIndex((s) => s.chapter === savedId);
    const target = exact >= 0 ? exact : Math.max(byChapter, 0);
    // nicht hinter eine offene Pflichtfrage springen
    go(firstBlocked >= 0 ? Math.min(target, firstBlocked) : target);
  }

  function restart() {
    reset();
    localStorage.removeItem(STEP_KEY);
    setSavedId(null);
    setConfirmOpen(false);
    setMenuOpen(false);
    go(-1);
  }

  function onKeyDown(e: KeyboardEvent) {
    const el = e.target as HTMLElement;
    if (!desktop && e.key === 'Enter' && el instanceof HTMLInputElement && !['checkbox', 'radio'].includes(el.type)) {
      e.preventDefault();
      next();
    }
  }

  const chapterQuestion = !desktop && chapter && screen && !screen.intro && chapter.id !== 'summary' ? chapter.questions.indexOf(screen) + 1 : 0;
  const chapterPages = page ? pages.filter((p) => p.chapter === page.chapter) : [];
  const first = page?.all[0];
  const nextLabel = desktop ? (first?.nextLabel ?? t('common.next')) : (first?.nextLabel ?? (first?.intro ? t('common.continue') : first?.answered || first?.required ? t('common.next') : t('common.skip')));
  const nextFilled = desktop || !!first?.intro || !!first?.answered || !!first?.required;
  const pageBlocked = !!page?.all.some((s) => s.blocked);
  const BackIcon = rtl ? IconArrowRight : IconArrowLeft;
  const NextIcon = rtl ? IconArrowLeft : IconArrowRight;

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <button type="button" className="brand" onClick={() => go(-1)}>
            <ThemeIcon size={36} radius="md" variant="gradient" gradient={{ from: 'brand.4', to: 'violet.6', deg: 135 }}>
              <IconHome size={20} />
            </ThemeIcon>
            <span className="brand-name">{t('app.name')}</span>
            {house && (
              <Badge variant="light" color="violet" radius="xl" visibleFrom="sm">
                {house.name}
              </Badge>
            )}
          </button>
          <Group gap={6}>
            <Menu position="bottom-end" radius="md" shadow="md">
              <Menu.Target>
                <Button variant="subtle" color="gray" size="compact-md" leftSection={<IconLanguage size={18} />} aria-label={t('common.language')}>
                  {i18n.language.toUpperCase()}
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                {LANGUAGES.map((l) => (
                  <Menu.Item key={l.code} lang={l.code} onClick={() => void i18n.changeLanguage(l.code)} rightSection={i18n.language === l.code ? <IconCheck size={16} /> : null}>
                    {l.label}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              aria-label={scheme === 'dark' ? t('common.lightMode') : t('common.darkMode')}
              title={scheme === 'dark' ? t('common.lightMode') : t('common.darkMode')}
              onClick={() => setColorScheme(scheme === 'dark' ? 'light' : 'dark')}
            >
              {scheme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
            </ActionIcon>
            {screen && (
              <ActionIcon variant="subtle" color="gray" size="lg" aria-label={t('common.overview')} onClick={() => setMenuOpen(true)}>
                <IconListDetails size={20} />
              </ActionIcon>
            )}
          </Group>
        </div>

        {screen && chapter && (
          <nav className="progress" aria-label={t('common.progress')}>
            <div className="segments">
              {chapters.map((c) => {
                const total = c.last - c.first + 1;
                const done = pos > c.last ? 1 : pos < c.first ? 0 : (pos - c.first + 1) / total;
                return (
                  <div key={c.id} className="segment" style={{ flexGrow: Math.max(total, 2) }} title={t(`steps.${c.id}`)}>
                    <div style={{ width: `${done * 100}%` }} />
                  </div>
                );
              })}
            </div>
            <div className="progress-label">
              <Text size="sm" fw={600}>
                {t(`steps.${chapter.id}`)}
              </Text>
              {chapterQuestion > 0 && (
                <Text size="sm" c="dimmed">
                  {t('common.questionOf', { n: chapterQuestion, total: chapter.questions.length })}
                </Text>
              )}
              {desktop && chapterPages.length > 1 && (
                <Text size="sm" c="dimmed">
                  {t('common.pageOf', { n: chapterPages.indexOf(page!) + 1, total: chapterPages.length })}
                </Text>
              )}
            </div>
          </nav>
        )}
      </header>

      <main ref={mainRef} tabIndex={-1} onKeyDown={onKeyDown}>
        {page && desktop ? (
          <LayoutContext.Provider value="stacked">
            <div key={page.all[0].id} className="screen page">
              {page.intro?.element}
              {page.questions.map((s, k) => (
                <CardFlow key={s.id} id={s.id} nextId={page.questions[k + 1]?.id}>
                  {s.element}
                </CardFlow>
              ))}
            </div>
          </LayoutContext.Provider>
        ) : (
          <div key={screen?.id ?? 'start'} className="screen">
            {screen ? screen.element : <StartStep canResume={!!savedId && !!a.contractDate} onStart={() => go(0)} onResume={resume} />}
          </div>
        )}
      </main>

      {screen && (
        <div className="bottom-nav">
          {pageBlocked && pageIndex < pages.length - 1 && (
            <Text size="sm" c="dimmed" ta="center" mb="xs">
              {t(desktop ? 'common.requiredPage' : 'common.required')}
            </Text>
          )}
          <div className="bottom-nav-inner">
            <Button variant="default" size="lg" leftSection={<BackIcon size={18} />} onClick={() => goPage(pageIndex - 1)}>
              {t('common.back')}
            </Button>
            {pageIndex < pages.length - 1 && (
              <Button size="lg" rightSection={<NextIcon size={18} />} disabled={!canNext} variant={nextFilled ? 'filled' : 'light'} onClick={next}>
                {nextLabel}
              </Button>
            )}
          </div>
        </div>
      )}

      <Drawer
        opened={menuOpen}
        onClose={() => setMenuOpen(false)}
        position={rtl ? 'left' : 'right'}
        radius="lg"
        offset={8}
        size="sm"
        title={
          <Group gap="xs">
            <Text fw={700}>{t('common.overview')}</Text>
            {form && (
              <Badge variant="light" radius="xl">
                Mietspiegel {form.id}
              </Badge>
            )}
          </Group>
        }
      >
        <Stack gap={4}>
          {chapters.map((c) => {
            const Icon = CHAPTER_ICONS[c.id];
            const answered = c.questions.filter((q) => q.answered).length;
            const isDone = pos > c.last;
            return (
              <NavLink
                key={c.id}
                label={t(`steps.${c.id}`)}
                description={c.questions.length > 0 && c.id !== 'summary' ? `${answered} / ${c.questions.length}` : undefined}
                active={chapter?.id === c.id}
                disabled={!reachable(c.first)}
                leftSection={
                  <ThemeIcon variant={isDone ? 'filled' : 'light'} color={isDone ? 'teal' : 'brand'} radius="md" size="md">
                    {isDone ? <IconCheck size={16} /> : <Icon size={16} />}
                  </ThemeIcon>
                }
                onClick={() => {
                  go(c.first);
                  setMenuOpen(false);
                }}
                style={{ borderRadius: 'var(--mantine-radius-md)' }}
              />
            );
          })}
          <Divider my="md" />
          {house && (
            <Button
              variant="subtle"
              color="gray"
              leftSection={<IconBuildingSkyscraper size={18} />}
              justify="flex-start"
              onClick={() => {
                setHouse(undefined);
                setMenuOpen(false);
              }}
            >
              {t('house.leave', { name: house.name })}
            </Button>
          )}
          <Button variant="subtle" color="red" leftSection={<IconRefresh size={18} />} justify="flex-start" onClick={() => setConfirmOpen(true)}>
            {t('common.restart')}
          </Button>
          <Text size="xs" c="dimmed" mt="md">
            {t('start.disclaimer')}
          </Text>
          <Anchor href="https://github.com/jakobhes/mietcheck-berlin" target="_blank" rel="noopener noreferrer" size="xs" c="dimmed" mt="xs">
            <Group gap={4}>
              <IconBrandGithub size={14} /> GitHub · MIT License
            </Group>
          </Anchor>
        </Stack>
      </Drawer>

      <Modal opened={confirmOpen} onClose={() => setConfirmOpen(false)} title={t('common.restart')} centered radius="lg">
        <Text mb="lg">{t('common.restartConfirm')}</Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={() => setConfirmOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button color="red" onClick={restart}>
            {t('common.restart')}
          </Button>
        </Group>
      </Modal>
    </div>
  );
}
