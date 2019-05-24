import { ProcessDescription } from "@faustbrian/foreman";
import { flags } from "@oclif/command";
// @ts-ignore
import clear from "clear";
// @ts-ignore
import Tail from "nodejs-tail";
// @ts-ignore
import readLastLines from "read-last-lines";
import { processManager } from "../process-manager";
import { CommandFlags } from "../types";
import { BaseCommand } from "./command";

export class LogCommand extends BaseCommand {
	public static description = "Show the log";

	public static examples: string[] = ["$ crypto-json-rpc log"];

	public static flags: CommandFlags = {
		...BaseCommand.flagsNetwork,
		error: flags.boolean({
			description: "only show error output",
		}),
		lines: flags.integer({
			description: "number of lines to tail",
			default: 15,
		}),
	};

	public async run(): Promise<void> {
		// tslint:disable-next-line: no-shadowed-variable
		const { flags } = this.parse(LogCommand);

		const processName: string = this.getProcessName(flags.token as string);

		this.abortMissingProcess(processName);

		const processInfo: ProcessDescription | undefined = processManager.describe(processName);

		if (processInfo) {
			const file = flags.error ? processInfo.pm2_env.pm_err_log_path : processInfo.pm2_env.pm_out_log_path;

			clear();

			this.log(
				`Tailing last ${flags.lines} lines for [${processName}] process (change the value with --lines option)`,
			);

			this.log((await readLastLines.read(file, flags.lines)).trim());

			const log = new Tail(file);

			log.on("line", this.log);

			log.watch();
		}
	}
}
