// Selectors
const input = document.querySelector("#main-input");
const form_1 = document.querySelector(".form-1");
const form_2 = document.querySelector(".form-2");
const email = document.querySelector("#email");
let notes = [];

const Note = function(value, index) {
	this.value = value;
	this.index = index;
	this.ul = document.querySelector("#tasks");
	this.li = document.createElement("LI");
	this.span = document.createElement("SPAN");
	this.div = document.createElement("DIV");
	this.button = document.createElement("BUTTON");

	this.span.textContent = this.value;
	this.button.textContent = "Remove";
	this.button.className = "remove";

	this.li.appendChild(this.span);
	this.div.appendChild(this.button);
	this.li.appendChild(this.div);
	this.ul.appendChild(this.li);


	this.button.addEventListener("click", () => {
		this.ul.removeChild(this.li);
		notes.splice(notes.indexOf(this), 1);
	});
};

function addList() {
	if (input.value) {
		const note = new Note(input.value, notes.length);
		notes.push(note);
	} else {
		alert("Please type a note");
	}
	input.value = "";
}

form_1.addEventListener("submit", (e) => {
	e.preventDefault();
	let video = document.querySelector("#video");
	let url = document.querySelector("#url-input").value;
	let url_end;

	if (url.search("https://www.youtube.com/watch?v=")) {
		url_end = url.split("https://www.youtube.com/watch?v=");
	}
	video.src = "https://www.youtube.com/embed/" + url_end[1];
	console.log(url_end[1]);
});

email.addEventListener("click", () => {
	const video = document.querySelector("#video").src;
	video.split("https://www.youtube.com/embed/");
	let url = document.querySelector("#url-input").value;
	const email_to = ``;
	const email_subject = `Notes From vdnote.com`;
	let email_body = ``;

	for (let i = 0; i < notes.length; i++) {
		email_body += i+1 + `. ` + notes[i].value + `\r\n%0D%0A`;
	}

	if (email_body === ``) {
		alert("Please type a task before sending an email");
	} else {
		window.location.href = `mailto:${email_to}?subject=${email_subject}&body=${email_body}`;
	}
});

form_2.addEventListener("submit", (e) => {
	e.preventDefault();
	addList();
});
