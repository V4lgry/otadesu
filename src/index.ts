/// <reference path="./online-streaming-provider.d.ts" />

class Provider {
    getSettings(): Settings {
        return {
            episodeServers: [],
            supportsDub: false
        };
    }

    async search(opts: SearchOptions): Promise<SearchResult[]> {
        const query = opts.query.trim();

        if (!query || opts.media.isAdult) {
            return [];
        }

        const graphql = `
            query ($search: String!) {
                Page(page: 1, perPage: 20) {
                    media(search: $search, type: ANIME, isAdult: false) {
                        id
                        title {
                            romaji
                            english
                        }
                        isAdult
                    }
                }
            }
        `;

        const response = await fetch(
            "https://graphql.anilist.co",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    query: graphql,
                    variables: { search: query }
                })
            }
        );

        if (!response.ok) {
            throw new Error(
                `AniList API error: ${response.status}`
            );
        }

        const data = await response.json();

        return data.data.Page.media
            .filter((anime: any) => !anime.isAdult)
            .map((anime: any) => ({
                id: String(anime.id),
                title: anime.title.english ||
                       anime.title.romaji ||
                       `Anime ${anime.id}`,
                url: `https://anilist.co/anime/${anime.id}`,
                subOrDub: "both" as SubOrDub
            }));
    }

    async findEpisodes(id: string): Promise<EpisodeDetails[]> {
        return [];
    }

    async findEpisodeServer(
        episode: EpisodeDetails,
        server: string
    ): Promise<EpisodeServer> {
        throw new Error(
            "This catalog-only provider does not support playback."
        );
    }
}
