import "./style.scss";
import { todoRef, docRefById } from "./firebase.config.js";
import td from "./lib/td.js";
import { z } from "zod";
import {
    addDoc,
    Timestamp,
    onSnapshot,
    deleteDoc,
    updateDoc,
    query,
    orderBy,
    limit,
    getDocs
} from "firebase/firestore";
import moment from 'moment';

const list = document.getElementById("list");
const contentSchema = z.string().min(2).max(40).trim();
const form = document.getElementById("form");
const todo_text = document.getElementById("todo_text");

let page = 6

window.addEventListener("load", function () {
    this.setTimeout(() => {
        this.document.getElementById("loading_box").remove();
    }, 1000);
});

form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (contentSchema.safeParse(todo_text.value).success) {
        addDoc(todoRef, {
            content: todo_text.value.replace(/["<>/'``]/gi, '_'),
            done: false,
            date: Timestamp.fromDate(new Date()),
        }).then((res) => {
            console.log(res.id);
            form.reset();
        });
    } else {
        swal({
            title: "mkin walo ?",
            text: "Lorem Ipsum is simply dummy",
            icon:"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxnIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzZiYWY4ZCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjEuNSI+PHBhdGggZD0iTTcuODA1IDMuNDY5QzguMTYgMy4xMTUgOC40NTEgMyA4LjkzNyAzaDYuMTI2Yy40ODYgMCAuNzc4LjExNSAxLjEzMi40NjlsNC4zMzYgNC4zMzZjLjM1NC4zNTQuNDY5LjY0Ni40NjkgMS4xMzJ2Ni4xMjZjMCAuNS0uMTI1Ljc4OC0uNDY5IDEuMTMybC00LjMzNiA0LjMzNmMtLjM1NC4zNTQtLjY0Ni40NjktMS4xMzIuNDY5SDguOTM3Yy0uNSAwLS43ODgtLjEyNS0xLjEzMi0uNDY5TDMuNDcgMTYuMTk1Yy0uMzU1LS4zNTUtLjQ3LS42NDYtLjQ3LTEuMTMyVjguOTM3YzAtLjUuMTI1LS43ODguNDY5LTEuMTMyeiIvPjxwYXRoIGQ9Ik0xMiAxMy40OTZjMC0yLjAwMyAyLTEuNTAzIDItMy41MDZjMC0yLjY1OS00LTIuNjU5LTQgMG0yIDYuMDA3di0uNSIvPjwvZz48L3N2Zz4=",
            button: {
                text: "Close",
            },
        });
    }
});

const q = query(todoRef, orderBy("date", "desc"), limit(page));

onSnapshot(q, (snap) => {
    const data = snap.docs.map((el) => ({
        id: el.id,
        content: el.data().content,
        done: el.data().done,
        date: el.data().date.toDate(),
    }));

    showData(data);

    console.log(snap.size);

    getDocs(todoRef).then(res=>{
        console.log(res.size)
        
        document.getElementById('h1_logo').dataset.count = res.size < 10 ? "0"+res.size : "+9"
    })
    //document.getElementById('h1_logo').dataset.count = snap.size

});

function showData(arr) {
    list.innerHTML = "";
    if (arr.length > 0) {
        arr.forEach((el) => {
            list.innerHTML += td(el);
        });
    } else {
        list.innerHTML = `<div class='empty'><span>Empty</span><i class='material-symbols-outlined'>scan_delete</i></div>`;
    }
}

function deletTodo(id) {
    const docRef = docRefById(id);

    swal({
        title: "Are you sure?",
        text: "Lorem Ipsum is simply dummy text of the",
        icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9IiM2YmFmOGQiIGQ9Ik0xNiAydjRoNnYyaC0ydjE0SDRWOEgyVjZoNlYyem0tMiAyaC00djJoNHptMCA0SDZ2MTJoMTJWOHptLTUgMmgydjhIOXptNiAwaC0ydjhoMnoiLz48L3N2Zz4=",
        buttons: ["Cancel", "Delete"],
        dangerMode: true,
        className: "ttt",
    }).then((willDelete) => {
        if (willDelete) {
            deleteDoc(docRef).then((res) => {
                console.log(res);
            });
        }
    });
}

function doneTodo({ id, done }) {
    const isTrue = /^true$/i.test(done);
    const docRef = docRefById(id);

    try {
        updateDoc(docRef, { done: !isTrue });
    } catch (err) {
        console.error(err);
    }
}

function updateTodo({ id, content }) {
    const docRef = docRefById(id);
    console.log(id, content);
    swal({
        title: "Are you sure?",
        //text: 'Search for a movie. e.g. "La La Land".',
        content: {
            element: "input",
            attributes: {
                value: content,
            },
        },
        buttons: ["Cancel", "Update"],
    }).then((txt) => {
        console.log(txt);
        if (contentSchema.safeParse(txt).success) {
            try {
                updateDoc(docRef, { content: txt, done: false });
            } catch (err) {
                console.error(err);
            }
        }

        swal.close();
    });
}

const observer = new MutationObserver((obs) => {
    document
        .querySelectorAll(".delete_todo")
        .forEach((el) =>
            el.addEventListener("click", (t) => deletTodo(t.target.dataset.id))
        );
    document
        .querySelectorAll(".done_todo")
        .forEach((el) =>
            el.addEventListener("click", (t) => doneTodo(t.target.dataset))
        );

    document
        .querySelectorAll(".update_todo_btn")
        .forEach((el) =>
            el.addEventListener("click", (t) => updateTodo(t.target.dataset))
        );
    document
        .querySelectorAll(".show_todo")
        .forEach((el) =>
            el.addEventListener("click", (t) => showTodoInfo(t.target.dataset))
        );
});

observer.observe(list, { childList: true });


function showTodoInfo(todo) {
    //console.log(todo,todo.date,moment(todo.date).fromNow());
    swal({
        title: "Created At",
        text: moment(new Date(todo.date)).format('LLL'),
        button: "close",
    });
}

const date_new = document.getElementById('date_new')

setInterval(()=>{
    date_new.innerHTML = moment().format('MMMM Do YYYY, h:mm:ss a');
},1000)

const swalModal = document.querySelector('.swal-modal');

swalModal?.addEventListener('click',()=>{
    alert('hi')
})
