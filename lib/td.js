export default function td(el) {
    return `<li class="li_list">
            <div class="${el.done ? "date_todo done" : "date_todo"}">
            <span>${el.date}</span>
            </div>
            <div class="content">
                <span class="${el.done ? "done" : ""}"></span>
                <input type="text" data-id="${el.id}" value="${
        el.content
    }" class="${
        el.done ? "done input_content_show" : "input_content_show"
    }" readonly>
                
  </div>
  <div class="actions">
      <button class="delete_todo" data-id="${el.id}">
          <i class="material-symbols-outlined"> delete </i>
      </button>
      <button class="update_todo_btn" data-id="${el.id}" data-content="${el.content}">
          <i class="material-symbols-outlined"> edit_square </i>
      </button>
      <button class="${el.done ? "done_todo active" : "done_todo"}" data-done="${el.done}" data-id="${
        el.id
    }">
          <i class="material-symbols-outlined"> ${
              el.done ? "done" : "schedule"
          }  </i>
      </button>
  </div>
</li>`;
}