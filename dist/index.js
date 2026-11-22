"use strict";
/// <reference path="./online-streaming-provider.d.ts" />
class Provider {
    getSettings() {
        return {
            episodeServers: [],
            supportsDub: false
        };
    }
    async search(opts) {
        const query = opts.query.trim();
        if (!query || opts.media.isAdult) {
            return [];
        }
        const endpoint = "https://kitsu.io/api/edge/anime" +
            `?filter[text]=${encodeURIComponent(query)}` +
            "&page[limit]=20";
        const response = await fetch(endpoint, {
            headers: {
                "Accept": "application/vnd.api+json"
            }
        });
        if (!response.ok) {
            throw new Error(`Kitsu API error: ${response.status}`);
        }
        const data = await response.json();
        return (data.data || [])
            .filter((anime) => anime.attributes?.nsfw !== true)
            .map((anime) => {
            const attributes = anime.attributes || {};
            return {
                id: String(anime.id),
                title: attributes.titles?.en ||
                    attributes.titles?.en_us ||
                    attributes.canonicalTitle ||
                    `Anime ${anime.id}`,
                url: anime.links?.self ||
                    `https://kitsu.io/api/edge/anime/${anime.id}`,
                subOrDub: "both"
            };
        });
    }
    async findEpisodes(id) {
        if (!/^\d+$/.test(id)) {
            return [];
        }
        const episodes = [];
        const limit = 20;
        let offset = 0;
        let total = Infinity;
        while (offset < total && offset < 600) {
            const endpoint = `https://kitsu.io/api/edge/anime/${id}/episodes` +
                `?page[limit]=${limit}&page[offset]=${offset}`;
            const response = await fetch(endpoint, {
                headers: {
                    "Accept": "application/vnd.api+json"
                }
            });
            if (!response.ok) {
                throw new Error(`Kitsu episode API error: ${response.status}`);
            }
            const result = await response.json();
            const records = result.data || [];
            if (typeof result.meta?.count === "number") {
                total = result.meta.count;
            }
            for (const item of records) {
                const attributes = item.attributes || {};
                const number = Number(attributes.number);
                if (!item.id ||
                    !Number.isInteger(number) ||
                    number < 0) {
                    continue;
                }
                episodes.push({
                    id: String(item.id),
                    number,
                    url: item.links?.self ||
                        `https://kitsu.io/api/edge/episodes/${item.id}`,
                    title: attributes.canonicalTitle ||
                        attributes.titles?.en ||
                        undefined
                });
            }
            if (records.length === 0) {
                break;
            }
            offset += records.length;
        }
        return episodes;
    }
    async findEpisodeServer(episode, server) {
        throw new Error("Catalog-only provider: video playback is unavailable.");
    }
}
