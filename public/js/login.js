"use strict";

const accessTokenExpiryDuration = 24 * 3600 * 1000; // 24 hours in ms
const refreshTokenExpiryDuration = 192 * 3600 * 1000; // 8 days in ms

const logInForm = document.querySelector(".login-form");
const userId = document.querySelector("#user-id");
const password = document.querySelector("#password");

logInForm.addEventListener("submit", async (evt) => {
	evt.preventDefault();

	// Make a new FormData object based on the key-value pairs of this form (input name and value).
	const formData = new FormData(logInForm);

	logInAttempt(formData);
});

// -----Functions----- //
// --Log In Function-- //
const logInAttempt = async (formData) => {
	console.log("Log In attempt");
	try {
		await fetch("http://3.34.235.190:8080/user/logIn", {
			method: "POST",
			body: JSON.stringify(Object.fromEntries(formData)),
			headers: setHeaders({ "Content-Type": "application/json" }),
		}).then(async (res) => {
			const data = await res.json();

			if (res.status === 200) {
				// If login credentials match
				onLogInSuccess(data);
				setSuccessFor(password);
			} else if (res.status === 400) {
				// If login credentials do not match
				const { errorMessage } = data;
				setErrorFor(password, errorMessage);
			}
		});
	} catch (err) {
		console.log(err);
		console.log("Failed to fetch");
	}
};

// --Function for On Successful Login-- //
function onLogInSuccess(data) {
	console.log("Login successful");
	// Store tokens
	const { AccessToken, RefreshToken } = data;
	localStorage.setItem("AccessToken", AccessToken);
	localStorage.setItem("RefreshToken", RefreshToken);

	// Silent Refresh
	// setTimeout(issueNewAccessToken, accessTokenExpiryDuration);
	// setTimeout(
	// 	issueNewRefreshToken,
	// 	refreshTokenExpiryDuration - 24 * 3600 * 1000
	// );
}

// --Function for issuing new AccessToken-- //
function issueNewAccessToken(RefreshToken) {
	console.log("Issued new access token");
	fetch("http://3.34.235.190:8080/user/refresh", {
		method: "POST",
		body: JSON.stringify(localStorage.getItem("RefreshToken")),
		headers: setHeaders({ "Content-Type": "application/json" }),
	})
		.then((res) => {
			res.json();
		})
		.then((data) => {
			const { AccessToken } = data;
			localStorage.setItem("AccessToken", AccessToken);
		});
}

// --Function for issuing new RefreshToken-- //
function issueNewRefreshToken() {
	console.log("Issued new refresh token");
	fetch("http://3.34.235.190:8080/user/refresh", {
		method: "POST",
		body: JSON.stringify(localStorage.getItem("RefreshToken")),
		headers: setHeaders({ "Content-Type": "application/json" }),
	})
		.then((res) => {
			res.json();
		})
		.then((data) => {
			const { RefreshToken } = data;
			localStorage.setItem("RefreshToken", RefreshToken);
		});
}

// --Function for setting request headers-- //
// If JWT Access Token exists, include it by default.
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

// --Function for displaying error message-- //
const setErrorFor = (input, errorMessage) => {
	const errorMsg = input.parentElement.querySelector(".error-msg");

	// Display error message
	errorMsg.innerText = errorMessage;
};

// --Function for removing error message-- //
const setSuccessFor = (input) => {
	const errorMsg = input.parentElement.querySelector(".error-msg");

	errorMsg.innerText = "";
};
