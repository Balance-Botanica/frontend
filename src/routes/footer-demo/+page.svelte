<script lang="ts">
  import Footer from '$lib/components/Footer.svelte';
  import Input from '$lib/components/Input.svelte';
  import Button from '$lib/components/Button.svelte';
  import { colors } from '$lib/colors';
  
  let inputValue = '';
  let emailValue = '';
  
  function handleInputChange(value: string) {
    inputValue = value;
  }
  
  function handleEmailChange(value: string) {
    emailValue = value;
  }
  
  function handleButtonClick() {
    console.log('Button clicked!');
  }
</script>

<svelte:head>
  <title>Footer Demo - Balance Botanica</title>
</svelte:head>

<div class="min-h-screen" style="background-color: {colors.background};">
  <!-- Demo Content -->
  <div class="p-6 max-w-4xl mx-auto">
    <header class="text-center mb-12">
      <h1 class="text-4xl font-semibold mb-4" style="color: {colors.main};">
        Footer Component Demo
      </h1>
      <p class="text-lg" style="color: {colors.text};">
        Showcasing the footer and reusable components
      </p>
    </header>
    
    <!-- Component Showcase -->
    <div class="space-y-12 mb-12">
      <!-- Input Component -->
      <section class="bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-semibold mb-6" style="color: {colors.heading};">
          Input Component
        </h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2" style="color: {colors.text};">
              Text Input
            </label>
            <Input
              type="text"
              placeholder="Enter some text..."
              value={inputValue}
              onChange={handleInputChange}
            />
            <p class="text-sm mt-2" style="color: {colors.primary};">
              Value: {inputValue}
            </p>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2" style="color: {colors.text};">
              Email Input
            </label>
            <Input
              type="email"
              placeholder="Enter your email..."
              value={emailValue}
              onChange={handleEmailChange}
            />
            <p class="text-sm mt-2" style="color: {colors.primary};">
              Value: {emailValue}
            </p>
          </div>
        </div>
      </section>
      
      <!-- Button Component -->
      <section class="bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-semibold mb-6" style="color: {colors.heading};">
          Button Component
        </h2>
        
        <div class="space-y-4">
          <div class="flex flex-wrap gap-4">
            <Button variant="primary" onClick={handleButtonClick}>
              Primary Button
            </Button>
            <Button variant="secondary" onClick={handleButtonClick}>
              Secondary Button
            </Button>
            <Button variant="outline" onClick={handleButtonClick}>
              Outline Button
            </Button>
            <Button variant="ghost" onClick={handleButtonClick}>
              Ghost Button
            </Button>
          </div>
          
          <div class="flex flex-wrap gap-4">
            <Button size="sm" onClick={handleButtonClick}>
              Small Button
            </Button>
            <Button size="md" onClick={handleButtonClick}>
              Medium Button
            </Button>
            <Button size="lg" onClick={handleButtonClick}>
              Large Button
            </Button>
          </div>
        </div>
      </section>
    </div>
  </div>
  
  <!-- Footer Component -->
  <Footer />
</div>
