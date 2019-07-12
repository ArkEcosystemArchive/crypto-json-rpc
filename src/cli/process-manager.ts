import { Foreman, ProcessIdentifier } from "@faustbrian/foreman";
import { ExecaSyncReturnValue } from "execa";

class ProcessManager extends Foreman {
	public restart(id: ProcessIdentifier): ExecaSyncReturnValue {
		return super.restart(id, { "update-env": true });
	}

	public list(): Record<string, any>[] {
		return super.list() || [];
	}
}

export const processManager = new ProcessManager();
