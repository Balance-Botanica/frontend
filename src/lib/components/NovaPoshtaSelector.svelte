<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { novaPoshtaStore, warehouses, allSettlements, isLoading, errors } from '$lib/nova-poshta/store';
  import Input from '$lib/components/Input.svelte';
  import { createPageTranslations } from '$lib/i18n/store';

  // Export props
  export let selectedCityFullName = '';
  export let selectedCityName = '';
  export let selectedWarehouse = '';
  
  // Create page translations
  const pageTranslations = createPageTranslations();
  
  // Event dispatcher
  const dispatch = createEventDispatcher<{
    change: { npCityName: string; npCityFullName: string; npWarehouse: string }
  }>();
  
  // Local state
  let showCityDropdown = false;
  let showWarehouseDropdown = false;
  let citySearchQuery = '';
  let warehouseSearchQuery = '';
  let debounceTimer: NodeJS.Timeout | null = null;
  
  // DOM references
  let cityInputRef: HTMLDivElement;
  let cityDropdownRef: HTMLDivElement;
  let warehouseInputRef: HTMLDivElement;
  let warehouseDropdownRef: HTMLDivElement;
  
  // Handle city search input
  function handleCityInputChange() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      novaPoshtaStore.fetchSettlements(citySearchQuery);
    }, 300);
  }
  
  // Handle warehouse search input
  function handleWarehouseInputChange() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (warehouseSearchQuery.trim() !== '') {
        // Filter warehouses locally based on search query
        // We already have all warehouses for the city loaded
      }
    }, 300);
  }
  
  // Select city handler
  function selectCity(cityFullName: string) {
    const cityName = $allSettlements[cityFullName];
    selectedCityFullName = cityFullName;
    selectedCityName = cityName;
    showCityDropdown = false;
    citySearchQuery = '';
    
    // Fetch warehouses for selected city
    novaPoshtaStore.fetchWarehouses(cityName);
    
    // Clear selected warehouse when city changes
    selectedWarehouse = '';
    
    // Dispatch change event
    dispatch('change', { 
      npCityName: selectedCityName, 
      npCityFullName: selectedCityFullName, 
      npWarehouse: selectedWarehouse 
    });
  }
  
  // Select warehouse handler
  function selectWarehouse(warehouseName: string) {
    selectedWarehouse = warehouseName;
    showWarehouseDropdown = false;
    warehouseSearchQuery = '';
    
    // Dispatch change event
    dispatch('change', { 
      npCityName: selectedCityName, 
      npCityFullName: selectedCityFullName, 
      npWarehouse: selectedWarehouse 
    });
  }
  
  // Handle outside clicks to close dropdowns
  function handleOutsideClick(event: MouseEvent) {
    if (cityInputRef && cityDropdownRef && showCityDropdown) {
      if (!cityInputRef.contains(event.target as Node) && !cityDropdownRef.contains(event.target as Node)) {
        showCityDropdown = false;
      }
    }
    
    if (warehouseInputRef && warehouseDropdownRef && showWarehouseDropdown) {
      if (!warehouseInputRef.contains(event.target as Node) && !warehouseDropdownRef.contains(event.target as Node)) {
        showWarehouseDropdown = false;
      }
    }
  }
  
  // Filter warehouses based on search query
  $: filteredWarehouses = warehouseSearchQuery 
    ? $warehouses.filter(w => w.Description.toLowerCase().includes(warehouseSearchQuery.toLowerCase()))
    : $warehouses;
  
  // Load warehouses when city is selected but no warehouses are loaded
  $: if (selectedCityName && $warehouses.length === 0 && !$isLoading) {
    novaPoshtaStore.fetchWarehouses(selectedCityName);
  }
  
  // Set up event listeners
  onMount(() => {
    document.addEventListener('click', handleOutsideClick);
    
    // Load warehouses if city is already selected
    if (selectedCityName) {
      novaPoshtaStore.fetchWarehouses(selectedCityName);
    }
    
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  });
</script>

{#if $pageTranslations}
<div class="nova-poshta-selector">
  <div class="np-section">
    <label for="np-city-input" class="np-label">{$pageTranslations.t('delivery.npCity')}</label>
    
    <!-- City Selection -->
    <div class="relative" bind:this={cityInputRef}>
      <div 
        id="np-city-input"
        class="dropdown-input" 
        class:active={showCityDropdown}
        on:click={() => showCityDropdown = !showCityDropdown}
        on:keydown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            showCityDropdown = !showCityDropdown;
          }
        }}
        role="button"
        tabindex="0"
        aria-haspopup="listbox"
        aria-expanded={showCityDropdown}
      >
        {selectedCityFullName || $pageTranslations.t('delivery.selectCity')}
      </div>
      
      {#if showCityDropdown}
        <div class="dropdown-container" bind:this={cityDropdownRef}>
          <input
            type="text"
            class="search-input"
            placeholder={$pageTranslations.t('delivery.searchCity')}
            bind:value={citySearchQuery}
            on:input={handleCityInputChange}
            aria-label={$pageTranslations.t('delivery.searchCity')}
          />
          
          {#if $isLoading}
            <div class="dropdown-message" role="status">
              {$pageTranslations.t('delivery.loading')}
            </div>
          {:else if $errors.length > 0}
            <div class="dropdown-message error" role="alert">
              {$pageTranslations.t('delivery.errorLoading')}
            </div>
          {:else if Object.keys($allSettlements).length === 0}
            <div class="dropdown-message">
              {$pageTranslations.t('delivery.noResults')}
            </div>
          {:else}
            <div class="dropdown-list" role="listbox">
              {#each Object.entries($allSettlements) as [fullName, shortName]}
                <div 
                  class="dropdown-item" 
                  class:selected={fullName === selectedCityFullName}
                  on:click={() => selectCity(fullName)}
                  on:keydown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      selectCity(fullName);
                    }
                  }}
                  role="option"
                  tabindex="0"
                  aria-selected={fullName === selectedCityFullName}
                >
                  {fullName}
                </div>
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>
  
  <!-- Warehouse Selection (only show if city is selected) -->
  {#if selectedCityName}
    <div class="np-section">
      <label for="np-warehouse-input" class="np-label">{$pageTranslations.t('delivery.npWarehouse')}</label>
      
      <div class="relative" bind:this={warehouseInputRef}>
        <div 
          id="np-warehouse-input"
          class="dropdown-input" 
          class:active={showWarehouseDropdown}
          on:click={() => showWarehouseDropdown = !showWarehouseDropdown}
          on:keydown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              showWarehouseDropdown = !showWarehouseDropdown;
            }
          }}
          role="button"
          tabindex="0"
          aria-haspopup="listbox"
          aria-expanded={showWarehouseDropdown}
        >
          {selectedWarehouse || $pageTranslations.t('delivery.selectWarehouse')}
        </div>
        
        {#if showWarehouseDropdown}
          <div class="dropdown-container" bind:this={warehouseDropdownRef}>
            <input
              type="text"
              class="search-input"
              placeholder={$pageTranslations.t('delivery.searchWarehouse')}
              bind:value={warehouseSearchQuery}
              on:input={handleWarehouseInputChange}
              aria-label={$pageTranslations.t('delivery.searchWarehouse')}
            />
            
            {#if $isLoading}
              <div class="dropdown-message" role="status">
                {$pageTranslations.t('delivery.loading')}
              </div>
            {:else if $errors.length > 0}
              <div class="dropdown-message error" role="alert">
                {$pageTranslations.t('delivery.errorLoading')}
              </div>
            {:else if $warehouses.length === 0}
              <div class="dropdown-message">
                {$pageTranslations.t('delivery.noWarehouses')}
              </div>
            {:else}
              <div class="dropdown-list" role="listbox">
                {#each filteredWarehouses as warehouse}
                  <div 
                    class="dropdown-item" 
                    class:selected={warehouse.Description === selectedWarehouse}
                    on:click={() => selectWarehouse(warehouse.Description)}
                    on:keydown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        selectWarehouse(warehouse.Description);
                      }
                    }}
                    role="option"
                    tabindex="0"
                    aria-selected={warehouse.Description === selectedWarehouse}
                  >
                    {warehouse.Description}
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>
{/if}

<style>
  .nova-poshta-selector {
    width: 100%;
  }
  
  .np-section {
    margin-bottom: 1rem;
  }
  
  .np-label {
    display: block;
    font-family: 'Nunito', sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.5;
    color: #9A9A9A;
    margin-bottom: 8px;
  }
  
  .dropdown-input {
    border: 1px solid #d1d5db;
    background-color: #ffffff;
    border-radius: 0.25rem;
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    font-size: 16px;
    color: #4a4a4a;
    cursor: pointer;
    transition: border 0.3s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) inset;
  }
  
  .dropdown-input:hover {
    border-color: #b1b5bb;
  }
  
  .dropdown-input.active {
    border-color: #4B766E;
  }
  
  .dropdown-container {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 4px;
    background-color: white;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    z-index: 50;
    max-height: 300px;
    overflow: hidden;
  }
  
  .search-input {
    width: calc(100% - 16px);
    margin: 8px;
    padding: 8px;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    font-size: 14px;
  }
  
  .search-input:focus {
    outline: none;
    border-color: #4B766E;
  }
  
  .dropdown-list {
    max-height: 230px;
    overflow-y: auto;
  }
  
  .dropdown-item {
    padding: 8px 12px;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 14px;
  }
  
  .dropdown-item:hover {
    background-color: #f3f4f6;
  }
  
  .dropdown-item.selected {
    background-color: #e5eeed;
    color: #4B766E;
    font-weight: 500;
  }
  
  .dropdown-message {
    padding: 12px;
    text-align: center;
    color: #6b7280;
    font-size: 14px;
  }
  
  .dropdown-message.error {
    color: #ef4444;
  }
  
  .relative {
    position: relative;
  }
</style>