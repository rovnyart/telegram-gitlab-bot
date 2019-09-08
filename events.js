/* eslint-disable camelcase, max-len */
const emoji = require('node-emoji');

const safeGetValue = (reference, value) => reference[value] || {};

module.exports = (event) => {
  const {
    object_kind, object_attributes, user, project,
  } = event;

  switch (object_kind) {
    case 'issue': {
      const ACTIONS = {
        open: { text: 'opened', emoji: emoji.get(':white_check_mark:') },
        close: { text: 'closed', emoji: emoji.get(':x:') },
        reopen: { text: 'reopened', emoji: emoji.get(':arrows_counterclockwise:') },
        update: { text: 'updated', emoji: emoji.get(':arrow_heading_up:') },
      };
      return `
      ${safeGetValue(ACTIONS, object_attributes.action).emoji}\nProject: [${project.name}](${project.web_url})\nIssue [${object_attributes.title}](${object_attributes.url}) ${safeGetValue(ACTIONS, object_attributes.action).text} by ${user.name}
      `;
    }
    default: return '';
  }
};
