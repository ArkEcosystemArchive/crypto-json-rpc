import pino from "pino";

export const logger = pino({
	name: "crypto-json-rpc",
	safe: true,
	prettyPrint: true,
});
