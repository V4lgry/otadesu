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
        // Authorized catalog integration goes here.
        return [];
    }
    async findEpisodes(id) {
        // Authorized episode catalog integration goes here.
        return [];
    }
    async findEpisodeServer(episode, server) {
        throw new Error("Playback is not configured.");
    }
}
