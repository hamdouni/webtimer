<svelte:options customElement="app-input" />

<script>
	let player;
	let sound;
	let allTimers = [3, 2];
	let index = 0;
	let timer;
	$: timer = allTimers[index];

	let beepDuration = 5;
	let beepTime;

	let state = "stop";
	function startTimer() {
		state = "started";
		const interval = setInterval(() => {
			if (state == "started") {
				if (timer > 0) timer--;
				else state = "next";
			} else if (state == "next") {
				state = "beeping";
				beepTime = beepDuration;
				player.play();
			} else if (state == "beeping" && beepTime > 0) {
				beepTime--;
			} else if (state == "beeping" && beepTime == 0) {
				player.pause();
				player.currentTime = 0;
				index++;
				if (index == allTimers.length) {
					index = 0;
					state = "stop";
				} else {
					timer = allTimers[index];
					state = "started";
				}
			} else if (state == "stop") {
				clearInterval(interval);
			}
		}, 1000);
	}
	function cancelTimer() {
		player.pause();
		state = "stop";
		index = 0;
	}
	function add() {
		allTimers = [...allTimers, 30];
	}
	function del(idx) {
		if (allTimers.length > 1) {
			allTimers.splice(idx, 1);
			allTimers = allTimers;
		}
	}
</script>

<main>
	<fieldset>
		<legend>Timers</legend>
		{#each allTimers as t, i}
			<div>
				<button on:click={() => del(i)} disabled={allTimers.length == 1}
					>&times;</button
				>
				<input type="number" bind:value={t} />
				{#if i == index}
					⬅️
				{/if}
			</div>
		{/each}
		<button class="add" on:click={add}>ajouter</button>
	</fieldset>
	<div class="timer">
		<span>{timer}</span>
		{#if state != "stop"}
			<button class="cancel" on:click={cancelTimer}> Annuler </button>
		{:else}
			<button class="start" on:click={startTimer}> Démarrer </button>
		{/if}
	</div>
	<audio src={sound} loop bind:this={player}></audio>
	<fieldset class="parameters">
		<legend>Paramères</legend>
		<label for="duration"> durée de pause: </label>
		<input id="duration" type="number" bind:value={beepDuration} />
		<label for="sound"> audio: </label>
		<select id="sound" bind:value={sound}>
			<option value="meditation.mp3">Méditation</option>
			<option value="music.mp3">Musique</option>
			<option value="sonnette.mp3">Sonnette</option>
		</select>
	</fieldset>
</main>

<pre>
allTimers: {allTimers}
timer : {timer}
index : {index}
state : {state}
</pre>

<style>
	main {
		display: flex;
		justify-content: center;
	}
	div.timer {
		max-width: fit-content;
		display: flex;
		flex-direction: column;
	}
	div span {
		display: flex;
		flex-direction: row;
		justify-content: center;
		font-size: 4rem;
	}
	button.start,
	button.cancel {
		margin: 1rem;
		padding: 1rem 2rem;
	}
	input {
		width: 3rem;
	}
	fieldset {
		max-width: fit-content;
		max-height: fit-content;
		align-content: start;
	}
	.parameters {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-gap: 1rem;
	}
	.parameters label {
		text-align: right;
	}
</style>
