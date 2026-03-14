<script lang="ts">
	const {
		magicCardBase
	}: {
		magicCardBase: {
			setCode: string;
			cardNumber: string;
		} | null;
	} = $props();
</script>

<h1>Magic Card</h1>
<p>Magic Card Base: {magicCardBase?.setCode}</p>
<p>Card Number: {magicCardBase?.cardNumber}</p>
