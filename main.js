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
} from "firebase/firestore";

const list = document.getElementById("list");

const contentSchema = z.string().min(2).max(40).trim();

const form = document.getElementById("form");
const todo_text = document.getElementById("todo_text");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (contentSchema.safeParse(todo_text.value).success) {
        addDoc(todoRef, {
            content: todo_text.value,
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
            button: {
                text: "Close",
            },
        });
    }
});

const q = query(todoRef, orderBy("date", "desc"), limit(10));

onSnapshot(q, (snap) => {
    const data = snap.docs.map((el) => ({
        id: el.id,
        content: el.data().content,
        done: el.data().done,
        date: el.data().date,
    }));

    showData(data);

    console.log(data);
});

function showData(arr) {
    list.innerHTML = "";
    arr.forEach((el) => {
        list.innerHTML += td(el);
    });
}

function deletTodo(id) {
    const docRef = docRefById(id);

    swal({
        title: "Are you sure?",
        text: "Lorem Ipsum is simply dummy text of the",
        buttons: true,
        dangerMode: true,
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
        buttons: ["Cancel", "Update"]
        
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
});

observer.observe(list, { childList: true });
