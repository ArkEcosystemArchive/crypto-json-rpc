import "jest-extended";

import { Interfaces, Managers, Transactions, Types } from "@arkecosystem/crypto";
import { Server } from "@hapi/hapi";
import got from "got";
import { startServer } from "../src/server";
import * as identities from "./identities.json";

let server: Server;

beforeAll(async () => (server = await startServer({ host: "localhost", port: 3000 })));
afterAll(async () => server.stop());

const expectResponse = async ({
	method,
	params,
}: {
	method: string;
	params: Record<string, any>;
}): Promise<Record<string, any>> => {
	const { body } = await got.post("http://localhost:3000/", {
		body: JSON.stringify({ jsonrpc: "2.0", id: Math.random(), method, params }),
	});

	return JSON.parse(body).result;
};

describe.each(["mainnet", "devnet", "testnet"])("%s", network => {
	// @ts-ignore
	const { address, passphrase, privateKey, publicKey, wif, multiSignature } = identities[network];

	test("transactions.sign", async () => {
		Managers.configManager.setFromPreset(network as Types.NetworkName);

		const transaction: Interfaces.ITransactionData = Transactions.BuilderFactory.transfer()
			.recipientId(address)
			.amount("1").data;

		transaction.senderPublicKey = publicKey;

		const response = await expectResponse({
			method: "transactions.sign",
			params: {
				transaction,
				passphrase,
				network,
			},
		});

		expect(response.transaction).toBeString();
	});

	test("transactions.secondSign", async () => {
		Managers.configManager.setFromPreset(network as Types.NetworkName);

		const transaction: Interfaces.ITransactionData = Transactions.BuilderFactory.transfer()
			.recipientId(address)
			.amount("1").data;

		transaction.senderPublicKey = publicKey;

		const response = await expectResponse({
			method: "transactions.secondSign",
			params: {
				transaction,
				passphrase,
				network,
			},
		});

		expect(response.transaction).toBeString();
	});

	test("transactions.multiSign", async () => {
		Managers.configManager.setFromPreset(network as Types.NetworkName);

		const transaction: Interfaces.ITransactionData = Transactions.BuilderFactory.transfer()
			.recipientId(address)
			.amount("1").data;

		transaction.senderPublicKey = publicKey;

		const response = await expectResponse({
			method: "transactions.multiSign",
			params: {
				transaction,
				passphrase,
				network,
			},
		});

		expect(response.transaction).toBeString();
	});

	test("transactions.serialize", async () => {
		Managers.configManager.setFromPreset(network as Types.NetworkName);

		const response = await expectResponse({
			method: "transactions.serialize",
			params: {
				transaction: Transactions.TransactionFactory.fromData(
					Transactions.BuilderFactory.transfer()
						.recipientId(address)
						.amount("1")
						.sign(passphrase)
						.getStruct(),
				).toJson(),
				network,
			},
		});

		expect(response.transaction).toBeString();
	});

	test("transactions.deserialize", async () => {
		Managers.configManager.setFromPreset(network as Types.NetworkName);

		const response = await expectResponse({
			method: "transactions.deserialize",
			params: {
				transaction: Buffer.from(
					Transactions.Serializer.serialize(
						Transactions.TransactionFactory.fromData(
							Transactions.BuilderFactory.transfer()
								.recipientId(address)
								.amount("1")
								.sign(passphrase)
								.getStruct(),
						),
					),
				).toString("hex"),
				network,
			},
		});

		expect(response.transaction).toBeObject();
	});

	test("transactions.verify", async () => {
		const response = await expectResponse({
			method: "transactions.verify",
			params: {
				transaction: Transactions.BuilderFactory.transfer()
					.recipientId(address)
					.amount("1")
					.sign(passphrase)
					.getStruct(),
				network,
			},
		});

		expect(response.verified).toBeTrue();
	});

	test("transactions.verifyHash", async () => {
		const response = await expectResponse({
			method: "transactions.verifyHash",
			params: {
				transaction: Transactions.BuilderFactory.transfer()
					.recipientId(address)
					.amount("1")
					.sign(passphrase)
					.getStruct(),
				network,
			},
		});

		expect(response.verified).toBeTrue();
	});

	test("transactions.verifySecondSignature", async () => {
		const response = await expectResponse({
			method: "transactions.verifySecondSignature",
			params: {
				transaction: Transactions.BuilderFactory.transfer()
					.recipientId(address)
					.amount("1")
					.sign(passphrase)
					.secondSign(passphrase)
					.getStruct(),
				publicKey,
				network,
			},
		});

		expect(response.verified).toBeTrue();
	});

	test("identities.address.fromPassphrase", async () => {
		const response = await expectResponse({
			method: "identities.address.fromPassphrase",
			params: { passphrase, network },
		});

		expect(response.address).toBe(address);
	});

	test("identities.address.fromPublicKey", async () => {
		const response = await expectResponse({
			method: "identities.address.fromPublicKey",
			params: { publicKey, network },
		});

		expect(response.address).toBe(address);
	});

	test("identities.address.fromPrivateKey", async () => {
		const response = await expectResponse({
			method: "identities.address.fromPrivateKey",
			params: { privateKey, network },
		});

		expect(response.address).toBe(address);
	});

	test("identities.address.fromMultiSignatureAsset", async () => {
		const response = await expectResponse({
			method: "identities.address.fromMultiSignatureAsset",
			params: { multiSignatureAsset: multiSignature.asset, network },
		});

		expect(response.address).toBe(multiSignature.address);
	});

	test("identities.publicKey.fromPassphrase", async () => {
		const response = await expectResponse({
			method: "identities.publicKey.fromPassphrase",
			params: { passphrase, network },
		});

		expect(response.publicKey).toBe(publicKey);
	});

	test("identities.publicKey.fromMultiSignatureAsset", async () => {
		const response = await expectResponse({
			method: "identities.publicKey.fromMultiSignatureAsset",
			params: { multiSignatureAsset: multiSignature.asset, network },
		});

		expect(response.publicKey).toBe(multiSignature.publicKey);
	});

	test("identities.publicKey.fromWIF", async () => {
		const response = await expectResponse({
			method: "identities.publicKey.fromWIF",
			params: { wif, network },
		});

		expect(response.publicKey).toBe(publicKey);
	});

	test("identities.privateKey.fromPassphrase", async () => {
		const response = await expectResponse({
			method: "identities.privateKey.fromPassphrase",
			params: { passphrase, network },
		});

		expect(response.privateKey).toBe(privateKey);
	});

	test("identities.privateKey.fromWIF", async () => {
		const response = await expectResponse({
			method: "identities.privateKey.fromWIF",
			params: { wif, network },
		});

		expect(response.privateKey).toBe(privateKey);
	});

	test("identities.wif.fromPassphrase", async () => {
		const response = await expectResponse({
			method: "identities.wif.fromPassphrase",
			params: { passphrase, network },
		});

		expect(response.wif).toBe(wif);
	});
});
