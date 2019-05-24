import { startServer } from "../../server";
import { CommandFlags } from "../types";
import { BaseCommand } from "./command";

export class RunCommand extends BaseCommand {
	public static description = "Run the JSON-RPC (without pm2)";

	public static examples: string[] = [
		`Run the JSON-RPC
$ crypto-json-rpc run
`,
	];

	public static flags: CommandFlags = {
		...BaseCommand.flagsNetwork,
	};

	public async run(): Promise<void> {
		const { flags } = this.parse(RunCommand);

		await startServer({ host: flags.host as string, port: flags.port as number });
	}
}
