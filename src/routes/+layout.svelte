<script lang="ts">
	import { browser } from '$app/environment';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import Navbar from '$lib/components/Navbar.svelte';

	import './layout.css';
	import '$lib/assets/styles/crt.css';
	import favicon from '$lib/assets/svgs/favicon.ico';

	let { children } = $props();

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});
</script>

<svelte:head>
	<title>Sy_nc</title>
	<link rel="icon" href={favicon} />
</svelte:head>

<QueryClientProvider client={queryClient}>
	<Navbar />
	<div class="min-h-dvh pt-navbar">
		{@render children()}
	</div>
</QueryClientProvider>
