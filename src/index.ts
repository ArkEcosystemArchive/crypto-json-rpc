import meow from "meow";
import { startServer } from "./server";

// tslint:disable-next-line: no-floating-promises
startServer(
	// @ts-ignore
	meow(
		`
	Usage
	  $ yarn start <input>

	Options
	  --host, -h  Set the host
	  --port, -p  Set the port
`,
		{
			flags: {
				host: {
					type: "string",
					alias: "h",
					default: "localhost",
				},
				port: {
					type: "string",
					alias: "p",
					default: 3000,
				},
			},
		},
	).flags,
);
