<template>
  <ValidationObserver
    ref="edit_address_form"
    slim
    v-slot="{ handleSubmit, reset }"
  >
    <form
      class="account_form custom_address_form"
      @submit.prevent="handleSubmit(updateAddress)"
      @reset.prevent="reset"
    >
      <div class="fields_group">
        <!-- <ValidationProvider
          name="country"
          v-slot="{ errors }"
          slim
          rules="required"
        > -->
        <div class="field_block">
          <label>
            <span class="field_name">Country</span>
            <v-select
              v-model="country"
              :options="countries"
              :clearable="false"
              disabled
              :searchable="false"
              label="english_name"
              :selectable="(option) => option.alpha2_code === 'US'"
              :reduce="(country) => country.alpha2_code"
            >
              <template #open-indicator="{ attributes }">
                <span v-bind="attributes" class="icon_down"></span>
              </template>
            </v-select>
          </label>
        </div>

        <ValidationProvider
          name="state"
          v-slot="{ errors }"
          slim
          rules="required"
        >
          <div class="field_block" :class="{ has_error: errors[0] }">
            <span class="field_name">State</span>
            <!-- <label> -->

            <v-select
              v-model="state"
              :options="states"
              :clearable="false"
              label="name"
              name="state"
              :reduce="(state) => state.code"
            >
              <template #open-indicator="{ attributes }">
                <span v-bind="attributes" class="icon_down"></span>
              </template>
            </v-select>
            <span class="error_message">{{ errors[0] }}</span>
          </div>
        </ValidationProvider>

        <!-- </ValidationProvider> -->

        <div class="field_block" :class="{ has_error: addressError }">
          <label>
            <vue-google-autocomplete
              ref="address"
              name="address"
              v-model="address_line"
              v-on:keypress="keypress"
              v-on:focus="focusAutoComplete"
              id="map"
              classname="form-control"
              placeholder="Please type your address"
              v-on:placechanged="getAddressData"
              country="us"
            >
            </vue-google-autocomplete>

            <span class="field_name">Address line</span>
          </label>
          <span class="error_message" v-if="addressError">{{
            addressError
          }}</span>
        </div>

        <ValidationProvider
          name="city"
          v-slot="{ errors }"
          slim
          rules="required"
        >
          <div class="field_block" :class="{ has_error: errors[0] }">
            <label>
              <input
                v-model="edit_address.city"
                type="text"
                @input="checkLength(edit_address.city, 'city')"
                name="city"
                placeholder="Ex. Portland"
              />
              <span class="field_name">City</span>
            </label>
            <span class="error_message">{{ errors[0] }}</span>
          </div>
        </ValidationProvider>

        <div class="field_block">
          <label>
            <input
              type="text"
              v-model="address2"
              ref="address_line_2"
              name="address-2"
              placeholder="Please type your address 2"
            />
            <span class="field_name">Address line 2</span>
          </label>
        </div>
        <ValidationProvider
          name="zip_code"
          v-slot="{ errors }"
          slim
          rules="required"
        >
          <div class="field_block" :class="{ has_error: errors[0] }">
            <label>
              <input
                type="text"
                name="zip_code"
                v-model="edit_address.postal_code"
                @input="checkNumber($event)"
                placeholder="Ex. 94723"
              />
              <!-- oninput="this.value=this.value.replace(/[^0-9]/g,'');" -->
              <span class="field_name">Zip / Postal code</span>
            </label>
            <span class="error_message">{{ errors[0] }}</span>
          </div>
        </ValidationProvider>

        <!-- <div class="additional_field">
          <label class="checkbox_label">
            <input
              v-model="edit_address.default_address"
              type="checkbox"
              name="set_default"
            />
            <span class="check_btn">Set as default</span>
          </label>
        </div> -->
      </div>
      <div class="actions_block">
        <router-link custom class="cancel_btn" to="/profile/shipping-addresses">
          Cancel
        </router-link>
        <!-- <button class="cancel_btn" aria-label="cancel">Cancel</button> -->
        <button class="save_btn" aria-label="save">Save</button>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import VueGoogleAutocomplete from "vue-google-autocomplete"
import countries from "@/helpers/countries.json"
import states from "@/helpers/states.json"

export default {
  data() {
    return {
      country: "US",
      state: "CA",
      city: null,
      region: null,
      zip_code: null,
      default_address: false,
      address_line: null,
      countries: countries,
      states,
      saveAddress: null,
      address_correct: true,
      addressError: false,
      address2: null
    }
  },
  computed: {
    ...mapGetters(["user", "edit_address"])
  },
  methods: {
    ...mapActions(["getShippingAddress", "editShippingAddress"]),
    async updateAddress() {
      if (!this.address_correct) {
        this.addressError = "Address is invalid"
        return false
      }
      const payload = {
        id: this.edit_address.id,
        user_id: this.edit_address.user_id,
        country: this.country,
        city: this.edit_address.city,
        // region: this.edit_address.region,
        address: this.address_line,
        state: this.state,
        postal_code: this.edit_address.postal_code,
        address2: this.address2,
        default: this.edit_address.default_address
      }

      await this.editShippingAddress(payload)
        .then(() => {
          this.$router.push("/profile/shipping-addresses")
        })
        .catch((error) => {
          if (error && error.response.data) {
            const message = error.response.data.message
            if (message && message === "Invalid zip code") {
              this.$refs.edit_address_form.setErrors({ zip_code: message })
            }
          }
          setTimeout(() => {
            this.$store.commit("SHOW_LOADING", false)
          }, 250)
        })
    },
    checkLength(event, type) {
      if (type === "country") {
        this.edit_address[type] = event.slice(0, 35)
      } else if (type === "city") {
        this.edit_address[type] = event.slice(0, 35)
      } else if (type === "region") {
        this.edit_address[type] = event.slice(0, 35)
      } else if (type === "postal_code") {
        this.edit_address[type] = event.slice(0, 5)
      }
    },
    checkNumber(event) {
      let value = event.target.value
      if (value.length < 5) {
        this.edit_address.postal_code = value.replace(/[^0-9]/g, "")
      } else {
        this.edit_address.postal_code = value.replace(/[^0-9]/g, "").slice(0, 5)
      }
    },
    getAddressData(addressData, placeResultData) {
      this.saveAddress = addressData

      let cityName = ""
      if (
        placeResultData &&
        placeResultData.address_components &&
        placeResultData.address_components
      ) {
        const components = placeResultData.address_components
        components.find((comp) => {
          if (comp.types && comp.types.length) {
            if (comp.types.includes("neighborhood")) {
              cityName = comp.long_name
                ? comp.long_name
                : comp.short_name
                ? comp.short_name
                : ""
            } else if (
              comp.types.includes("locality") &&
              comp.types.includes("political")
            ) {
              cityName = comp.long_name
                ? comp.long_name
                : comp.short_name
                ? comp.short_name
                : ""
            }
          }
        })
      }

      if (cityName) {
        this.edit_address.city = cityName
      }

      if (addressData.administrative_area_level_1) {
        this.state = addressData.administrative_area_level_1
      }

      if (addressData.route) {
        setTimeout(() => {
          this.$refs.address.update(addressData.route)
          this.address_line = addressData.route
          if (addressData.street_number) {
            this.$refs.address.update(
              addressData.street_number + " " + addressData.route
            )
            this.address_line =
              addressData.street_number + " " + addressData.route
          } else {
            this.$refs.address.update(addressData.route)
            this.address_line = addressData.route
          }
        }, 100)
      }

      if (addressData.postal_code) {
        this.edit_address.postal_code = addressData.postal_code
      }
    },
    keypress() {
      this.addressError = false
      this.address_correct = false
    },
    focusAutoComplete() {
      if (!this.address_correct && this.saveAddress) {
        this.addressError = false
        this.getAddressData(this.saveAddress)
      }
    }
  },
  async created() {
    await this.getShippingAddress(this.$route.params.id).then(() => {
      if (this.edit_address.address) {
        this.address_line = this.edit_address.address
      }
      if (this.edit_address.address2) {
        this.address2 = this.edit_address.address
      }
      if (this.edit_address.address2) {
        this.address2 = this.edit_address.address2
      }

      if (this.edit_address.state) {
        this.state = this.edit_address.state
      }
    })
  },
  components: {
    VueGoogleAutocomplete
  }
}
</script>
