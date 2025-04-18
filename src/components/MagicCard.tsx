import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import ScryfallError from "@/types/errors/ScryfallError";
import ScryfallCard, { ScryfallCardSchema } from "@/types/ScryfallCard";
import { syZodFetch, SyFetchError } from "@/utils/SyFetch";

export default function MagicCard({
	magicCardBase,
}: {
	magicCardBase: {
		setCode: string;
		cardNumber: string;
	} | null;
}) {
	const { isLoading, error, data } = useQuery<
		ScryfallCard,
		ScryfallError | z.ZodError | SyFetchError | Error
	>({
		queryKey: ["get-magic-card", magicCardBase],
		staleTime: 1000 * 60 * 3,
		enabled: !!magicCardBase,
		retry: 1,
		queryFn: async () => {
			if (!magicCardBase)
				throw new Error("Set code and card number are null");

			const [fetchError, response] = await syZodFetch(
				`https://api.scryfall.com/cards/${magicCardBase.setCode}/${magicCardBase.cardNumber.toString()}`,
				ScryfallCardSchema
			);

			if (fetchError) {
				if (fetchError instanceof SyFetchError) {
					const [parseError, scryfallError] = ScryfallError.safeParse(
						fetchError.json
					);
					if (!parseError) throw scryfallError;
				}
				throw fetchError;
			}

			const [parseError, scryfallCard] = ScryfallCard.safeParse(response);
			if (parseError) throw parseError;
			return scryfallCard;
		},
	});

	if (isLoading) return <div>Loading...</div>;

	if (error) {
		const errorMessages: string[] = [];
		if (error instanceof z.ZodError) {
			for (const zodError of error.errors) {
				errorMessages.push(
					`${zodError.path.join(".")}: ${zodError.message}`
				);
			}
		} else if (error instanceof ScryfallError) {
			errorMessages.push(`${error.status.toString()} - ${error.message}`);
		} else if (error instanceof SyFetchError) {
			errorMessages.push(`${error.status.toString()} - ${error.message}`);
		} else {
			errorMessages.push(error.message);
		}

		return (
			<div>
				<h2>Errors:</h2>
				{errorMessages.map((error, index) => (
					<p key={index}>{error}</p>
				))}
			</div>
		);
	}

	if (!data) return <div>No data</div>;

	return (
		<>
			<pre>{JSON.stringify(data, null, 2)}</pre>
			<div className="flex flex-row gap-2">
				{!!data.image_uris && (
					<img
						alt="Magic Card"
						className="w-96 rounded-3xl"
						src={data.image_uris.normal}
					/>
				)}

				{!!data.card_faces &&
					data.card_faces.map((cardFace, index) => {
						if (!cardFace.image_uris) return null;
						return (
							<img
								key={index}
								alt="Magic Card"
								className="w-96 rounded-3xl"
								src={cardFace.image_uris.normal}
							/>
						);
					})}
			</div>
		</>
	);
}
