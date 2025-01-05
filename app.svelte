<svelte:options customElement="app-input" />

<script>
	let player;
	let sound;
	let timers = [3, 2];
	let index = 0;
	let timer;
	$: timer = timers[index];

	let beepDuration = 5;

	let state = "stop";
	let interval;

	function startTimer() {
		state = "started";
		interval = setInterval(() => {
			if (timer > 0) timer--;
		}, 1000);
	}
	function cancelTimer() {
		player.pause();
		state = "stop";
		index = 0;
	}
	function add() {
		timers = [...timers, 30];
	}
	function del(idx) {
		if (timers.length > 1) {
			timers.splice(idx, 1);
			timers = timers;
		}
	}

	const sleep = seconds => new Promise(r => setTimeout(r, 1000*seconds));	

	async function mainloop() {
		if (state == "started" && timer == 0) {
			state = "beeping";
			player.play();
			console.log("playing");
			await sleep(beepDuration);
			player.pause();
			player.currentTime = 0;
			index++;
			if (index == timers.length) {
				index = 0;
				state = "stop";
			} else {
				timer = timers[index];
				state = "started";
			}
		} else if (state == "stop") {
			clearInterval(interval);
		}
		setTimeout(mainloop);
	}
	mainloop();
</script>

<audio src={sound} loop bind:this={player}></audio>
<main>
	<div class="timer">
		<span>{timer}</span>
		{#if state != "stop"}
			<button class="cancel" on:click={cancelTimer}> Annuler </button>
		{:else}
			<button class="start" on:click={startTimer}> Démarrer </button>
		{/if}
	</div>
	<details class="timers" open>
		<summary>Parameters</summary>
		<form>
			<label for="sound"> audio: </label>
			<select id="sound" bind:value={sound}>
				<option value="meditation.mp3">Méditation</option>
				<option value="music.mp3">Musique</option>
				<option value="sonnette.mp3">Sonnette</option>
			</select>
			<label for="duration"> pause </label>
			<input id="duration" type="number" bind:value={beepDuration} />
			{#each timers as t, i}
				<label for="timer{i + 1}">
					{#if i == index}
						&rsaquo;
					{/if}
					timer {i + 1}
				</label>
				<div>
					<input id="timer{i + 1}" type="number" bind:value={t} />
					<button
						type="button"
						on:click={() => del(i)}
						disabled={timers.length == 1}>&times;</button
					>
				</div>
			{/each}
			&nbsp;
			<button type="button" class="add" on:click={add}>+</button>
		</form>
	</details>
</main>

<pre>
timers: {timers}
timer : {timer}
index : {index}
state : {state}
</pre>

<style>
	main {
		display: flex;
		flex-direction: column;
		max-width: 480px;
		margin: 0 auto;
	}
	div.timer {
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
		padding: 1rem 2rem;
	}
	button.add {
		font-size: 1.5rem;
		line-height: 1.5rem;
		border: 2px solid;
		padding: 1rem 2rem;
	}
	input,
	select {
		font-size: 1.33rem;
	}
	input {
		padding: 0.33rem 0 0.33rem 0.33rem;
		width: 3rem;
	}
	form {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-gap: 1rem;
	}
	form label {
		text-align: right;
		align-content: center;
		font-size: 1.33rem;
	}
	details {
		margin-top: 1.7rem;
		cursor: pointer;
	}
	details summary {
		background-color: #e3e3e3;
		padding: 1rem 2rem 1rem 0.33rem;
		margin-bottom: 1.7rem;
	}
</style>
