import { flags } from "@oclif/command";
import cli from "cli-ux";
import { processManager } from "../process-manager";
import { CommandFlags } from "../types";
import { BaseCommand } from "./command";

export class StopCommand extends BaseCommand {
	public static description = "Stop the JSON-RPC";

	public static examples: string[] = [
		`Stop the JSON-RPC
$ crypto-json-rpc stop
`,
		`Stop the JSON-RPC daemon
$ crypto-json-rpc stop --daemon
`,
	];

	public static flags: CommandFlags = {
		...BaseCommand.flagsNetwork,
		daemon: flags.boolean({
			description: "stop the process or daemon",
		}),
	};

	public async run(): Promise<void> {
		// tslint:disable-next-line: no-shadowed-variable
		const { flags } = this.parse(StopCommand);

		const processName: string = this.getProcessName(flags.token as string);

		try {
			this.abortMissingProcess(processName);
			this.abortUnknownProcess(processName);
			this.abortStoppedProcess(processName);

			cli.action.start(`Stopping ${processName}`);

			processManager[flags.daemon ? "delete" : "stop"](processName);
		} catch (error) {
			this.error(error.message);
		} finally {
			cli.action.stop();
		}
	}
}
