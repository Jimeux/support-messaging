<template>
  <v-app>
<!--
    <v-app-bar app src="https://picsum.photos/1920/1080?random">
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

    </v-app-bar>
-->

    <v-snackbar v-model="snackbar" style="max-width: 390px; margin-left: auto;"
                :timeout="snackbarTimeout"
                :color="$store.state.snackbarClass"
                class="mr-10 mt-10"
                top right multi-line>
      <div style="font-size: 110%;" v-html="$store.state.snackbarContent"></div>
      <!--todo v-for snackbarContents -->
      <!--<div style="font-size: 115%;" class="mt-4" v-html="$store.state.snackbarContent"></div>-->
      <!--<div class="d-flex justify-end">-->
        <v-btn class="d-flex" text @click="clearSnackbar">
          Close
        </v-btn>
      <!--</div>-->
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
  get snackbar(): boolean {
    return this.$store.state.snackbarContent !== "";
  }

  set snackbar(val: boolean) {
    this.$store.dispatch("clearSnackbar");
  }

  get snackbarTimeout(): number {
    switch (this.$store.state.snackbarClass) {
      case "error":
        return 10000;
      default:
        return 3000;
    }
  }

  clearSnackbar() {
    this.$store.dispatch("clearSnackbar");
  }

}
</script>
