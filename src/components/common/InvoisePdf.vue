<template>
  <div>
    <img src="/images/main_logo.png" alt="" />
    <h1>{{ invoiseData.id }}</h1>
  </div>
</template>

<script>
export default {
  props: {
    invoiseData: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
