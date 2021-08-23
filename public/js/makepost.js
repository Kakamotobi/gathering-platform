// -----Editor----- //
const options = {
	modules: {
		toolbar: [
			[{ header: [1, 2, 3, 4, 5, 6, false] }],
			[{ font: [] }],
			["bold", "italic", "underline"],
			[{ align: [] }],
			[{ indent: "-1" }, { indent: "+1" }],
			[{ list: "ordered" }, { list: "bullet" }],
			["image", "video", "link"],
		],
	},
	placeholder: "모임에 대한 자세한 내용을 입력해주세요",
	theme: "snow",
};

const quill = new Quill("#editor", options);

// -----Form Submit----- //
const postForm = document.querySelector(".post-form");
const thumbnail = document.querySelector("#thumbnail-input");
const editorContent = document.querySelector(".ql-editor");

postForm.addEventListener("submit", (evt) => {
	evt.preventDefault();

	const postFormData = new FormData(postForm);

	const startAt = postFormData.get("start_at").replace(/-/g, "");
	const finishAt = postFormData.get("finish_at").replace(/-/g, "");
	postFormData.set("start_at", startAt);
	postFormData.set("finish_at", finishAt);

	const content = editorContent.innerHTML;
	postFormData.set("content", content);

	const thumbnailData = new FormData();
	thumbnailData.append("multipartFile", thumbnail.files[0]);

	fetch("http://3.34.235.190:8080/board/thumbnail", {
		method: "POST",
		headers: setHeaders({}),
		body: thumbnailData,
	}).then(async (res) => {
		const data = await res.json();

		const { Thumbnail_URL } = data;

		postFormData.append("thumbnail", Thumbnail_URL);

		fetch("http://3.34.235.190:8080/board", {
			method: "POST",
			headers: setHeaders({
				"Content-Type": "application/json",
			}),
			body: JSON.stringify(Object.fromEntries(postFormData)),
		}).then(async (res) => {
			const data = await res.json();
			console.log(data);
		});
	});
});

// -----Thumbnail----- //
const thumbnailInput = document.querySelector("#thumbnail-input");

thumbnailInput.addEventListener("change", (evt) => {
	setThumbnail(evt);
});

// -----Utility Functions----- //
// Display Thumbnail
function setThumbnail(evt) {
	const imgContainer = document.querySelector("#image-container");

	const reader = new FileReader();
	reader.onload = function (evt) {
		const img = document.createElement("img");
		img.src = evt.target.result;
		img.classList.add("thumbnail");
		imgContainer.appendChild(img);
	};
	reader.readAsDataURL(evt.target.files[0]);
}

// Checkbox
function checkOnlyOne(element) {
	const checkboxes = document.getElementsByName("category");
	checkboxes.forEach((cb) => (cb.checked = false));
	element.checked = true;
}

// Request Headers
function setHeaders(headers) {
	if (localStorage.jwtAccessToken) {
		return {
			...headers,
			Authorization: `${localStorage.jwtAccessToken}`,
		};
	} else {
		return headers;
	}
}
