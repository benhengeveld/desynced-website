<script lang="ts">
	import type { PageProps } from './$types';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { MagicCardBase } from '$lib/models/MagicCardBase';
	import MagicCard from '$lib/components/MagicCard.svelte';

	let { params }: PageProps = $props();

	let magicCardBase = $derived(
		!params.setCode || !params.cardNumber
			? null
			: ({ setCode: params.setCode, cardNumber: params.cardNumber } as MagicCardBase)
	);

	function onsubmit(event: SubmitEvent) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget as HTMLFormElement);
		const search = (formData.get('searchInput') as string).trim();

		if (!search) {
			goto(resolve('/magic-prices'));
			return;
		}

		if (search.length < 4) {
			// TODO: Show error in this case
			goto(resolve(`/magic-prices/${encodeURIComponent(search)}`));
			return;
		}

		const setCode = search.substring(0, 3);
		const cardNumber = search.substring(3).trim();

		console.log(setCode, cardNumber);

		goto(resolve(`/magic-prices/${encodeURIComponent(setCode)}/${encodeURIComponent(cardNumber)}`));
	}
</script>

<svelte:head>
	<title>Magic Prices - Sy_nc</title>
</svelte:head>

<div class="mx-auto max-w-7xl">
	<form class="p-3" {onsubmit}>
		<div class="flex w-full flex-row gap-2 rounded-xl bg-neutral-600">
			<input
				autocomplete="off"
				class="grow px-6 py-3 text-xl text-white placeholder-neutral-400 focus:outline-none"
				type="text"
				placeholder="Search"
				name="searchInput"
			/>
			<!-- TODO: Show an example of the search input -->

			<button
				aria-label="Search"
				class="flex w-12 cursor-pointer flex-col items-center justify-center rounded-full text-xl"
				type="submit"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24px"
					viewBox="0 -960 960 960"
					width="24px"
					fill="#ffffff"
					><path
						d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"
					/></svg
				>
			</button>
		</div>
	</form>

	<MagicCard {magicCardBase} />
</div>
