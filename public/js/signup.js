const signupForm = document.querySelector(".signup-form");
const userId = document.querySelector("#user-id");
const nickname = document.querySelector("#nickname");
const birthdate = document.querySelector("#birthdate");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const passwordConfirmation = document.querySelector("#password-confirmation");

signupForm.addEventListener("submit", async (evt) => {
	evt.preventDefault();
	checkInputs();

	// Make a new FormData object based on the key-value pairs of this form (input name and value).
	let formData = new FormData(signupForm);

	// for (let key of formData.keys()) {
	// 	console.log(key, formData.get(key));
	// }

	await fetch("/", {
		method: "POST",
		body: formData,
	})
		.then((res) => {
			return res.text();
		})
		.then((text) => {
			console.log(text);
		})
		.catch((err) => {
			console.log(err);
		});

	resetInputs();
});

// -----Functions----- //
// --Function for checking inputs-- //
checkInputs = () => {
	// Extract values from the inputs
	const userIdValue = userId.value;
	const nicknameValue = nickname.value;
	const birthdateValue = birthdate.value;
	const emailValue = email.value;
	const passwordValue = password.value;
	const passwordConfirmationValue = passwordConfirmation.value;

	// User ID
	if (userIdValue === "") {
		setErrorFor(userId, "사용하실 아이디를 입력해주세요");
	} else if (userIdValue.length < 5 || userIdValue.length > 15) {
		setErrorFor(userId, "최소 5자리, 최대 15자리를 입력해주세요");
	} else if (/[^a-zA-Z0-9]/.test(userIdValue)) {
		setErrorFor(userId, "영문, 숫자만 입력해주세요");
	} else {
		setSuccessFor(userId);
	}

	// Nickname
	if (nicknameValue === "") {
		setErrorFor(nickname, "사용하실 닉네임을 입력해주세요");
	} else if (nickname.value.length < 1 || nicknameValue.length > 15) {
		setErrorFor(nickname, "최소 1자리, 최대 15자리를 입력해주세요");
	} else if (/[^a-zA-Z]/.test(nicknameValue)) {
		setErrorFor(nickname, "영문 또는 한글만 입력해주세요");
	} else {
		setSuccessFor(nickname);
	}

	// Birthdate
	if (birthdateValue === "") {
		setErrorFor(birthdate, "생년월일을 입력해주세요");
	} else {
		setSuccessFor(birthdate);
	}

	// Email
	if (emailValue === "") {
		setErrorFor(email, "이메일 주소를 입력해주세요");
	} else if (!isValidEmail(emailValue)) {
		setErrorFor(email, "올바른 이메일을 입력해주세요");
	} else {
		setSuccessFor(email);
	}

	// Password
	if (passwordValue === "") {
		setErrorFor(password, "사용하실 비밀번호를 입력해주세요");
	} else if (passwordValue.length < 8 || passwordValue.length > 15) {
		setErrorFor(password, "8 - 15자리 비밀번호를 입력해주세요");
	} else if (!isValidPassword(passwordValue)) {
		setErrorFor(password, "영문 대소문자, 숫자, 특수기호 포함");
	} else {
		setSuccessFor(password);
	}

	// Password Confirmation
	if (passwordConfirmationValue === "") {
		setErrorFor(passwordConfirmation, "사용하실 비밀번호를 입력해주세요");
	} else if (passwordConfirmationValue !== passwordValue) {
		setErrorFor(passwordConfirmation, "비밀번호가 일치하지 않습니다");
	} else {
		setSuccessFor(passwordConfirmation);
	}
};

// --Function for resetting inputs-- //
resetInputs = () => {
	// If all requirements are met, reset the form
	const allInputs = document.querySelectorAll(".signup-form__input-control");
	const allInputsArr = [...allInputs];

	if (allInputsArr.every((el) => el.className.includes("show-input-success"))) {
		allInputsArr.forEach((el) => (el.value = ""));
	}
};

// -----Utility Functions----- //
// --Function for setting error-- //
setErrorFor = (input, message) => {
	const errorIcon = input.parentElement.querySelector(".error-icon");
	const errorMsg = input.parentElement.querySelector(".error-msg");

	// Add error styling to input
	input.classList.remove("show-input-success");
	input.classList.add("show-input-error");

	// Display error icon
	errorIcon.classList.add("show-error-icon");

	// Display error message
	errorMsg.innerText = message;
};

// --Function for success-- //
setSuccessFor = (input) => {
	const errorIcon = input.parentElement.querySelector(".error-icon");
	const errorMsg = input.parentElement.querySelector(".error-msg");

	// Add success styling to input
	input.classList.remove("show-input-error");
	input.classList.add("show-input-success");

	// Remove error icon
	errorIcon.classList.remove("show-error-icon");

	// Remove error msg
	errorMsg.innerText = "";
};

// --Email Validity Check-- //
function isValidEmail(emailValue) {
	return /^([A-Za-z0-9_-]+\.)*[A-Za-z0-9_-]+\@([A-Za-z0-9_-]+\.)+[A-Za-z]{2,4}$/.test(
		emailValue
	);
}

// --Password Validity Check-- //
// At least one lowercase letter, one uppercase letter, one number, one special character.
// Password length: 8 - 15
function isValidPassword(passwordValue) {
	return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(
		passwordValue
	);
}
