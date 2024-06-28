<template>
  <div class="info_list">
    <ul>
      <li>
        <div class="info_type">Name surname:</div>
        <div class="info_text full_name">
          {{ user.last_name ? `${user.name} ${user.last_name}` : user.name }}
        </div>
      </li>
      <li>
        <div class="info_type">Email address:</div>
        <div class="info_text">{{ user.email }}</div>
      </li>
      <li>
        <div class="info_type">Phone:</div>
        <div class="info_text">{{ user.phone }}</div>
      </li>
    </ul>
    <router-link
      custom
      class="edit_btn icon_edit"
      to="/profile/edit-profile"
      v-slot="{ navigate, href }"
    >
      <a :href="href" @click="navigate">Edit profile</a>
    </router-link>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
export default {
  computed: {
    ...mapGetters(["user"])
  },
  methods: {
    ...mapActions(["userGet"])
  },
  async created() {
    await this.userGet(this.user.id)
  }
}
</script>

<style></style>
