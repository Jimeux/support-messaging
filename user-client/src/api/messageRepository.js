import Message from "@/data/message";
import axios from "axios";
export default class MessageRepository {
    async fetchMessages(userId, page) {
        const response = await axios.get(`/api/v1/users/${userId}/messages?page=${page}&limit=20`);
        return response.data.messages.map((m) => new Message(m));
    }
}
//# sourceMappingURL=messageRepository.js.map