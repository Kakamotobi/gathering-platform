"use strict";

const loginForm = document.querySelector(".login-form");
const userId = document.querySelector("#user-id");
const password = document.querySelector("#password");

loginForm.addEventListener("submit", async (evt) => {
	evt.preventDefault();

	// Make a new FormData object based on the key-value pairs of this form (input name and value).
	const formData = new FormData(loginForm);

	logIn(formData);
});

// --Login Function-- //
const logIn = async (formData) => {
	try {
		await fetch("http://3.34.235.190:8080/user/logIn", {
			method: "POST",
			body: JSON.stringify(Object.fromEntries(formData)),
			headers: {
				"Content-Type": "application/json",
			},
		}).then(async (res) => {
			if (res.status === 200) {
				const { AccessToken, RefreshToken } = await res.json();
				localStorage.setItem("jwtAccessToken", AccessToken);
				localStorage.setItem("jwtRefreshToken", RefreshToken);
				console.log(localStorage.getItem("jwtAccessToken"));
				console.log(localStorage.getItem("jwtRefreshToken"));
				// console.log(AccessToken);
				// console.log(RefreshToken);
			} else if (res.status === 400) {
				console.log(res);
			} else {
				console.log(res);
			}
		});
	} catch (err) {
		console.log(err);
	}
};
