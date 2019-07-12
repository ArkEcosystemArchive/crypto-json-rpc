import { IConfig } from "@oclif/config";
import cli from "cli-ux";
import { ExecaSyncReturnValue, sync } from "execa";
import { closeSync, openSync, statSync } from "fs";
import { ensureDirSync } from "fs-extra";
import latestVersion from "latest-version";
import { join } from "path";
import semver from "semver";

const getLatestVersion = async (name: string): Promise<string | undefined> => {
	try {
		const version: string = await latestVersion(name);

		return version;
	} catch (error) {
		return undefined;
	}
};

const ensureCacheFile = (config: IConfig): string => {
	ensureDirSync(config.cacheDir);

	const fileName = join(config.cacheDir, "update");

	closeSync(openSync(fileName, "w"));

	return fileName;
};

export const installFromChannel = async (pkg: string, tag: string) => {
	const { stdout, stderr } = await sync(`yarn global add ${pkg}@${tag}`, { shell: true });

	if (stderr) {
		// tslint:disable-next-line: no-console
		console.error(stderr);
	}

	// tslint:disable-next-line: no-console
	console.log(stdout);
};

export const needsRefresh = (config: IConfig): boolean => {
	const cacheFile: string = ensureCacheFile(config);

	try {
		const { mtime } = statSync(cacheFile);
		const staleAt: Date = new Date(mtime.valueOf() + 1000 * 60 * 60 * 24 * 1);

		return staleAt < new Date();
	} catch (err) {
		return true;
	}
};

// @ts-ignore
export const checkForUpdates = async ({ config, error, warn }): Promise<any> => {
	const state = {
		ready: false,
		name: config.name,
		currentVersion: config.version,
	};

	try {
		const cacheFile: string = ensureCacheFile(config);

		cli.action.start("Checking for updates");
		// tslint:disable-next-line: no-shadowed-variable
		const latestVersion = await getLatestVersion(state.name);
		cli.action.stop();

		if (latestVersion === undefined) {
			error("We were unable to find any releases.");

			return state;
		}

		if (semver.gt(latestVersion, config.version)) {
			return {
				...state,
				...{
					ready: true,
					updateVersion: latestVersion,
					cache: cacheFile,
				},
			};
		}
	} catch (err) {
		error(err.message);
	} finally {
		cli.action.stop();
	}

	return state;
};
