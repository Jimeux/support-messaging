<template>
  <v-app>
    <!--<v-app-bar app src="https://picsum.photos/1920/1080?random">
      <template v-slot:img="{ props }">
        <v-img v-bind="props"
               gradient="to top right, rgba(55,236,186,.9), rgba(25,32,72,.8)">
        </v-img>
      </template>
      <v-toolbar-title>Support</v-toolbar-title>

      <v-spacer></v-spacer>

      <template v-slot:extension>
        <v-tabs align-with-title color="white">
          <v-tab @click="$router.push('/')">Messages</v-tab>
          <v-tab @click="$router.push('about')">Notifications</v-tab>
        </v-tabs>
      </template>

    </v-app-bar>-->

    <v-snackbar v-model="snackbarText" style="max-width: 350px;margin-left: auto;" :timeout="snackbarTimeout" vertical bottom right multi-line :color="snackbarClass" class="mr-10 mb-10">
      <div style="font-size: 115%;" v-html="snackbarText"></div>
      <div class="d-flex justify-end">
      <v-btn class="d-flex" text @click="snackbarText = ''">
        Send Report
      </v-btn>
      <v-btn class="d-flex" text @click="snackbarText = ''">
        Close
      </v-btn>
      </div>
    </v-snackbar>

    <v-content>
      <router-view></router-view>
    </v-content>

  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from "vue-property-decorator";

// TODO map root state for snackbar
@Component
export default class App extends Vue {
  snackbarText = `Unable to send request. Please verify with the engineering team and try again.`;
  snackbarClass = "error";

  get snackbar(): boolean {
    return this.snackbarText !== "";
  }

  get snackbarTimeout(): number {
    switch (this.snackbarClass) {
      case "error":
        return 20000;
      default:
        return 3000;
    }
  }

}
</script>
