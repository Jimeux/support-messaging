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
import {Component, Prop, Vue} from 'vue-property-decorator'

@Component
export default class UserSearchBox extends Vue {
  @Prop({required: true})
  readonly onSearch!: (id: number) => void

  input = ""

  get disabled(): boolean {
    return this.input === ""
  }

  handleSend() {
    if (!this.disabled) {
      const id = parseInt(this.input, 10)
      if (isNaN(id))
        console.log(this.input)
      else {
        this.onSearch(id)
      }

      // this.input = ""
    }
  }
}
</script>

<style>
</style>
