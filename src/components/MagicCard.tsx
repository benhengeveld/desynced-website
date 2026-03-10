import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import ScryfallError, {
	ScryfallErrorSchema,
} from "@/types/errors/ScryfallError";
import ScryfallCard, { ScryfallCardSchema } from "@/types/ScryfallCard";
import { SyFetchError, syZodFetchWithError } from "@/utils/SyFetch";

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

			const [fetchError, errorResponse, response] =
				await syZodFetchWithError(
					`https://api.scryfall.com/cards/${magicCardBase.setCode}/${magicCardBase.cardNumber}`,
					ScryfallCardSchema,
					ScryfallErrorSchema
				);

			if (fetchError) throw fetchError;
			if (errorResponse) throw new ScryfallError(errorResponse);

			return new ScryfallCard(response);
		},
	});

	if (isLoading)
		return (
			<div className="flex flex-row gap-4 p-4 max-md:flex-col-reverse animate-pulse">
				<div className="flex flex-1 flex-row items-center justify-end max-md:justify-start ">
					<div className="max-h-175 max-w-125 w-120 h-170 rounded-3xl bg-white/10" />
				</div>
				<div className="flex-1">
					<div className="flex flex-col gap-4 text-3xl">
						<p className="bg-white/10 rounded-xl h-7.5 w-4/5" />
						<p className="bg-white/10 rounded-xl h-7.5 w-4/5" />
						<p className="bg-white/10 rounded-xl h-7.5 w-4/5" />
						<p className="bg-white/10 rounded-xl h-7.5 w-7/10" />
					</div>
				</div>
			</div>
		);

	if (error) {
		const errorMessages: string[] = [];
		if (error instanceof z.ZodError) {
			for (const zodError of error.issues) {
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
			<div className="flex flex-col gap-4 text-xl items-center p-4">
				{errorMessages.map((error, index) => (
					<p key={index}>{error}</p>
				))}
			</div>
		);
	}

	if (!data) return <></>;

	return (
		<div className="flex flex-row gap-4 p-4 max-md:flex-col-reverse">
			<div className="flex flex-1 flex-row items-center justify-end max-md:justify-start">
				{data.front_image_uris ? (
					<img
						alt={`Magic Card - ${data.name}`}
						className="max-h-175 max-w-125 rounded-3xl"
						src={data.front_image_uris.normal}
					/>
				) : (
					<div className="max-h-175 max-w-125 w-120 h-170 rounded-3xl bg-white/10 flex justify-center items-center text-2xl">
						No image
					</div>
				)}
			</div>
			<div className="flex-1">
				<div className="flex flex-col gap-4 text-3xl">
					<p>
						<b>Name:</b> {data.name}
					</p>
					<p>
						<b>Set:</b> {data.set_name}
					</p>
					{!!data.prices.usd && (
						<p>
							<b>Normal:</b> ${data.prices.usd} USD
						</p>
					)}
					{!!data.prices.usd_foil && (
						<p>
							<b>Foil:</b> ${data.prices.usd_foil} USD
						</p>
					)}
					{!!data.prices.usd_etched && (
						<p>
							<b>Etched:</b> ${data.prices.usd_etched} USD
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
