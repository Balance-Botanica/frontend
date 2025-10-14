<script>
    export let data;
</script>

<div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Environment Variables Test</h1>
    
    <div class="bg-gray-100 p-4 rounded">
        <h2 class="text-xl font-semibold mb-2">Environment Variables Status</h2>
        
        <div class="space-y-2">
            <div>
                <span class="font-medium">POCKETBASE_ENABLED:</span>
                <span class="ml-2 px-2 py-1 rounded bg-blue-100 text-blue-800">
                    {data.pocketbaseEnabled || 'Not set'}
                </span>
            </div>
            
            <div>
                <span class="font-medium">POCKETBASE_URL:</span>
                <span class="ml-2 px-2 py-1 rounded bg-blue-100 text-blue-800">
                    {data.pocketbaseUrl || 'Not set'}
                </span>
            </div>
            
            <div>
                <span class="font-medium">DATABASE_URL:</span>
                <span class="ml-2 px-2 py-1 rounded bg-blue-100 text-blue-800">
                    {data.databaseUrl || 'Not set'}
                </span>
            </div>
        </div>
        
        <div class="mt-4 p-3 bg-yellow-100 rounded">
            <p class="text-yellow-800">
                Check the server console for detailed environment variable information.
            </p>
        </div>
    </div>
</div>