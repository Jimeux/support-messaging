package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/go-chi/chi"
)

type Handler struct{}

func (h *Handler) pathParamInt64(r *http.Request, key string) int64 {
	param := chi.URLParam(r, key)
	parsed, err := strconv.ParseInt(param, 10, 64)
	if err != nil {
		return 0
	}
	return parsed
}

func (h *Handler) writeNoContent(w http.ResponseWriter) {
	w.WriteHeader(http.StatusNoContent)
}

func (h *Handler) writeJSON(w http.ResponseWriter, r *http.Request, v interface{}) {
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(v); err != nil {
		h.writeError(w, r, err)
	}
}

func (*Handler) writeError(w http.ResponseWriter, r *http.Request, err error) {
	// TODO 2021/01/11 @Jimeux logging
	fmt.Println(err.Error())

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusInternalServerError)
	_ = json.NewEncoder(w).Encode(r)
}

// paginationParams returns (offset, limit) for pagination parameters
func (*Handler) paginationParams(r *http.Request) (int, int) {
	q := r.URL.Query()
	page, err := strconv.Atoi(q.Get("page"))
	if err != nil {
		page = 1
	}
	limit, err := strconv.Atoi(q.Get("limit"))
	if err != nil {
		limit = 20
	}
	return page*limit - limit, limit
}
