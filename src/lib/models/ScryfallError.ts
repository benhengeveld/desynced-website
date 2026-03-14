import { z } from 'zod';

export const ScryfallErrorSchema = z.object({
	object: z.string(),
	code: z.string(),
	status: z.number(),
	details: z.string()
});

export class ScryfallError extends Error {
	object: string;
	code: string;
	status: number;

	constructor(data: z.infer<typeof ScryfallErrorSchema>) {
		super(data.details);
		this.name = 'ScryfallError';
		this.object = data.object;
		this.code = data.code;
		this.status = data.status;
	}

	static parse(data: unknown) {
		const validatedData = ScryfallErrorSchema.parse(data);
		return new ScryfallError(validatedData);
	}

	static safeParse(data: unknown) {
		const result = ScryfallErrorSchema.safeParse(data);
		if (!result.success) {
			return [result.error, null] as const;
		}
		return [null, new ScryfallError(result.data)] as const;
	}
}
