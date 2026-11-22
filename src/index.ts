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

        // Authorized catalog integration goes here.
        return [];
    }

    async findEpisodes(id: string): Promise<EpisodeDetails[]> {
        // Authorized episode catalog integration goes here.
        return [];
    }

    async findEpisodeServer(
        episode: EpisodeDetails,
        server: string
    ): Promise<EpisodeServer> {
        throw new Error("Playback is not configured.");
    }
}
