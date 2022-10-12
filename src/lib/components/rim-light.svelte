<div class="rimlight far" />
<div class="rimlight close" />

<style lang="scss">
	.rimlight {
		$border-thickness: 0.5rem;
		$border-radius: 1rem;
		--border-color: #{$color4};
		height: 66%;
		width: 66%;
		border-top: solid $border-thickness var(--border-color);
		border-right: solid $border-thickness var(--border-color);
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
			background-color: var(--border-color);
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
			background-color: var(--border-color);
		}
	}
  .close {
    --border-color: #{$color5};
    height: 33%;
		width: 33%;
  }
</style>
