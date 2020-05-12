/* eslint-disable camelcase, max-len */
const emoji = require('node-emoji');

const safeGetValue = (reference, value) => reference[value] || {};

module.exports = (event) => {
  const {
    object_kind, object_attributes, user, project, merge_request,
  } = event;

  switch (object_kind) {
    case 'merge_request': {
      const ACTIONS = {
        open: { text: 'открыт', emoji: emoji.get(':white_check_mark:') },
        close: { text: 'закрыт', emoji: emoji.get(':x:') },
        merge: { text: 'ВМЕРЖЕН', emoji: emoji.get(':muscle:') },
        reopen: { text: 'переоткрыт', emoji: emoji.get(':repeat:') },
      };
      return `
      ${safeGetValue(ACTIONS, object_attributes.action).emoji}\nПроект: [${project.name}](${project.web_url})\nМерж-реквест [${object_attributes.title}](${object_attributes.url}) ${safeGetValue(ACTIONS, object_attributes.action).text} пользователем ${user.name}
      `;
    }
    case 'note': {
      if (object_attributes.noteable_type !== 'MergeRequest') return '';
      return `
        ${emoji.get(':imp:')}\nПроект: [${project.name}](${project.web_url})\nПользователь ${user.name} добавил [комментарий](${object_attributes.url}) к реквесту "${merge_request.title}":\n"${object_attributes.note.length > 255 ? `${object_attributes.note.slice(0, 255)}...` : object_attributes.note}"
      `;
    }
    default: return '';
  }
};
