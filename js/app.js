// Selectors
const iframe = document.querySelector(".video");
const urlInput = document.querySelector("input[type='url']");
const URLForm = document.querySelector(".URL");
const noteInput = document.querySelector("input[type='text']");
const noteForm = document.querySelector(".note");
const email = document.querySelector(".email");

let notes = [];

var player;
function onYouTubeIframeAPIReady() {
	player = new YT.Player('video');
}

const Note = function(value, index, edit, remove, copy, timestamp, html, timeStampHref) {
	const clipboard = new Clipboard(".copy", {
		text: function(trigger) {
	    const note = document.querySelector(`[class="${notes.length}"]`);
	    return note;
    }
	});

	clipboard.on("success", function(e) {
    e.clearSelection();
	});

	this.value = value;
	this.index = index;
	this.ul = document.querySelector(".list-group");
	this.li = document.createElement("LI");
	this.firstDiv = document.createElement("DIV");
	this.timeStampLink = document.createElement("A");
	this.timeStamp = document.createElement("SPAN");
	this.noteText = document.createElement("SPAN");
	this.secondDiv = document.createElement("DIV");
	this.form = document.createElement("FORM");
	this.input = document.createElement("INPUT");
	this.buttonCopy = document.createElement("BUTTON");
	this.copyIMG = document.createElement("IMG");
	this.buttonEdit = document.createElement("BUTTON");
	this.editIMG = document.createElement("IMG");
	this.buttonRemove = document.createElement("BUTTON");
	this.removeIMG = document.createElement("IMG");

	this.li.className = "list-group-item d-flex justify-content-between align-items-center";
	this.timeStampLink.href = timeStampHref;
	this.timeStampLink.target = "_blank";
	this.timeStamp.className = "badge badge-info badge-pill p-2 mr-3 time-stamp";
	this.timeStamp.textContent = timestamp;

	if (html) {
		this.noteText.innerHTML = this.value;
	} else {
		this.noteText.textContent = this.value;
	}
	this.noteText.className = notes.length;
	this.secondDiv.className = "buttons";
	this.form.className = "d-inline-block";
	this.input.className = "editInput";
	this.input.type = "text";
	this.input.className = "form-control";
	this.input.style.display = "none";

	this.buttonCopy.className = "btn feature-button p-1 copy";
	this.copyIMG.src = "img/copy.svg";
	this.copyIMG.setAttribute("draggable", false);

	this.buttonEdit.className = "btn feature-button p-1";
	this.editIMG.src = "img/edit.svg";
	this.editIMG.setAttribute("draggable", false);

	this.buttonRemove.className = "btn feature-button p-1";
	this.removeIMG.src = "img/remove.svg";
	this.removeIMG.setAttribute("draggable", false);

	this.li.appendChild(this.firstDiv);
	this.firstDiv.appendChild(this.timeStampLink);
	this.timeStampLink.appendChild(this.timeStamp);
	this.firstDiv.appendChild(this.noteText);
	this.firstDiv.appendChild(this.form);
	this.li.appendChild(this.secondDiv);
	this.form.appendChild(this.input);
	if (edit) {
		this.secondDiv.appendChild(this.buttonEdit);
		this.buttonEdit.appendChild(this.editIMG);
		this.buttonEdit.addEventListener("click", () => {
			this.noteText.style.display = "none";
			this.input.style.display = "inline";
			this.input.value = this.value;
			this.form.addEventListener("submit", (e) => {
				e.preventDefault();
				if (this.input.value) {
					this.input.style.display = "none";
					this.value = this.input.value;
					this.noteText.textContent = this.input.value;
					this.noteText.style.display = "inline-block";
				} else {
					alertNotice("Please type a note :)");
				}
			});
		});
	}
	if (copy) {
		this.secondDiv.appendChild(this.buttonCopy);
		this.buttonCopy.appendChild(this.copyIMG);
		this.buttonCopy.setAttribute("data-clipboard-target", `[class="${notes.length}"]`);
		//clipboard.text();
	}
	if (remove) {
		this.secondDiv.appendChild(this.buttonRemove);
		this.buttonRemove.appendChild(this.removeIMG);
	}
	this.ul.appendChild(this.li);

	this.buttonRemove.addEventListener("click", () => {
		this.ul.removeChild(this.li);
		notes.splice(notes.indexOf(this), 1);
	});
};

noteInput.addEventListener("focus", function() {
	player.pauseVideo();
});

function alertNotice(notice) {
	const alert = `
		<div class="alert alert-success alert-dismissible fade show mx-5 mt-3" role="alert">
			${notice}
			<button type="button" class="close" data-dismiss="alert" aria-label="Close">
				<span aria-hidden="true">&times;</span>
			</button>
		</div>
	`;
	document.getElementsByClassName("alertNotice")[0].innerHTML = alert;
}

URLForm.addEventListener("submit", (e) => {
	e.preventDefault();
	if (urlInput.value) {
		let video = iframe;
		let url = urlInput.value;
		let url_end;

		if (url.search("https://www.youtube.com/watch?v=")) {
			url_end = url.split("https://www.youtube.com/watch?v=");
		}
		video.src = "https://www.youtube.com/embed/" + url_end[1] + "?enablejsapi=1";
	} else {
		alertNotice("Please paste a youtube video URL :)");
	}
});

function getId() {
	const videoID = iframe.src.split("https://www.youtube.com/embed/").join("").split("?enablejsapi=1").join("");

	return videoID;
}

function addList() {
	if (noteInput.value) {
		const timeStamp = Math.round(player.getCurrentTime()).toString() + "s";
		const link = "https://www.youtube.com/watch?v=" + getId() + "&t=" + timeStamp;
		const note = new Note(noteInput.value, notes.length, true, true, true, timeStamp, false, link);
		notes.push(note);
	} else {
		alertNotice("Please type a note :)");
	}
	noteInput.value = "";
}

email.addEventListener("click", (e) => {
	e.preventDefault();

	const email_to = ``;
	const email_subject = `Notes From vdnote.com`;
	let email_body = ``;

	for (let i = 0; i < notes.length; i++) {
		email_body += `${i + 1}. ${notes[i].value} \r\n%0D%0A`;
	}

	for (let i = 0; i < notes.length; i++) {
		email_body += `\r\n%0D%0AThese notes were based on this video ${notes[i].timeStampLink.href}`;
	}

	if (email_body === ``) {
		alertNotice("Please type a note before sending the email :)");
	} else {
		window.open(`mailto:${email_to}?subject=${email_subject}&body=${email_body}`, "Mailer");
	}
});

noteForm.addEventListener("submit", (e) => {
	e.preventDefault();
	addList();
	player.playVideo();
	noteInput.blur();
});
