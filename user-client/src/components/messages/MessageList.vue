<template>
  <div @scroll="onScroll"
       class="message-list pa-4"
       :style="`overflow-y: auto; height: ` + height + `px;`">

    <div style="text-align: center;">
      <v-progress-circular v-if="loadingPage" style="text-align: center;"
                           :size="messages.length === 0 ? 50 : 25"
                           :width="messages.length === 0 ? 5 : 2"
                           indeterminate
                           ref="loader"
                           :style="`margin-top: ${loadingMargin}px; margin-bottom: 25px;`"
      ></v-progress-circular>
    </div>

    <MessageBubble v-for="m in convertedMessages" :ref="`bubbles`" :message="m" :key="m.id"/>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import Message, {Messages, MessageView} from "@/data/message";
import MessageBubble from "@/components/messages/MessageBubble.vue";

@Component({
  components: {MessageBubble}
})
export default class MessageList extends Vue {
  @Prop({required: true})
  messages!: Array<Message>;
  @Prop({required: true})
  onScrollToTop!: () => void;
  @Prop()
  currentMessageId!: number | null;
  @Prop()
  loadingPage!: boolean;

  init = true;
  height = 500;

  mounted() {
    this.$nextTick(() => this.setHeight());
    window.addEventListener('resize', this.setHeight.bind(this));
  }

  updated() {
    // FIXME need an init pattern, and also for individual messages (self sent or Pusher)
    if (this.messages.length === 0) {
      this.init = true;
    }
    if (this.init && this.messages.length !== 0) {
      this.init = false;
      this.$nextTick(() => this.setHeight());
    }

    if (this.currentMessageId != null) {
      const found = (this.$refs["bubbles"] as Array<Vue>);
      for (const e of found) {
        const el = (e.$el as HTMLElement);
        if (parseInt(el.id, 10) === this.currentMessageId)
          this.$nextTick(() => this.$el.scrollTop = el.offsetTop - 64 - 64);
      }
    }
  }

  get loadingMargin(): number {
    return this.messages.length === 0 ? this.height / 2 - 50 : 20;
  }

  get convertedMessages(): Array<MessageView> {
    // FIXME store getter
    return Messages.toMessageViews(this.messages);
  }

  onScroll() {
    if (!this.loadingPage && this.$el.scrollTop === 0) {
      this.onScrollToTop();
    }
  }

  setHeight() {
    const appBarHeight = this.getHeightByClass('v-app-bar');
    const footerHeight = this.getHeightByClass('v-footer');
    const toolbarHeight = 64;
    this.height = window.innerHeight - appBarHeight - footerHeight - toolbarHeight;

    if (this.$el.lastElementChild) {
      this.$el.scrollTop = (this.$el.lastElementChild as HTMLElement).offsetTop;
    }
  }

  getHeightByClass(className: string): number {
    const elements = document.getElementsByClassName(className);
    return elements.length === 0 ? 0 : (elements[0] as HTMLElement).offsetHeight;
  }
}
</script>
