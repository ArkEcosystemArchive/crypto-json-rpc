import { Identities, Interfaces, Transactions, Utils } from "@arkecosystem/crypto";

const json2data = (transaction: Interfaces.ITransactionJson): Interfaces.ITransactionData => {
	// @ts-ignore
	transaction.amount = Utils.BigNumber.make(transaction.amount);
	// @ts-ignore
	transaction.fee = Utils.BigNumber.make(transaction.fee);

	return (transaction as unknown) as Interfaces.ITransactionData;
};

export const methods = [
	{
		name: "transactions.sign",
		async method(params: { transaction: Interfaces.ITransactionJson; passphrase: string }) {
			return {
				transaction: Transactions.Signer.sign(
					json2data(params.transaction),
					Identities.Keys.fromPassphrase(params.passphrase),
				),
			};
		},
		schema: {
			type: "object",
			properties: {
				network: {
					type: "string",
				},
				transaction: {
					type: "object",
				},
				passphrase: {
					type: "string",
				},
			},
			required: ["network", "transaction", "passphrase"],
		},
	},
	{
		name: "transactions.secondSign",
		async method(params: { transaction: Interfaces.ITransactionJson; passphrase: string }) {
			return {
				transaction: Transactions.Signer.secondSign(
					json2data(params.transaction),
					Identities.Keys.fromPassphrase(params.passphrase),
				),
			};
		},
		schema: {
			type: "object",
			properties: {
				network: {
					type: "string",
				},
				transaction: {
					type: "object",
				},
				passphrase: {
					type: "string",
				},
			},
			required: ["network", "transaction", "passphrase"],
		},
	},
	{
		name: "transactions.multiSign",
		async method(params: { transaction: Interfaces.ITransactionJson; passphrase: string }) {
			return {
				transaction: Transactions.Signer.multiSign(
					json2data(params.transaction),
					Identities.Keys.fromPassphrase(params.passphrase),
				),
			};
		},
		schema: {
			type: "object",
			properties: {
				network: {
					type: "string",
				},
				transaction: {
					type: "object",
				},
				passphrase: {
					type: "string",
				},
			},
			required: ["network", "transaction", "passphrase"],
		},
	},
	{
		name: "transactions.serialize",
		async method(params: { transaction: Interfaces.ITransactionJson }) {
			return {
				transaction: Transactions.Serializer.serialize(
					Transactions.TransactionFactory.fromJson(params.transaction),
				).toString("hex"),
			};
		},
		schema: {
			type: "object",
			properties: {
				network: {
					type: "string",
				},
				transaction: {
					type: "object",
				},
			},
			required: ["network", "transaction"],
		},
	},
	{
		name: "transactions.deserialize",
		async method(params: { transaction: string }) {
			return {
				transaction: Transactions.deserializer.deserialize(params.transaction).data,
			};
		},
		schema: {
			type: "object",
			properties: {
				network: {
					type: "string",
				},
				transaction: {
					type: "string",
				},
			},
			required: ["network", "transaction"],
		},
	},
	{
		name: "transactions.verify",
		async method(params: { transaction: Interfaces.ITransactionJson }) {
			return {
				verified: Transactions.Verifier.verify(
					Transactions.TransactionFactory.fromJson(params.transaction).data,
				),
			};
		},
		schema: {
			type: "object",
			properties: {
				network: {
					type: "string",
				},
				transaction: {
					type: "object",
				},
			},
			required: ["network", "transaction"],
		},
	},
	{
		name: "transactions.verifyHash",
		async method(params: { transaction: Interfaces.ITransactionJson }) {
			return {
				verified: Transactions.Verifier.verifyHash(
					Transactions.TransactionFactory.fromJson(params.transaction).data,
				),
			};
		},
		schema: {
			type: "object",
			properties: {
				network: {
					type: "string",
				},
				transaction: {
					type: "object",
				},
			},
			required: ["network", "transaction"],
		},
	},
	{
		name: "transactions.verifySecondSignature",
		// @ts-ignore
		async method(params: { transaction: Interfaces.ITransactionJson; publicKey: string }) {
			return {
				verified: Transactions.Verifier.verifySecondSignature(
					Transactions.TransactionFactory.fromJson(params.transaction).data,
					params.publicKey,
				),
			};
		},
		schema: {
			type: "object",
			properties: {
				network: {
					type: "string",
				},
				transaction: {
					type: "object",
				},
				publicKey: {
					type: "string",
				},
			},
			required: ["network", "transaction", "publicKey"],
		},
	},
	{
		name: "identities.address.fromPassphrase",
		async method(params: { passphrase: string }) {
			return {
				address: Identities.Address.fromPassphrase(params.passphrase),
			};
		},
		schema: {
			type: "object",
			properties: {
				network: {
					type: "string",
				},
				passphrase: {
					type: "string",
				},
			},
			required: ["network", "passphrase"],
		},
	},
	{
		name: "identities.address.fromPublicKey",
		async method(params: { publicKey: string }) {
			return {
				address: Identities.Address.fromPublicKey(params.publicKey),
			};
		},
		schema: {
			type: "object",
			properties: {
				network: {
					type: "string",
				},
				publicKey: {
					type: "string",
				},
			},
			required: ["network", "publicKey"],
		},
	},
	{
		name: "identities.address.fromPrivateKey",
		async method(params: { privateKey: string }) {
			return {
				address: Identities.Address.fromPrivateKey(Identities.Keys.fromPrivateKey(params.privateKey)),
			};
		},
		schema: {
			type: "object",
			properties: {
				network: {
					type: "string",
				},
				privateKey: {
					type: "string",
				},
			},
			required: ["network", "privateKey"],
		},
	},
	{
		name: "identities.address.fromMultiSignatureAsset",
		async method(params: { multiSignatureAsset: Interfaces.IMultiSignatureAsset }) {
			return {
				address: Identities.Address.fromMultiSignatureAsset(params.multiSignatureAsset),
			};
		},
		schema: {
			type: "object",
			properties: {
				network: {
					type: "string",
				},
				multiSignatureAsset: {
					type: "object",
				},
			},
			required: ["network", "multiSignatureAsset"],
		},
	},
	{
		name: "identities.publicKey.fromPassphrase",
		async method(params: { passphrase: string }) {
			return {
				publicKey: Identities.PublicKey.fromPassphrase(params.passphrase),
			};
		},
		schema: {
			type: "object",
			properties: {
				network: {
					type: "string",
				},
				passphrase: {
					type: "string",
				},
			},
			required: ["network", "passphrase"],
		},
	},
	{
		name: "identities.publicKey.fromMultiSignatureAsset",
		async method(params: { multiSignatureAsset: Interfaces.IMultiSignatureAsset }) {
			return {
				publicKey: Identities.PublicKey.fromMultiSignatureAsset(params.multiSignatureAsset),
			};
		},
		schema: {
			type: "object",
			properties: {
				network: {
					type: "string",
				},
				multiSignatureAsset: {
					type: "object",
				},
			},
			required: ["network", "multiSignatureAsset"],
		},
	},
	{
		name: "identities.publicKey.fromWIF",
		async method(params: { wif: string }) {
			return {
				publicKey: Identities.PublicKey.fromWIF(params.wif),
			};
		},
		schema: {
			type: "object",
			properties: {
				network: {
					type: "string",
				},
				wif: {
					type: "string",
				},
			},
			required: ["network", "wif"],
		},
	},
	{
		name: "identities.privateKey.fromPassphrase",
		async method(params: { passphrase: string }) {
			return {
				privateKey: Identities.PrivateKey.fromPassphrase(params.passphrase),
			};
		},
		schema: {
			type: "object",
			properties: {
				network: {
					type: "string",
				},
				passphrase: {
					type: "string",
				},
			},
			required: ["network", "passphrase"],
		},
	},
	{
		name: "identities.privateKey.fromWIF",
		async method(params: { wif: string }) {
			return {
				privateKey: Identities.PrivateKey.fromWIF(params.wif),
			};
		},
		schema: {
			type: "object",
			properties: {
				network: {
					type: "string",
				},
				wif: {
					type: "string",
				},
			},
			required: ["network", "wif"],
		},
	},
	{
		name: "identities.wif.fromPassphrase",
		async method(params: { passphrase: string }) {
			return {
				wif: Identities.WIF.fromPassphrase(params.passphrase),
			};
		},
		schema: {
			type: "object",
			properties: {
				network: {
					type: "string",
				},
				passphrase: {
					type: "string",
				},
			},
			required: ["network", "passphrase"],
		},
	},
];
