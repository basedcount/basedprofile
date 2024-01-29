import { Devvit } from '@devvit/public-api';
import { BasedProfile, getBasedCountAndPills, getFormattedPills } from './databased_queries.js';

Devvit.configure({
  redditAPI: true,
  http: true,
})

const dynamicForm = Devvit.createForm((data) => {
  return {
    fields: [
      { name: 'username', label: 'USERNAME', type: 'string', defaultValue: data.name, disabled: true, },
      { name: 'based_count', label: `BASED COUNT`, type: 'string', defaultValue: `${data.basedCount}`, disabled: true },
      { name: 'rank', label: `RANK`, type: 'string', defaultValue: data.rank, disabled: true },
      { name: 'pill_count', label: `TOTAL PILL COUNT`, type: 'string', defaultValue: `${data.pillCount}`, disabled: true },
      {
        name: 'pills', label: 'PILLS', type: 'paragraph', defaultValue: getFormattedPills(10, data as BasedProfile), disabled: true, lineHeight: 10,
        helpText: "LATEST 10 PILLS (EXCLUDING VERY LONG PILLS). TO SEE MORE VISIT USER'S PROFILE ON https://basedcount.com",
        placeholder: "No pills available for display",
      },
    ],
    title: `Based Count Profile for ${data.name}`,
    acceptLabel: `View all pills`,
  }
}, async ({ values }, ctx) => {
  return ctx.ui.navigateTo(`https://basedcount.com/u/${values.username}`)
})

Devvit.addMenuItem({
  label: 'Based Profile',
  location: ['post', 'comment'],
  description: "View Based Count and Pills",
  onPress: async (_event, context) => {
    let post;
    if (_event.targetId.startsWith('t1_')) {
      post = context.reddit.getCommentById(_event.targetId);
    } else {
      post = context.reddit.getPostById(_event.targetId);
    }

    const formData = await getBasedCountAndPills((await post).authorName)
    return context.ui.showForm(dynamicForm, formData)
  }
});

Devvit.addMenuItem({
  label: 'Visit User Based Count Profile',
  location: ['post', 'comment'],
  description: "Visit User Based Count Profile on https://basedcount.com",
  onPress: async (_event, context) => {
    let post;
    if (_event.targetId.startsWith('t1_')) {
      post = context.reddit.getCommentById(_event.targetId);
    } else {
      post = context.reddit.getPostById(_event.targetId);
    }

    let authorName = (await post).authorName;
    return context.ui.navigateTo(`https://basedcount.com/u/${authorName}`)
  }
});

export default Devvit;
