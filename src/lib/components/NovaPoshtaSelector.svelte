<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { novaPoshtaStore, warehouses, allSettlements, isLoading, errors } from '$lib/nova-poshta/store';
  import Input from '$lib/components/Input.svelte';
  import { createPageTranslations } from '$lib/i18n/store';

  // Props
  const {
    selectedCityFullName: initialCityFullName = '',
    selectedCityName: initialCityName = '',
    selectedWarehouse: initialWarehouse = '',
    onChange
  } = $props<{
    selectedCityFullName?: string;
    selectedCityName?: string;
    selectedWarehouse?: string;
    onChange?: (data: { npCityName: string; npCityFullName: string; npWarehouse: string }) => void;
  }>();

  // Local state
  let selectedCityFullName = $state(initialCityFullName);
  let selectedCityName = $state(initialCityName);
  let selectedWarehouse = $state(initialWarehouse);

  
  // Create page translations
  const pageTranslations = createPageTranslations();
  
  // Note: Using onChange callback from props instead of event dispatcher
  
  // Local state
  let showCityDropdown = $state(false);
  let showWarehouseDropdown = $state(false);
  let citySearchQuery = $state('');
  let warehouseSearchQuery = $state('');
  let debounceTimer: NodeJS.Timeout | null = $state(null);

  // DOM references
  let cityInputRef = $state<HTMLDivElement>();
  let cityDropdownRef = $state<HTMLDivElement>();
  let warehouseInputRef = $state<HTMLDivElement>();
  let warehouseDropdownRef = $state<HTMLDivElement>();
  
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

    // Call onChange callback
    const changeData = {
      npCityName: selectedCityName,
      npCityFullName: selectedCityFullName,
      npWarehouse: selectedWarehouse
    };
    if (onChange) {
      onChange(changeData);
    }
  }
  
  // Select warehouse handler
  function selectWarehouse(warehouseName: string) {
    selectedWarehouse = warehouseName;
    showWarehouseDropdown = false;
    warehouseSearchQuery = '';

    // Call onChange callback
    const changeData = {
      npCityName: selectedCityName,
      npCityFullName: selectedCityFullName,
      npWarehouse: selectedWarehouse
    };
    if (onChange) {
      onChange(changeData);
    }
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
  let filteredWarehouses = $derived(
    warehouseSearchQuery
      ? $warehouses.filter(w => w.Description.toLowerCase().includes(warehouseSearchQuery.toLowerCase()))
      : $warehouses
  );

  // Load warehouses when city is selected but no warehouses are loaded
  $effect(() => {
    if (selectedCityName && $warehouses.length === 0 && !$isLoading) {
      novaPoshtaStore.fetchWarehouses(selectedCityName);
    }
  });
  
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
    <label for="np-city-input" class="np-label">{$pageTranslations.t('delivery.npCity') as string}</label>
    
    <!-- City Selection -->
    <div class="relative" bind:this={cityInputRef}>
      <div 
        id="np-city-input"
        class="dropdown-input" 
        class:active={showCityDropdown}
        onclick={() => {
          showCityDropdown = !showCityDropdown;
        }}
        onkeydown={(e) => {
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
        {selectedCityFullName || $pageTranslations.t('delivery.selectCity') as string}
      </div>
      
      {#if showCityDropdown}
        <div class="dropdown-container" bind:this={cityDropdownRef}>
          <input
            type="text"
            class="search-input"
            placeholder={$pageTranslations.t('delivery.searchCity') as string}
            bind:value={citySearchQuery}
            oninput={handleCityInputChange}
            aria-label={$pageTranslations.t('delivery.searchCity') as string}
          />
          
          {#if $isLoading}
            <div class="dropdown-message" role="status">
              {$pageTranslations.t('delivery.loading') as string}
            </div>
          {:else if $errors.length > 0}
            <div class="dropdown-message error" role="alert">
              {$pageTranslations.t('delivery.errorLoading') as string}
            </div>
          {:else if Object.keys($allSettlements).length === 0}
            <div class="dropdown-message">
              {$pageTranslations.t('delivery.noResults') as string}
            </div>
          {:else}
            <div class="dropdown-list" role="listbox">
              {#each Object.entries($allSettlements) as [fullName, shortName]}
                <div 
                  class="dropdown-item" 
                  class:selected={fullName === selectedCityFullName}
                  onclick={() => selectCity(fullName)}
                  onkeydown={(e) => {
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
      <label for="np-warehouse-input" class="np-label">{$pageTranslations.t('delivery.npWarehouse') as string}</label>
      
      <div class="relative" bind:this={warehouseInputRef}>
        <div 
          id="np-warehouse-input"
          class="dropdown-input" 
          class:active={showWarehouseDropdown}
        onclick={() => {
          showWarehouseDropdown = !showWarehouseDropdown;
        }}
        onkeydown={(e) => {
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
          {selectedWarehouse || $pageTranslations.t('delivery.selectWarehouse') as string}
        </div>
        
        {#if showWarehouseDropdown}
          <div class="dropdown-container" bind:this={warehouseDropdownRef}>
            <input
              type="text"
              class="search-input"
              placeholder={$pageTranslations.t('delivery.searchWarehouse') as string}
              bind:value={warehouseSearchQuery}
              oninput={handleWarehouseInputChange}
              aria-label={$pageTranslations.t('delivery.searchWarehouse') as string}
            />
            
            {#if $isLoading}
              <div class="dropdown-message" role="status">
                {$pageTranslations.t('delivery.loading') as string}
              </div>
            {:else if $errors.length > 0}
              <div class="dropdown-message error" role="alert">
                {$pageTranslations.t('delivery.errorLoading') as string}
              </div>
            {:else if $warehouses.length === 0}
              <div class="dropdown-message">
                {$pageTranslations.t('delivery.noWarehouses') as string}
              </div>
            {:else}
              <div class="dropdown-list" role="listbox">
                {#each filteredWarehouses as warehouse}
                  <div 
                    class="dropdown-item" 
                    class:selected={warehouse.Description === selectedWarehouse}
                    onclick={() => selectWarehouse(warehouse.Description)}
                    onkeydown={(e) => {
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