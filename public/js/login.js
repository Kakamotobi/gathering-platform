"use strict";

const loginForm = document.querySelector(".login-form");
const userId = document.querySelector("#user-id");
const password = document.querySelector("#password");

loginForm.addEventListener("submit", async (evt) => {
	evt.preventDefault();

	// Make a new FormData object based on the key-value pairs of this form (input name and value).
	const formData = new FormData(loginForm);

	await fetch("http://3.34.235.190:8080/user/logIn", {
		method: "POST",
		body: JSON.stringify(Object.fromEntries(formData)),
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then(async (res) => {
			const { AccessToken } = await res.json();
			console.log(AccessToken);
		})
		.catch((err) => {
			console.log(err);
		});
});
