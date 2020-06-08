<template>
  <v-footer style="border-top: 1px solid rgba(255, 255, 255, 0.12); background: transparent;" class="pa-7">
    <v-btn class="d-flex mr-1" icon>
      <v-icon color="primary">photo</v-icon>
    </v-btn>
    <v-btn class="d-flex mr-4" icon>
      <v-icon color="primary">article</v-icon>
    </v-btn>

    <v-text-field class="d-flex mr-4"
                  hide-details="true"
                  placeholder="Type a message and press enter"
                  filled
                  rounded
                  dense
                  v-model="input"
                  @keydown.enter="handleSend"
    ></v-text-field>
    <v-btn class="d-flex" icon :disabled="sendDisabled()">
      <v-icon @click="handleSend" color="primary">send</v-icon>
    </v-btn>
  </v-footer>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';

@Component
export default class MessageBox extends Vue {
  @Prop() onSend!: (text: string) => void;

  input = ""

  sendDisabled(): boolean {
    return this.input === ""
  }

  handleSend() {
    if (this.sendDisabled()) {
      return
    }

    this.onSend(this.input)
    this.input = ""
  }
}
</script>

<style>
</style>
