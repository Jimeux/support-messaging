export class UserSummary {
    constructor(data) {
        this.userId = data.user_id;
        this.firstName = data.first_name;
        this.lastName = data.last_name;
        this.avatar = data.avatar;
        this.lastSent = data.last_sent;
        this.unreadCount = data.unread_count;
        this.preview = data.preview;
    }
    displayName() {
        return this.firstName + " " + this.lastName;
    }
}
export class User {
    constructor(data) {
        this.id = data.id;
        this.firstName = data.first_name;
        this.lastName = data.last_name;
        this.avatar = data.avatar;
        this.location = "Tokyo";
        this.gender = "M";
        this.registrationDate = "";
        this.profile = "Profile";
        this.notes = "Notes";
    }
    displayName() {
        return this.firstName + " " + this.lastName;
    }
}
//# sourceMappingURL=user.js.map