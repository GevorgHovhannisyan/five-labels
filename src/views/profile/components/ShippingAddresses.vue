<template>
  <div>
    <div class="addresses_list">
      <div
        class="address_block"
        v-for="(address, index) in addresses"
        :key="index"
        :class="{ default: address.default }"
      >
        <div class="address_info">
          {{ address.addr_name }}
        </div>
        <div class="address_actions" v-if="!address.default">
          <button
            class="choose_btn"
            aria-label="make default"
            @click="setDefaultAddress(address)"
          >
            Make default
          </button>
          <router-link
            custom
            class="edit_btn icon_edit"
            :to="`/profile/shipping-address/edit/${address.id}`"
            v-slot="{ navigate, href }"
          >
            <a :href="href" @click="navigate">Edit</a>
          </router-link>

          <button
            class="popup_btn icon_delete"
            data-popup="remove_popup"
            aria-label="popup"
            @click="
              deletedAddrId = address.id
              openConfirm = true
            "
          >
            Remove
          </button>
        </div>
        <div v-else class="address_actions">
          <span class="choose_btn _checked">Default</span>
          <router-link
            custom
            class="edit_btn icon_edit"
            :to="`/profile/shipping-address/edit/${address.id}`"
            v-slot="{ navigate, href }"
          >
            <a :href="href" @click="navigate">Edit</a>
          </router-link>

          <button
            class="popup_btn icon_delete"
            data-popup="remove_popup"
            aria-label="popup"
            @click="
              deletedAddrId = address.id
              openConfirm = true
            "
          >
            Remove
          </button>
        </div>
      </div>
    </div>
    <router-link
      custom
      class="new_address_link icon_plus"
      to="/profile/shipping-address/add"
      v-slot="{ navigate, href }"
    >
      <a :href="href" @click="navigate">Add new address</a>
    </router-link>

    <AddressRemovePopup
      :openPopup="openConfirm"
      @closePopup="openConfirm = false"
      @submitAction="removeAddr()"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import AddressRemovePopup from "@/components/common/AddressRemovePopup"
export default {
  data() {
    return {
      deletedAddrId: 1,
      openConfirm: false
    }
  },
  methods: {
    ...mapActions([
      "getAddresses",
      "deleteShippingAddress",
      "editShippingAddress"
    ]),
    async setDefaultAddress(event) {
      await this.editShippingAddress({ ...event, default: true }).then(() => {
        const deafultAddr = this.addresses.findIndex((a) => a.default)

        const index = this.addresses.findIndex((a) => a.id == event.id)
        this.addresses[index].default = true
        if (deafultAddr != -1) {
          this.addresses[deafultAddr].default = false
        }
      })
    },
    async removeAddr() {
      await this.deleteShippingAddress(this.deletedAddrId).then(() => {
        if (this.addresses.length && !this.addresses.find((p) => p.default)) {
          this.setDefaultAddress(this.addresses[0])
        }
      })
    }
  },
  async created() {
    await this.getAddresses()
  },
  computed: {
    ...mapGetters(["addresses"])
  },
  components: {
    AddressRemovePopup
  }
}
</script>

<style></style>
