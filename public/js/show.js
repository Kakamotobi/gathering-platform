"use strict";

const root = document.querySelector("#root");

const fetchBoardDetails = (async () => {
	await fetch("http://3.34.235.190:8080/board/21", {
		method: "GET",
		headers: setHeaders({
			"Content-Type": "application/json",
		}),
	}).then(async (res) => {
		const data = await res.json();
		console.log(data);
		root.innerHTML = `
	<div class="title__wrapper">
		<section class="title">
			<h2>${data.title}</h2>
			<small>${data.numOfPeople}명</small>
		</section>
	</div>

	<div class="details__wrapper">
		<section class="details">
			<h2>모임내용</h2>
			<ul class="details__list">
				<li class="details__list__item"><b>카테고리: </b>${data.category}</li>
				<li class="details__list__item"><b>모임기간: </b>${data.start_at} - ${data.finish_at}</li>
				<li class="details__list__item"><b>모임빈도: </b>${data.frequency}</li>
				<li class="details__list__item"><b>장소: </b>${data.place}</li>
				<li class="details__list__item"><b>회비: </b>${data.fee}</li>
				<li class="details__list__item"><b>나이: </b>${data.min_age} - ${data.max_age}</li>
			</ul>
		</section>
	</div>

	<div class="explanation__wrapper">
		<section class="explanation">
			<h2>상세내용</h2>
			<main class="post-content">${data.content}</main>
		</section>
	</div>

	<div class="comments__wrapper">
		<section class="comments">
			<h2>댓글</h2>
		</section>
	</div>
	`;
	});
})();

// -----Functions----- //
function setHeaders(headers) {
	if (localStorage.AccessToken) {
		return {
			...headers,
			Authorization: `Bearer ${localStorage.AccessToken}`,
		};
	} else {
		return headers;
	}
}
