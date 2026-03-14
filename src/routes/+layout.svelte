<script lang="ts">
	import { resolve } from '$app/paths';

	import './layout.css';
	import '$lib/assets/styles/crt.css';
	import favicon from '$lib/assets/svgs/favicon.ico';

	let { children } = $props();

	const navItems = [
		{ id: 1, href: '/', label: 'Home' },
		{ id: 2, href: '/magic-prices', label: 'Magic Prices' }
	] as const;
</script>

<svelte:head>
	<title>Sy_nc</title>
	<link rel="icon" href={favicon} />
</svelte:head>

<div
	class="fixed inset-x-0 top-0 z-10 flex h-navbar flex-row items-center bg-black/60 px-6 py-2 backdrop-blur"
>
	<a
		href={resolve('/')}
		class="flex h-full flex-row items-center rounded px-2 text-2xl font-bold hover:bg-white/10"
	>
		Sy_nc
	</a>
	<nav class="flex h-full flex-row items-center">
		{#each navItems as navItem (navItem.id)}
			<a
				href={resolve(navItem.href)}
				class="flex h-full min-w-16 flex-row items-center rounded px-2 font-medium hover:bg-white/10"
			>
				{navItem.label}
			</a>
		{/each}
	</nav>
</div>

<div class="min-h-dvh pt-navbar">
	{@render children()}
</div>
