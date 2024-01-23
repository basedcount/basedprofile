export interface BasedProfile {
    basedCount: number
    claimed: boolean
    compass: any[]
    currentFlair: string
    deletedCount: number
    flairCount: number
    flairs: Flair[]
    name: string
    ok: boolean
    pillCount: number
    pills: Pill[]
    pinnedPills: PinnedPill[]
    rank: string
    sapply: string[]
    wantedScore: number
}

interface Flair {
    flair: string
    dateAdded: string
    img: string
}

interface Pill {
    name: string
    commentID: string
    fromUser: string
    date: number
}

interface PinnedPill {
    name: string
    commentID: string
    fromUser: string
    date: number
}

function createDefaultStructure(): BasedProfile {
    return {
        basedCount: 0,
        claimed: false,
        compass: [],
        currentFlair: '',
        deletedCount: 0,
        flairCount: 0,
        flairs: [],
        name: '',
        ok: false,
        pillCount: 0,
        pills: [],
        pinnedPills: [],
        rank: '',
        sapply: [],
        wantedScore: 0,
    };
}

export function getFormattedPills(limit: number, based_profile: BasedProfile): string {
    const filtered_pills = based_profile.pills
        .filter((pill: Pill) => pill.name.length <= 40)
        .slice(-limit)
        .reverse();
    const pill_names: string[] = filtered_pills.map((pill: Pill) => `- ${pill.name}`);
    return pill_names.join("\n");
}

export async function getBasedCountAndPills(username: string): Promise<BasedProfile> {
    const url = `https://basedcount.com/api/user/${username}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
        },
    });

    if (!response.ok) {
        return createDefaultStructure();
    }

    const data: BasedProfile = await response.json();
    return data;
}
