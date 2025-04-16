import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { z } from "zod";

interface MagicCardBase {
	setCode: string;
	cardNumber: number;
}

const MagicCardSchema = z.object({
	name: z.string(),
	scryfall_uri: z.string(),
	set_name: z.string(),
	image_uris: z
		.object({
			small: z.string(),
			normal: z.string(),
			large: z.string(),
		})
		.optional(),
	card_faces: z
		.array(
			z.object({
				image_uris: z.object({
					small: z.string(),
					normal: z.string(),
					large: z.string(),
				}),
			})
		)
		.optional(),
	prices: z.object({
		usd: z.string().nullable(),
		usd_foil: z.string().nullable(),
		usd_etched: z.string().nullable(),
	}),
});
type MagicCard = z.infer<typeof MagicCardSchema>;

const ScryfallErrorSchema = z.object({
	object: z.string(),
	code: z.number(),
	status: z.number(),
	details: z.string(),
});

export default function MagicPricesPage() {
	return (
		<>
			<Helmet>
				<title>Magic Prices - Sy_nc</title>
			</Helmet>
			<h1>Magic Prices Page</h1>
			<MagicCard magicCardBase={{ setCode: "soi", cardNumber: 97 }} />
		</>
	);
}

function MagicCard({ magicCardBase }: { magicCardBase?: MagicCardBase }) {
	const { isLoading, error, data } = useQuery<MagicCard, Error | z.ZodError>({
		queryKey: ["get-magic-card", magicCardBase],
		staleTime: 1000 * 60 * 3,
		enabled: !!magicCardBase,
		queryFn: async () => {
			if (!magicCardBase) throw new Error("Magic card base is undefined");

			if (magicCardBase.setCode.length !== 3)
				throw new Error("Invalid set code");

			if (magicCardBase.cardNumber <= 0)
				throw new Error("Invalid card number");

			const response = await fetch(
				`https://api.scryfall.com/cards/${magicCardBase.setCode}/${magicCardBase.cardNumber.toString()}`
			);

			if (!response.ok) {
				try {
					const jsonData = (await response.json()) as unknown;
					const scryfallError = ScryfallErrorSchema.parse(jsonData);
					throw new Error(scryfallError.details);
				} catch {
					throw new Error("Network response was not ok");
				}
			}

			const jsonData = (await response.json()) as unknown;

			return MagicCardSchema.parse(jsonData);
		},
	});

	if (isLoading) return <div>Loading...</div>;

	if (error && error instanceof z.ZodError) {
		return (
			<div>
				<h2>Zod Errors:</h2>
				{error.errors.map((error) => (
					<p>
						{error.path.join(".")}: {error.message}
					</p>
				))}
			</div>
		);
	}

	if (error) return <div>Error: {error.message}</div>;

	if (!data) return <div>No data</div>;

	return (
		<>
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</>
	);
}
