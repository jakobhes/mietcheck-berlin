import type { TFunction } from 'i18next';
import { TextQ, YesNoQ } from '../flow/generic';
import type { Screen } from '../flow/types';
import type { Answers } from '../state/answers';

export function remarksScreens(a: Answers, t: TFunction): Screen[] {
  return [
    { id: 'remarks.remarks', chapter: 'remarks', answered: !!a.remarks, element: <TextQ k="remarks" multiline pdf title={t('remarks.remarks')} help={t('remarks.remarksHelp')} /> },
    { id: 'remarks.wistg', chapter: 'remarks', answered: !!a.wistg, element: <YesNoQ k="wistg" title={t('remarks.wistg')} help={t('remarks.wistgHelp')} /> },
  ];
}
