// -----Text Editor----- //
const options = {
	modules: {
		toolbar: [
			[{ header: [1, 2, 3, 4, 5, 6, false] }],
			[{ font: [] }],
			["bold", "italic", "underline"],
			[{ align: [] }],
			[{ indent: "-1" }, { indent: "+1" }],
			[{ list: "ordered" }, { list: "bullet" }],
			["image", "link"],
		],
	},
	placeholder: "모임에 대한 자세한 내용을 입력해주세요",
	theme: "snow",
};

const quill = new Quill("#editor", options);

// -----Text Editor Image Handler----- //
quill.getModule("toolbar").addHandler("image", () => {
	imgHandler();
});

const imgHandler = () => {
	const input = document.createElement("input");
	input.setAttribute("type", "file");
	input.setAttribute("accept", "image/.jpeg, .jpg, .png");
	input.click();

	input.addEventListener("change", async () => {
		const file = input.files[0];
		const imgFormData = new FormData();

		imgFormData.append("files", file);

		// Post image to API (returns image location as string)
		await uploadImgToServer(imgFormData);
	});
};

// -----Form Submit----- //
const postForm = document.querySelector(".post-form");
const thumbnailInput = document.querySelector("#thumbnail-input");
const editorContent = document.querySelector(".ql-editor");

postForm.addEventListener("submit", async (evt) => {
	evt.preventDefault();

	const postFormData = new FormData(postForm);

	// Parse dates
	const startAt = postFormData.get("start_at").replace(/-/g, "");
	const finishAt = postFormData.get("finish_at").replace(/-/g, "");
	postFormData.set("start_at", startAt);
	postFormData.set("finish_at", finishAt);

	// Editor contents
	const content = editorContent.innerHTML;
	postFormData.set("content", content);

	// Thumbnail
	const thumbnailData = new FormData();
	thumbnailData.append("multipartFile", thumbnailInput.files[0]);

	// Send thumbnail to server and retrieve url from server
	const Thumbnail_URL = await uploadThumbnailToServer(thumbnailData);

	// Add Thumbnail_URL to postFormData
	postFormData.append("thumbnail", Thumbnail_URL);

	// Send final submit to server
	uploadContentsToServer(postFormData);
});

// -----Display Thumbnail----- //
thumbnailInput.addEventListener("change", (evt) => {
	setThumbnail(evt);
});

// -----API Handlers----- //
// Thumbnail API
const uploadThumbnailToServer = async (thumbnailData) => {
	fetch("http://3.34.235.190:8080/board/thumbnail", {
		method: "POST",
		headers: setHeaders({}),
		body: thumbnailData,
	})
		.then(async (res) => {
			const data = await res.json();
			const { Thumbnail_URL } = data;

			console.log("Thumbnail successfully uploaded to server");

			return Thumbnail_URL;
		})
		.catch((err) => {
			console.log(err);
		});
};

// Final Submit API
const uploadContentsToServer = (postFormData) => {
	fetch("http://3.34.235.190:8080/board", {
		method: "POST",
		headers: setHeaders({
			"Content-Type": "application/json",
		}),
		body: JSON.stringify(Object.fromEntries(postFormData)),
	})
		.then(async (res) => {
			const data = await res.json();
			console.log("Final submit successfully uploaded to server");
		})
		.catch((err) => {
			console.log(err);
		});
};

// Text Editor Images API
const uploadImgToServer = async (imgFormData) => {
	fetch("http://3.34.235.190:8080/board/images", {
		method: "POST",
		headers: setHeaders({}),
		body: imgFormData,
	})
		.then(async (res) => {
			const data = await res.json();
			const img = Object.keys(data)[0];
			const imgURL = data[img];

			// Save current cursor state
			const range = quill.getSelection(true);

			// Insert image
			quill.insertEmbed(range.index, "image", imgURL);

			// Move cursor to the right side of image for easier typing
			quill.setSelection(range.index + 1);

			console.log("Image successfully uploaded to server");
		})
		.catch((err) => {
			console.log(err);
		});
};

// -----Utility Functions----- //
// Display Thumbnail
function setThumbnail(evt) {
	const imgContainer = document.querySelector("#image-container");

	const reader = new FileReader();

	reader.addEventListener("load", (evt) => {
		const img = document.createElement("img");
		img.src = evt.target.result;
		img.classList.add("thumbnail");
		imgContainer.appendChild(img);
	});
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
