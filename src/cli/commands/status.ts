import { ProcessDescription } from "@faustbrian/foreman";
import Table from "cli-table3";
import dayjs from "dayjs";
import prettyBytes from "pretty-bytes";
import prettyMs from "pretty-ms";
import { processManager } from "../process-manager";
import { CommandFlags } from "../types";
import { renderTable } from "../utils";
import { BaseCommand } from "./command";

export class StatusCommand extends BaseCommand {
	public static description = "Show the JSON-RPC status";

	public static examples: string[] = ["$ crypto-json-rpc status"];

	public static flags: CommandFlags = {
		...BaseCommand.flagsNetwork,
	};

	public async run(): Promise<void> {
		const { flags } = this.parse(StatusCommand);

		const processName: string = this.getProcessName(flags.token as string);

		this.abortMissingProcess(processName);

		renderTable(["ID", "Name", "Version", "Status", "Uptime", "CPU", "RAM"], (table: Table.Table) => {
			const app: ProcessDescription | undefined = processManager.describe(processName);

			if (app) {
				// @ts-ignore
				table.push([
					app.pid,
					app.name,
					// @ts-ignore
					app.pm2_env.version,
					app.pm2_env.status,
					// @ts-ignore
					prettyMs(dayjs().diff(app.pm2_env.pm_uptime)),
					`${app.monit.cpu}%`,
					prettyBytes(app.monit.memory),
				]);
			}
		});
	}
}
