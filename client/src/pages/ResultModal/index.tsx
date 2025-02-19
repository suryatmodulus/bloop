import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CloseSign } from '../../icons';
import Button from '../../components/Button';
import CodeFull from '../../components/CodeBlock/CodeFull';
import { FullResult } from '../../types/results';
import { FullResultModeEnum } from '../../types/general';
import ModalOrSidebar from '../../components/ModalOrSidebar';
import ShareFileModal from '../../components/ShareFileModal';
import { splitPathForBreadcrumbs } from '../../utils';
import ModeToggle from './ModeToggle';
import Subheader from './Subheader';

type Props = {
  result: FullResult | null;
  onResultClosed: () => void;
  mode: FullResultModeEnum;
  setMode: (n: FullResultModeEnum) => void;
};

const ResultModal = ({ result, onResultClosed, mode, setMode }: Props) => {
  const { t } = useTranslation();
  const [isShareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    const action =
      !!result && mode === FullResultModeEnum.MODAL ? 'add' : 'remove';
    document.body.classList[action]('overflow-hidden');
  }, [result, mode]);

  // By tracking if animation is between sidebar and modal, rather than entry and exit, we can vary the transition
  const [isModalSidebarTransition, setIsModalSidebarTransition] =
    useState(false);
  const setModeAndTransition = (newMode: FullResultModeEnum) => {
    setIsModalSidebarTransition(true);
    setMode(newMode);
  };

  const breadcrumbs = useMemo(
    () => (result ? splitPathForBreadcrumbs(result.relativePath) : []),
    [result?.relativePath],
  );

  const metadata = useMemo(
    () => ({
      lexicalBlocks: [],
      hoverableRanges: result?.hoverableRanges || [],
    }),
    [result?.hoverableRanges],
  );

  return (
    <>
      <ModalOrSidebar
        isModalSidebarTransition={isModalSidebarTransition}
        setIsModalSidebarTransition={setIsModalSidebarTransition}
        isSidebar={mode === FullResultModeEnum.SIDEBAR}
        shouldShow={!!result}
        onClose={onResultClosed}
        containerClassName="w-[60vw]"
        filtersOverlay={mode === FullResultModeEnum.SIDEBAR}
      >
        <div className="flex justify-between items-center p-3 bg-bg-base border-b border-bg-border shadow-low select-none">
          {!!result && (
            <ModeToggle
              repoName={result.repoName}
              relativePath={result.relativePath}
              mode={mode}
              setModeAndTransition={setModeAndTransition}
            />
          )}
          <div className="flex gap-2">
            <Button
              onlyIcon
              variant="tertiary"
              onClick={onResultClosed}
              title={t('Close')}
            >
              <CloseSign />
            </Button>
          </div>
        </div>
        <div className="w-full flex flex-col overflow-y-auto">
          {!!result && (
            <Subheader
              relativePath={result.relativePath}
              repoName={result.repoName}
              repoPath={result.repoPath}
              onResultClosed={onResultClosed}
            />
          )}
          <div
            className={`flex px-2 py-4 bg-bg-sub h-[calc(100vh-17rem)] overflow-y-auto code-modal-container`}
          >
            {!!result && (
              <CodeFull
                code={result.code}
                language={result.language}
                relativePath={result.relativePath}
                repoPath={result.repoPath}
                repoName={result.repoName}
                metadata={metadata}
                scrollElement={null}
                containerWidth={window.innerWidth * 0.6 - 56}
                containerHeight={window.innerHeight - 15 * 16 - 114}
                closePopup={onResultClosed}
              />
            )}
          </div>
        </div>
      </ModalOrSidebar>
      <ShareFileModal
        isOpen={isShareOpen}
        onClose={() => setShareOpen(false)}
        result={result}
        breadcrumbs={breadcrumbs}
        filePath={result?.relativePath || ''}
      />
    </>
  );
};

export default ResultModal;
