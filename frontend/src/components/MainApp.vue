<template>
  <div class="container">
    <h1>Welcome to Your Vue.js Web Scraper App. Made by Even Yohans</h1>
    <input type="number" v-model="priceFilter" placeholder="Enter max price" />
    <button @click="fetchData">Fetch Data</button>
    <p v-if="loading">Loading...</p>
    <table v-if="filteredResults.length && !loading" class="comparison-table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Title</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in filteredResults" :key="index">
          <td><img :src="item.image" alt="Product Image" class="product-image" /></td>
          <td>{{ item.title }}</td>
          <td class="price">{{ item.price }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>No data fetched yet.</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      results: [],
      priceFilter: '',
      loading: false
    };
  },
  computed: {
    filteredResults() {
      if (!this.priceFilter) {
        return this.results;
      }
      const maxPrice = parseFloat(this.priceFilter);
      return this.results.filter(item => parseFloat(item.price.replace('$', '')) <= maxPrice);
    }
  },
  methods: {
    async fetchData() {
      this.loading = true; // Set loading to true while waiting for data
      try {
        const response = await axios.get('http://localhost:5000/scrape');
        console.log('Fetched data:', response.data); // Log the fetched data
        if (response.data.success) {
          this.results = response.data.data;
          console.log('Results:', this.results); // Log the results
        } else {
          console.error('Error in response data:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        this.loading = false; // Set loading to false after data is fetched
      }
    }
  }
};
</script>

<style>
.container {
  text-align: center;
  margin-top: 20px;
}
input {
  margin-bottom: 20px;
  padding: 10px;
  width: 200px;
}
button {
  margin-bottom: 20px;
  padding: 10px 15px;
  cursor: pointer;
}
.comparison-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
.comparison-table th, .comparison-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}
.product-image {
  width: 50px;
  height: 50px;
}
.price {
  font-weight: bold;
}
</style>
