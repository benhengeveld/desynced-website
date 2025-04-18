import { z } from "zod";

const ImageUrisSchema = z.object({
	small: z.string(),
	normal: z.string(),
	large: z.string(),
});

const CardFaceSchema = z.object({
	image_uris: ImageUrisSchema.optional(),
});

const PricesSchema = z.object({
	usd: z.string().nullable(),
	usd_foil: z.string().nullable(),
	usd_etched: z.string().nullable(),
});

export const ScryfallCardSchema = z.object({
	id: z.string(),
	name: z.string(),
	scryfall_uri: z.string(),
	set_name: z.string(),
	image_uris: ImageUrisSchema.optional(),
	card_faces: z.array(CardFaceSchema).optional(),
	prices: PricesSchema,
});

export default class ScryfallCard {
	id: string;
	name: string;
	scryfall_uri: string;
	set_name: string;
	image_uris?: {
		small: string;
		normal: string;
		large: string;
	};
	card_faces?: Array<{
		image_uris?: {
			small: string;
			normal: string;
			large: string;
		};
	}>;
	prices: {
		usd: string | null;
		usd_foil: string | null;
		usd_etched: string | null;
	};

	constructor(data: z.infer<typeof ScryfallCardSchema>) {
		this.id = data.id;
		this.name = data.name;
		this.scryfall_uri = data.scryfall_uri;
		this.set_name = data.set_name;
		this.image_uris = data.image_uris;
		this.card_faces = data.card_faces;
		this.prices = data.prices;
	}

	static parse(data: unknown): ScryfallCard {
		const validatedData = ScryfallCardSchema.parse(data);
		return new ScryfallCard(validatedData);
	}

	static safeParse(data: unknown) {
		const result = ScryfallCardSchema.safeParse(data);
		if (!result.success) {
			return [result.error, null] as const;
		}
		return [null, new ScryfallCard(result.data)] as const;
	}
}
