<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	const {
		magicCardBase
	}: {
		magicCardBase: {
			setCode: string;
			cardNumber: string;
		} | null;
	} = $props();

	const magicCardQuery = createQuery(() => ({
		queryKey: ['get-magic-card', magicCardBase],
		queryFn: () => {
			return {};
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
			<div
				class="flex h-170 max-h-175 w-120 max-w-125 items-center justify-center rounded-3xl bg-white/10 text-2xl"
			>
				No image
			</div>
		</div>
		<div class="flex-1">
			<div class="flex flex-col gap-4 text-3xl">
				<p>
					<b>Name:</b> Name
				</p>
				<p>
					<b>Set:</b> Set
				</p>
				<p>
					<b>Normal:</b> Normal
				</p>
				<p>
					<b>Foil:</b> Foil
				</p>
				<p>
					<b>Etched:</b> Etched
				</p>
			</div>
		</div>
	</div>
{/if}
