const postForm = document.querySelector(".post-form");
const thumbnail = document.querySelector("#thumbnail");

postForm.addEventListener("submit", evt => {
  evt.preventDefault();

  const postFormData = new FormData(postForm);

  const thumbnailData = new FormData();

  thumbnailData.append("multipartFile", thumbnail.files[0]);

  console.log(Object.fromEntries(thumbnailData));

  fetch("http://3.34.235.190:8080/board/thumbnail", {
    method: "POST",
    header: setHeaders({}),
    body: thumbnailData,
  }).then(async res => {
    const data = res.json();
    console.log(data);
  })
  // fetch("http://3.34.235.190:8080/board", {
  //   method: "POST",
  //   header: {
  //     "Content-Type": "application/json"
  //   },
  //   body: JSON.stringify(Object.fromEntries(postFormData)),
  // }).then(async res => {
  //   const data = await res.json();
  //   console.log(data);
  // })
});

function checkOnlyOne(element) {
  const checkboxes = document.getElementsByName("category");

  checkboxes.forEach((cb) => cb.checked = false)

  element.checked = true;
}

function setThumbnail(event) {
  var reader = new FileReader();
  reader.onload = function (event) {
    var img = document.createElement("img");
    img.setAttribute("src", event.target.result);
    document.querySelector("div#image_container").appendChild(img);
  };
  reader.readAsDataURL(event.target.files[0]);
}

const board = {
  category: 'CG_05',
  title: 'title',
  start: '모임 시작일',
  end: '모임 종료일',
  Frequency: '모임 빈도',
  personnel: '모임 인원',
  Place: '모임 장소',
  Dues: '회비',
  Min_age: '최소 나이',
  Max_age: '최대 나이'
}

// 게시글 페이지  ==> 이거까지 해도 좋습니다 ==> 댓글까지 ex) 1페이지에 댓글 몇개, 댓글에 대댓글 달때 어떤식으로 보일지
// 게시판 등록 페이지 금요일까지 디자인 및 기능  // 필수
// 리스트 페이지  ==> 이거까지 해도 좋습니다
// 댓글 대댓글 같은 것을 어떤식으로 디자인할지 // 대댓글 쓸때 들여쓰기 1개만 하기

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