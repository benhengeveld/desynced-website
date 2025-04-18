import type { z, ZodType } from "zod";

export async function syFetch<T = object>(
	input: string | URL | globalThis.Request,
	init?: RequestInit
): Promise<
	readonly [SyFetchError, null] | readonly [Error, null] | readonly [null, T]
> {
	try {
		const response = await fetch(input, init);

		if (!response.ok) {
			let text: string | null = await response.text();
			let json: object | null = null;
			try {
				json = JSON.parse(text) as object;
				text = null;
			} catch {
				/* empty */
			}

			const syFetchError = new SyFetchError(
				"Network response was not ok",
				response.status,
				text,
				json
			);
			return [syFetchError, null] as const;
		}

		const json = (await response.json()) as T;
		return [null, json] as const;
	} catch (error) {
		return [error as Error, null] as const;
	}
}

export async function syZodFetch<T extends ZodType>(
	input: string | URL | globalThis.Request,
	resultZodType: T,
	init?: RequestInit
): Promise<
	| readonly [SyFetchError, null]
	| readonly [z.ZodError, null]
	| readonly [Error, null]
	| readonly [null, z.infer<T>]
> {
	try {
		const [fetchError, response] = await syFetch(input, init);
		if (fetchError) return [fetchError, null] as const;

		const parseResult = resultZodType.safeParse(response);
		if (!parseResult.success) return [parseResult.error, null] as const;

		return [null, parseResult.data as z.infer<T>] as const;
	} catch (error) {
		return [error as Error, null] as const;
	}
}

export class SyFetchError extends Error {
	status: number;
	text: string | null;
	json: object | null;

	constructor(
		message: string,
		status: number,
		text: string | null,
		json: object | null
	) {
		super(message);
		this.name = "SyFetchError";
		this.status = status;
		this.text = text;
		this.json = json;
	}
}
