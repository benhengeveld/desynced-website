<script lang="ts">
	import type { MagicCardBase } from '$lib/models/MagicCardBase';
	import { createQuery } from '@tanstack/svelte-query';
	import { syZodFetchWithError } from '$lib/utils/SyFetch';
	import { ScryfallCard, ScryfallCardSchema } from '$lib/models/ScryfallCard';
	import { ScryfallError, ScryfallErrorSchema } from '$lib/models/ScryfallError';

	const {
		magicCardBase
	}: {
		magicCardBase: MagicCardBase | null;
	} = $props();

	const magicCardQuery = createQuery(() => ({
		queryKey: ['get-magic-card', magicCardBase],
		staleTime: 1000 * 60 * 3,
		retry: 1,
		queryFn: async () => {
			if (!magicCardBase) {
				throw new Error('Set code and card number are null');
			}

			const [fetchError, errorResponse, response] = await syZodFetchWithError(
				`https://api.scryfall.com/cards/${magicCardBase.setCode}/${magicCardBase.cardNumber}`,
				ScryfallCardSchema,
				ScryfallErrorSchema
			);

			if (fetchError) throw fetchError;
			if (errorResponse) throw new ScryfallError(errorResponse);

			return new ScryfallCard(response);
		},
		enabled: magicCardBase !== null
	}));
</script>

{#if magicCardQuery.isLoading}
	<div class="flex animate-pulse flex-row gap-4 p-4 max-md:flex-col-reverse">
		<div class="flex flex-1 flex-row items-center justify-end max-md:justify-start">
			<div class="h-170 max-h-175 w-120 max-w-125 rounded-3xl bg-white/10"></div>
		</div>
		<div class="flex-1">
			<div class="flex flex-col gap-4 text-3xl">
				<p class="h-7.5 w-4/5 rounded-xl bg-white/10"></p>
				<p class="h-7.5 w-4/5 rounded-xl bg-white/10"></p>
				<p class="h-7.5 w-4/5 rounded-xl bg-white/10"></p>
				<p class="h-7.5 w-7/10 rounded-xl bg-white/10"></p>
			</div>
		</div>
	</div>
{:else if magicCardQuery.isError}
	<div class="flex flex-col items-center gap-4 p-4 text-xl">
		<p>{magicCardQuery.error.message}</p>
	</div>
{:else if magicCardQuery.data}
	<div class="flex flex-row gap-4 p-4 max-md:flex-col-reverse">
		<div class="flex flex-1 flex-row items-center justify-end max-md:justify-start">
			{#if magicCardQuery.data.front_image_uris}
				<img
					alt="Magic Card {magicCardQuery.data.name}"
					class="max-h-175 max-w-125 rounded-3xl"
					src={magicCardQuery.data.front_image_uris.normal}
				/>
			{:else}
				<div
					class="flex h-170 max-h-175 w-120 max-w-125 items-center justify-center rounded-3xl bg-white/10 text-2xl"
				>
					No image
				</div>
			{/if}
		</div>
		<div class="flex-1">
			<div class="flex flex-col gap-4 text-3xl">
				<p>
					<b>Name:</b>
					{magicCardQuery.data.name}
				</p>

				<p>
					<b>Set:</b>
					{magicCardQuery.data.set_name}
				</p>

				{#if magicCardQuery.data.prices.usd}
					<p>
						<b>Normal:</b>
						{magicCardQuery.data.prices.usd} USD
					</p>
				{/if}

				{#if !!magicCardQuery.data.prices.usd_foil}
					<p>
						<b>Foil:</b>
						{magicCardQuery.data.prices.usd_foil} USD
					</p>
				{/if}

				{#if !!magicCardQuery.data.prices.usd_etched}
					<p>
						<b>Etched:</b>
						{magicCardQuery.data.prices.usd_etched} USD
					</p>
				{/if}
			</div>
		</div>
	</div>
{/if}
