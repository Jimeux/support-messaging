export default class Message {
    constructor(data) {
        this.id = data.id;
        this.userId = data.user_id;
        this.staffId = data.staff_id;
        this.status = data.status;
        this.contentType = data.content_type;
        this.content = data.content;
        this.sentAt = data.sent_at;
        this.fromUser = data.from_user;
    }
}
export var MessageClass;
(function (MessageClass) {
    MessageClass[MessageClass["FIRST"] = 0] = "FIRST";
    MessageClass[MessageClass["MIDDLE"] = 1] = "MIDDLE";
    MessageClass[MessageClass["LAST"] = 2] = "LAST";
    MessageClass[MessageClass["ONLY"] = 3] = "ONLY";
})(MessageClass || (MessageClass = {}));
export class MessageView {
    constructor(m, klass, date) {
        this.message = m;
        this.klass = klass;
        this.date = date;
    }
}
export class Messages {
    static toMessageViews(mm) {
        const len = mm.length;
        let currentDate = null;
        const views = Array();
        for (let i = 0; i < len; i++) {
            const prev = i > 0 ? mm[i - 1] : null;
            const next = i < len - 1 ? mm[i + 1] : null;
            const current = mm[i];
            let dateToSet = null;
            let dateHasBeenSet = false;
            const currentUnix = new Date(current.sentAt).getTime() / 1000;
            let nextIsGreater = false;
            if (next != null) {
                const nextUnix = new Date(next.sentAt).getTime() / 1000;
                const nextDiff = nextUnix - currentUnix;
                if (60 * 60 * 2 < nextDiff) {
                    nextIsGreater = true;
                }
            }
            if (currentDate != null) {
                const currentDateUnix = new Date(currentDate).getTime() / 1000;
                const diff = currentUnix - currentDateUnix;
                if (60 * 60 * 2 < diff) {
                    currentDate = current.sentAt;
                    dateToSet = new Date(current.sentAt);
                    dateHasBeenSet = true;
                }
            }
            else {
                currentDate = current.sentAt;
                dateToSet = new Date(current.sentAt);
                dateHasBeenSet = true;
            }
            let klass;
            if ((prev == null || prev.fromUser !== current.fromUser || dateHasBeenSet) &&
                (next == null || next.fromUser !== current.fromUser || nextIsGreater))
                klass = MessageClass.ONLY;
            else if (prev == null || prev.fromUser !== current.fromUser || dateHasBeenSet)
                klass = MessageClass.FIRST;
            else if ((prev.fromUser === current.fromUser) && (next != null && next.fromUser === current.fromUser && !nextIsGreater))
                klass = MessageClass.MIDDLE;
            else
                klass = MessageClass.LAST; //
            views.push(new MessageView(current, klass, dateToSet));
        }
        return views;
    }
}
//# sourceMappingURL=message.js.map