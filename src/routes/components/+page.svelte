<script lang="ts">
	import Switch from '$lib/components/Switch.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Radio from '$lib/components/Radio.svelte';
	import RadioGroup from '$lib/components/RadioGroup.svelte';
	import { colors } from '$lib/colors';

	let switchValue = false;
	let checkboxValue = false;
	let radioValue = 'option1';
	let radioGroupValue = 'option1';

	const radioOptions = [
		{ value: 'option1', label: 'Option 1' },
		{ value: 'option2', label: 'Option 2' },
		{ value: 'option3', label: 'Option 3' }
	];

	function handleSwitchChange(checked: boolean) {
		switchValue = checked;
	}

	function handleCheckboxChange(checked: boolean) {
		checkboxValue = checked;
	}

	function handleRadioChange(value: string) {
		radioValue = value;
	}

	function handleRadioGroupChange(value: string) {
		radioGroupValue = value;
	}
</script>

<svelte:head>
	<title>Form Components - Balance Botanica</title>
</svelte:head>

<div class="min-h-screen p-6" style="background-color: {colors.background};">
	<div class="mx-auto max-w-4xl">
		<header class="mb-12 text-center">
			<h1 class="mb-4 text-4xl font-semibold" style="color: {colors.main};">Form Components</h1>
			<p class="text-lg" style="color: {colors.text};">
				Interactive form elements built from Figma designs
			</p>
		</header>

		<div class="space-y-12">
			<!-- Switch Component -->
			<section class="rounded-lg bg-white p-6 shadow-lg">
				<h2 class="mb-6 text-2xl font-semibold" style="color: {colors.heading};">
					Switch Component
				</h2>

				<div class="space-y-6">
					<div>
						<h3 class="mb-3 text-lg font-medium" style="color: {colors.main};">Basic Switch</h3>
						<Switch checked={switchValue} onChange={handleSwitchChange} label="Toggle me" />
						<p class="mt-2 text-sm" style="color: {colors.primary};">
							Current state: {switchValue ? 'ON' : 'OFF'}
						</p>
					</div>

					<div>
						<h3 class="mb-3 text-lg font-medium" style="color: {colors.main};">Disabled Switch</h3>
						<Switch checked={true} disabled={true} label="Disabled switch" />
					</div>
				</div>
			</section>

			<!-- Checkbox Component -->
			<section class="rounded-lg bg-white p-6 shadow-lg">
				<h2 class="mb-6 text-2xl font-semibold" style="color: {colors.heading};">
					Checkbox Component
				</h2>

				<div class="space-y-6">
					<div>
						<h3 class="mb-3 text-lg font-medium" style="color: {colors.main};">Basic Checkbox</h3>
						<Checkbox
							checked={checkboxValue}
							onChange={handleCheckboxChange}
							label="Accept terms and conditions"
						/>
						<p class="mt-2 text-sm" style="color: {colors.primary};">
							Checked: {checkboxValue ? 'Yes' : 'No'}
						</p>
					</div>

					<div>
						<h3 class="mb-3 text-lg font-medium" style="color: {colors.main};">
							Disabled Checkbox
						</h3>
						<Checkbox checked={true} disabled={true} label="Disabled checkbox" />
					</div>
				</div>
			</section>

			<!-- Radio Component -->
			<section class="rounded-lg bg-white p-6 shadow-lg">
				<h2 class="mb-6 text-2xl font-semibold" style="color: {colors.heading};">
					Radio Component
				</h2>

				<div class="space-y-6">
					<div>
						<h3 class="mb-3 text-lg font-medium" style="color: {colors.main};">
							Individual Radio Buttons
						</h3>
						<div class="space-y-3">
							<Radio
								name="individual"
								value="option1"
								label="Option 1"
								checked={radioValue === 'option1'}
								onChange={handleRadioChange}
							/>
							<Radio
								name="individual"
								value="option2"
								label="Option 2"
								checked={radioValue === 'option2'}
								onChange={handleRadioChange}
							/>
							<Radio
								name="individual"
								value="option3"
								label="Option 3"
								checked={radioValue === 'option3'}
								onChange={handleRadioChange}
							/>
						</div>
						<p class="mt-2 text-sm" style="color: {colors.primary};">
							Selected: {radioValue}
						</p>
					</div>

					<div>
						<h3 class="mb-3 text-lg font-medium" style="color: {colors.main};">Radio Group</h3>
						<RadioGroup
							name="group"
							options={radioOptions}
							value={radioGroupValue}
							onChange={handleRadioGroupChange}
						/>
						<p class="mt-2 text-sm" style="color: {colors.primary};">
							Selected: {radioGroupValue}
						</p>
					</div>

					<div>
						<h3 class="mb-3 text-lg font-medium" style="color: {colors.main};">Disabled Radio</h3>
						<Radio
							name="disabled"
							value="disabled"
							label="Disabled option"
							checked={false}
							disabled={true}
							onChange={() => {}}
						/>
					</div>
				</div>
			</section>
		</div>
	</div>
</div>
