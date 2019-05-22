import { Managers } from "@arkecosystem/crypto";
import { Request, ResponseToolkit, Server } from "@hapi/hapi";
import * as rpc from "@hapist/json-rpc";
import Ajv from "ajv";
import { methods } from "./methods";
import { logger } from "./services/logger";

export const startServer = async ({ host, port }: { host: string; port: number }): Promise<Server> => {
	const server: Server = new Server({ host, port });

	await server.register({
		// @ts-ignore
		plugin: rpc,
		options: {
			methods,
			processor: {
				schema: {
					properties: {
						id: {
							type: ["number", "string"],
						},
						jsonrpc: {
							pattern: "2.0",
							type: "string",
						},
						method: {
							type: "string",
						},
						params: {
							type: "object",
						},
					},
					required: ["jsonrpc", "method", "id"],
					type: "object",
				},
				validate(data: object, schema: object) {
					try {
						const ajv = new Ajv({
							$data: true,
							extendRefs: true,
							removeAdditional: true,
						});

						ajv.validate(schema, data);

						return { value: data, error: ajv.errors !== null ? ajv.errorsText() : undefined };
					} catch (error) {
						return { value: undefined, error: error.stack };
					}
				},
			},
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
