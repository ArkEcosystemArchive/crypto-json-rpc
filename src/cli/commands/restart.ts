import cli from "cli-ux";
import { processManager } from "../process-manager";
import { CommandFlags } from "../types";
import { BaseCommand } from "./command";

export class RestartCommand extends BaseCommand {
	public static description = "Restart the JSON-RPC";

	public static examples: string[] = [
		`Restart the JSON-RPC
$ crypto-json-rpc restart
`,
	];

	public static flags: CommandFlags = {
		...BaseCommand.flagsNetwork,
	};

	public async run(): Promise<void> {
		const { flags } = this.parse(RestartCommand);

		const processName: string = this.getProcessName(flags.token as string);

		try {
			this.abortMissingProcess(processName);
			this.abortStoppedProcess(processName);

			cli.action.start(`Restarting ${processName}`);

			processManager.restart(processName);
		} catch (error) {
			error.stderr ? this.error(`${error.message}: ${error.stderr}`) : this.error(error.message);
		} finally {
			cli.action.stop();
		}
	}
}
