package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/Jimeux/support-system/support-service/src/api/requests"

	"github.com/Jimeux/support-system/support-service/src/app/services"
)

type MessageHandler struct {
	Handler
	messageSvc *services.MessageService
}

func NewMessageHandler(messageSvc *services.MessageService) *MessageHandler {
	return &MessageHandler{messageSvc: messageSvc}
}

func (h *MessageHandler) FindByUserID(w http.ResponseWriter, r *http.Request) {
	userID := h.pathParamInt64(r, "id")
	offset, limit := h.paginationParams(r)
	res, err := h.messageSvc.FindByUserID(r.Context(), userID, offset, limit)
	if err != nil {
		h.writeError(w, r, err)
		return
	}
	h.writeJSON(w, r, res)
}

func (h *MessageHandler) CreateMessage(w http.ResponseWriter, r *http.Request) {
	var req requests.MessageCreateText
	// TODO 2021/01/12 @Jimeux validation
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.writeError(w, r, err)
		return
	}
	res, err := h.messageSvc.CreateText(r.Context(), req)
	if err != nil {
		h.writeError(w, r, err)
		return
	}
	h.writeJSON(w, r, res)
}

func (h *MessageHandler) DeleteByID(w http.ResponseWriter, r *http.Request) {
	id := h.pathParamInt64(r, "id")
	if err := h.messageSvc.DeleteByID(r.Context(), id); err != nil {
		h.writeError(w, r, err)
		return
	}
	h.writeNoContent(w)
}
