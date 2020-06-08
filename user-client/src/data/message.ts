export default class Message {
  readonly id: number;
  readonly userId: number;
  readonly fromUser: boolean;
  readonly avatar: string;
  readonly text: string;
  readonly sendTime: string

  constructor(id: number, userId: number, fromUser: boolean, text: string, avatar: string, sendTime: string) {
    this.id = id;
    this.userId = userId;
    this.fromUser = fromUser;
    this.avatar = avatar;
    this.text = text;
    this.sendTime = sendTime;
  }
}

export enum MessageClass {
  FIRST,
  MIDDLE,
  LAST,
  ONLY
}

export class MessageView {
  message: Message;
  klass: MessageClass;
  date: Date | null;

  constructor(m: Message, klass: MessageClass, date: Date | null) {
    this.message = m;
    this.klass = klass;
    this.date = date;
  }
}

export class Messages {
  static toMessageViews(mm: Array<Message>): Array<MessageView> {
    const len = mm.length

    let currentDate: string | null = null
    const views = Array<MessageView>();
    for (let i = 0; i < len; i++) {
      const prev = i > 0 ? mm[i - 1] : null;
      const next = i < len - 1 ? mm[i + 1] : null;
      const current = mm[i]

      let dateToSet: Date | null = null;
      let dateHasBeenSet = false;

      const currentUnix = new Date(current.sendTime).getTime() / 1000;
      let nextIsGreater = false;
      if (next != null) {
        const nextUnix = new Date(next.sendTime).getTime() / 1000;
        const nextDiff = currentUnix - nextUnix;
        if (60 * 60 * 2 < nextDiff) {
          nextIsGreater = true;
        }
      }


      if (currentDate != null) {
        const currentDateUnix = new Date(currentDate).getTime() / 1000;

        const diff = currentUnix - currentDateUnix;
        if (60 * 60 * 2 < diff) {
          currentDate = current.sendTime;
          dateToSet = new Date(current.sendTime);
          dateHasBeenSet = true;
        }
      } else {
        currentDate = current.sendTime;
        dateToSet = new Date(current.sendTime);
        dateHasBeenSet = true;
      }

      let klass: MessageClass;
      if ((prev == null || prev.fromUser !== current.fromUser || dateHasBeenSet) &&
          (next == null || next.fromUser !== current.fromUser || nextIsGreater))
        klass = MessageClass.ONLY;
      else if (prev == null || prev.fromUser !== current.fromUser || dateHasBeenSet)
        klass = MessageClass.FIRST;
      else if ((prev.fromUser === current.fromUser) && (next != null && next.fromUser === current.fromUser && !nextIsGreater))
        klass = MessageClass.MIDDLE;
      else
        klass = MessageClass.LAST; // ;

      views.push(new MessageView(current, klass, dateToSet));
    }
    return views;
  }
}
