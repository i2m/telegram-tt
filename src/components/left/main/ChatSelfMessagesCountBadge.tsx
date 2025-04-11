import type { FC } from '../../../lib/teact/teact';
import React, { memo, useEffect } from '../../../lib/teact/teact';
import { getActions, withGlobal } from '../../../global';

import { selectChatSelfMessagesCount } from '../../../global/selectors';
import { formatIntegerCompact } from '../../../util/textFormat';

import useLang from '../../../hooks/useLang';

import Badge from '../../ui/Badge';

import styles from './ChatSelfMessagesCountBadge.module.scss';

interface OwnProps {
  chatId: string;
}

interface StateProps {
  messagesCount?: number;
  currentUserId?: string;
}

const ChatSelfMessagesCountBadge: FC<OwnProps & StateProps> = ({ chatId, messagesCount, currentUserId }) => {
  const {
    countMessagesInChat,
  } = getActions();

  const lang = useLang();

  // Load the self messages count to display in the badge
  useEffect(() => {
    if (chatId && currentUserId) {
      countMessagesInChat({ chatId, fromId: currentUserId });
    }
  }, [chatId, currentUserId]);

  return (
    <Badge
      text={messagesCount !== undefined ? formatIntegerCompact(messagesCount) : lang('ChatSelfMessagesCounting')}
      className={styles.badge}
    />
  );
};

export default memo(withGlobal<OwnProps>((global, {
  chatId,
}): StateProps => {
  const messagesCount = selectChatSelfMessagesCount(global, chatId);
  return {
    messagesCount,
    currentUserId: global.currentUserId,
  };
})(ChatSelfMessagesCountBadge));
