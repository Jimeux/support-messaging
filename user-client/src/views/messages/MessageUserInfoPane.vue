<template>
  <div v-if="users.activeUser != null" :style="`overflow-y: auto; height: ` + height + `px;`">
    <div class="pa-3" style="text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.12);">
      <v-list-item-avatar size="100px">
        <v-img :src="users.activeUser.avatar"></v-img>
      </v-list-item-avatar>
      <div class="mt-2 mb-1">{{users.activeUser.name}}</div>
      <small class="mb-2 grey--text">Active 10 minutes ago</small>
    </div>
    <div style="border-bottom: 1px solid rgba(255, 255, 255, 0.12);" class="pl-1">
      <v-list style="background: transparent;">
        <v-list-item dense
                     v-for="item in [
                          {title: users.activeUser.location, icon: 'location_on', color: 'pink'},
                          {title: users.activeUser.id, icon: 'fingerprint', color: 'primary'},
                          {title: users.activeUser.gender, icon: 'wc', color: 'primary'},
                          {title: users.activeUser.registrationDate.split('T')[0], icon: 'event', color: 'primary'},
                      ]"
                     :key="item.title"
        >
          <v-list-item-icon>
            <v-icon v-if="item.icon" :color="item.color">{{item.icon}}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>
    <div>
      <v-expansion-panels flat>
        <v-expansion-panel style="border-bottom: 1px solid rgba(255, 255, 255, 0.12); background: transparent;">
          <v-expansion-panel-header disable-icon-rotate>
            Profile
            <template v-slot:actions>
              <v-icon>portrait</v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            {{users.activeUser.profile}}}
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel style="background: transparent;">
          <v-expansion-panel-header disable-icon-rotate>
            Notes
            <template v-slot:actions>
              <v-icon>note</v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            {{users.activeUser.notes}}}
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {mapActions, mapState} from "vuex";
import {UserNamespace, UserState} from "@/store/modules/users";

@Component({
  components: {
  },
  computed: {...mapState([UserNamespace])},
  methods: {...mapActions(UserNamespace, [])}
})
export default class MessageUserInfoPane extends Vue {
  users!: UserState;
  height = 500;

  mounted() {
    this.setHeight();
    // todo avoid multiple
    window.addEventListener('resize', this.setHeight.bind(this));
  }

  setHeight() {
    const appBarHeight = this.getHeightByClass('v-app-bar');
    const toolbarHeight = 64;
    this.height = window.innerHeight - appBarHeight - toolbarHeight;
  }

  getHeightByClass(className: string): number {
    const elements = document.getElementsByClassName(className)
    return elements.length === 0 ? 0 : (elements[0] as HTMLElement).offsetHeight;
  }
}
</script>
