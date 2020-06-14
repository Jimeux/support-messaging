<template>
  <v-text-field hide-details="true"
                placeholder="Search by ID or name"
                filled
                rounded
                dense
                v-model="input"
                @keydown.enter="handleSend"
  ></v-text-field>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'

@Component
export default class UserSearchBox extends Vue {
  input = ""

  get disabled(): boolean {
    return this.input === ""
  }

  handleSend() {
    if (this.disabled) {
      return
    }

    // this.onSend(this.input)
    this.input = ""
  }
}
</script>

<style>
</style>
