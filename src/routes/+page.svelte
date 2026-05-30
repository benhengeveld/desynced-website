<script>
	import CromaticText from '$lib/components/CromaticText.svelte';
</script>

<svelte:head>
	<title>Sy_nc</title>
</svelte:head>

<div class="fixed inset-0 bg-black">
	<div class="crt absolute inset-0"></div>
	<img
		alt="Background"
		class="pointer-events-none absolute inset-0 h-full w-full blur"
		src="https://i.imgur.com/1Y1gIXy.jpg"
	/>
	<div class="absolute inset-1/2 h-60 w-116 -translate-1/2">
		<div
			class="absolute inset-1/2 h-40 w-96 -translate-1/2 rounded-md bg-black/60 p-2 pb-6 backdrop-blur"
		>
			<!-- <h1 class="text-9xl font-bold text-transparent">Sy_nc</h1> -->
		</div>
		<CromaticText text="Sy_nc" font="bold 128px Inter" />
	</div>
</div>
