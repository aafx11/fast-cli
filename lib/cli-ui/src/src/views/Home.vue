<template>
  <div class="home">
      <router-link to="/project/create">create</router-link>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Home',
  components: {

  },
  methods: {
    test() {
      console.log('按钮');
      axios.get('/api/data').then((response) => {
        console.log(response);
      });
    }
  }
};
</script>