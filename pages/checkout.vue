<template>
  <div>
    <Container class="pt-24 mb-40 text-center">
      <Heading tag="h3" font-style="h3">CHECKOUT PAGE</Heading>
      <Heading class="mb-4" tag="h1" font-style="h1"
        >Want to chat about the wicks?</Heading
      >

      <div class="md:flex md:space-x-8">
        <!-- Left Column -->
        <div class="md:w-1/2 mb-8 md:mb-0">
          <div class="flex space-x-4">
            <input
              class="flex-1 p-2 border rounded w-full"
              placeholder="First Name"
            />
            <input
              class="flex-1 p-2 border rounded w-full"
              placeholder="Last Name"
            />
          </div>
          <input class="w-full p-2 mt-4 border rounded" placeholder="Phone" />
          <input class="w-full p-2 mt-4 border rounded" placeholder="Email" />

          <div class="mt-4">
            <label class="inline-flex items-center">
              <input
                type="radio"
                class="form-radio"
                name="delivery"
                value="postoffice"
                v-model="delivery"
              />
              <span class="ml-2">Post Office</span>
            </label>
            <label class="inline-flex items-center ml-6">
              <input
                type="radio"
                class="form-radio"
                name="delivery"
                value="home"
                v-model="delivery"
              />
              <span class="ml-2">Home</span>
            </label>
          </div>

          <input class="w-full p-2 mt-4 border rounded" placeholder="City" />
          <input
            class="w-full p-2 mt-4 border rounded"
            placeholder="Post Office Search"
          />
          <textarea
            class="w-full p-2 mt-4 border rounded"
            placeholder="Additional Information"
          ></textarea>
        </div>

        <!-- Right Column -->
        <div class="md:w-1/2">
          <h4 class="text-xl font-semibold mb-4">Your Checkout</h4>
          <input class="w-full p-2 mt-4 border rounded" placeholder="Product" />
          <input
            class="w-full p-2 mt-4 border rounded"
            placeholder="Quantity"
          />
          <input class="w-full p-2 mt-4 border rounded" placeholder="Price" />
          <input
            class="w-full p-2 mt-4 border rounded"
            placeholder="Delivery Type"
          />
          <input class="w-full p-2 mt-4 border rounded" placeholder="Total" />

          <h4 class="text-xl font-semibold mt-8 mb-4">Payment Method</h4>
          <label class="inline-flex items-center">
            <input
              type="radio"
              class="form-radio"
              name="payment"
              value="online"
              v-model="payment"
            />
            <span class="ml-2">Online Checkout</span>
          </label>
          <label class="inline-flex items-center ml-6">
            <input
              type="radio"
              class="form-radio"
              name="payment"
              value="cash"
              v-model="payment"
            />
            <span class="ml-2">Cash NovaPoshta</span>
          </label>
          <input class="w-full p-2 mt-4 border rounded" placeholder="IBAN" />
        </div>
      </div>
    </Container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      delivery: "postoffice",
      payment: "online",
    };
  },
};
</script>
