import { Managers } from "@arkecosystem/crypto";
import { Request, ResponseToolkit, Server } from "@hapi/hapi";
import * as rpc from "@hapist/json-rpc";
import { methods } from "./methods";
import { logger } from "./services/logger";

export const startServer = async ({ host, port }: { host: string; port: number }): Promise<Server> => {
	const server: Server = new Server({ host, port });

	await server.register({
		// @ts-ignore
		plugin: rpc,
		options: {
			methods,
		},
	});

	server.ext("onPostAuth", (request: Request, h: ResponseToolkit) => {
		// @ts-ignore
		Managers.configManager.setFromPreset(request.payload.params.network);

		return h.continue;
	});

	await server.start();

	logger.info("Server running on %s", server.info.uri);

	return server;
};
