import Table from "cli-table3";

export const renderTable = (head: string[], callback: any): void => {
	const table = new Table({
		head,
		chars: { mid: "", "left-mid": "", "mid-mid": "", "right-mid": "" },
	});

	callback(table);

	// tslint:disable-next-line: no-console
	console.log(table.toString());
};
