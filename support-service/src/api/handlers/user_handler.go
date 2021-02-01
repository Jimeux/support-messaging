package handlers

import (
	"net/http"

	"github.com/Jimeux/support-system/support-service/src/app/services"
)

type UserHandler struct {
	Handler
	userSvc *services.UserService
}

func NewUserHandler(userSvc *services.UserService) *UserHandler {
	return &UserHandler{userSvc: userSvc}
}

func (h *UserHandler) FindByID(w http.ResponseWriter, r *http.Request) {
	id := h.pathParamInt64(r, "id")
	res, err := h.userSvc.FindByID(r.Context(), id)
	if err != nil {
		h.writeError(w, r, err)
		return
	}
	h.writeJSON(w, r, res)
}

func (h *UserHandler) List(w http.ResponseWriter, r *http.Request) {
	res, err := h.userSvc.ListByMessageStatus(r.Context())
	if err != nil {
		h.writeError(w, r, err)
		return
	}
	h.writeJSON(w, r, res)
}
