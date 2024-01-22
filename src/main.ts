import { Devvit } from '@devvit/public-api';

Devvit.configure({
  redditAPI: true,
  http: true,
})

const dynamicForm = Devvit.createForm((data) => {
  const pill_names: string[] = data.pills.map((pill: Pill) => `- ${pill.name}`);
  return {
    fields: [
      { name: 'username', label: 'USERNAME', type: 'string', defaultValue: data.user_name, disabled: true, },
      { name: 'based_count', label: `BASED COUNT`, type: 'string', defaultValue: data.based_count.toString(), disabled: true },
      { name: 'pills', label: 'PILLS', type: 'paragraph', defaultValue: Array.from(pill_names).join("\n"), disabled: true, lineHeight: 20 },
    ],
    title: `Based Count Profile for u/${data.username}`,
  }
}, async ({ values }, ctx) => { })


interface Pill {
  name: string;
  comment_permalink: string;
  from_user: string;
  date: number;
  amount: number;
}

interface BasedCountAndPillsData {
  user_name: string;
  based_count: number;
  pills: Pill[];
}

async function getBasedCountAndPills(username: string) {
  const limit = 10;
  const url = `https://basedcountdbapi-1-d0307140.deta.app/get_based_count_and_pills/${username}?limit=${limit}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  });

  if (!response.ok) {
    const data: BasedCountAndPillsData = {
      user_name: username,
      based_count: 0,
      pills: [],
    };
    return data
  }

  const data: BasedCountAndPillsData = await response.json();
  return data;
}

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
