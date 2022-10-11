<div class="rimlight" />

<style lang="scss">
	.rimlight {
		$border-thickness: 0.5rem;
		$border-radius: 1rem;
		$border-color: $color5;
		height: 66%;
		width: 66%;
		border-top: solid $border-thickness $border-color;
		border-right: solid $border-thickness $border-color;
		position: absolute;
		top: 0;
		right: 0;
		border-top-right-radius: $border-radius;
		z-index: 10;
		pointer-events: none;
		opacity: 0.5;
		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			height: $border-thickness;
			width: $border-thickness;
			transform: translate(-50%, -100%);
			border-radius: 100%;
			background-color: $border-color;
		}
		&::after {
			content: '';
			position: absolute;
			bottom: 0;
			right: 0;
			height: $border-thickness;
			width: $border-thickness;
			transform: translate(100%, 50%);
			border-radius: 100%;
			background-color: $border-color;
		}
	}
</style>
