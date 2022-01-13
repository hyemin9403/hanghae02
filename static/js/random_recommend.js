const randomData = [
  {
    img: "/static/random_data/icecream.jpg",
    dessert_name: "아이스크림",
    comment: "부드럽게 녹아내리는 아이스크림이 먹고싶은 날이에요",
  },
  {
    img: "/static/random_data/macaron.jpeg",
    dessert_name: "마카롱",
    comment: "한 입 베어물면 달콤함이 입안에 가득 퍼져요",
  },
  {
    img: "/static/random_data/cookie.jpeg",
    dessert_name: "쿠키",
    comment: "바삭바삭한 식감의 쿠키를 먹어보고 싶지 않으신가요?",
  },
  {
    img: "/static/random_data/rainbow_cake.jpg",
    dessert_name: "아이스크림",
    comment: "입안에서 팡팡! 터지는 레인보우 케이크입니다.",
  },
  {
    img: "/static/random_data/rollcake.jpeg",
    dessert_name: "롤케이크",
    comment: "우유생크림이 가득 들은 롤케이크 입니다",
  },
  {
    img: "/static/random_data/waffle.jpeg",
    dessert_name: "와플",
    comment: "딸기와 생크림의 환상조합! 크로플로 먹어도 맛있어요",
  },
  {
    img: "/static/random_data/flipper_cake.jpeg",
    dessert_name: "수플레케이크",
    comment: "입에서 사르르 녹아내리는 수플레 케이크",
  },
  {
    img: "/static/random_data/tart.jpeg",
    dessert_name: "타르트",
    comment: "크리스피한 식감과 부드러운 식감의 조화!",
  },
  {
    img: "/static/random_data/omelet.png",
    dessert_name: "딸기 오믈렛",
    comment: "딸기 오믈렛은은 언제 먹어도 정말 맛있어요",
  },
];
const randomItemContainer = document.getElementById("random-item-container");

function handleRandomOnClick() {
  //클릭하게 되면 랜덤으로 array에 있는 이미지와 설명을 골라서 추천을 해준다.
  let randomNum = Math.floor(Math.random() * randomData.length);
  const randomItem = document.createElement("div");

  randomItem.classList.add("random-item");

  randomItemContainer.innerHTML = "";

  randomItem.innerHTML = `
        <div class="modal" id="modal-post">
        <div class="modal-background" onclick='$("#modal-post").removeClass("is-active")'></div>
        <div class="modal-content">
            <div class="box">
                <article class="media">
                    <div class="media-content" id="media-content">
                        <h1 class="random-question">오늘 이 디저트 어때요?</h1>
                        <img src="${randomData[randomNum]["img"]}" alt="" class="random-img">
                        <div class="field">
                            <h1 class="random-title">"${randomData[randomNum]["dessert_name"]}"</h1>
                            <p>"${randomData[randomNum]["comment"]}"</p>
                        </div>
                        <nav class="level is-mobile">
                            <div class="level-left">
                            </div>
                            <div class="level-right">
                                <div class="level-item">
                                    <a class="button is-sparta is-outlined"
                                       onclick='$("#modal-post").removeClass("is-active")'>닫기</a>
                                </div>
                            </div>
                        </nav>
                    </div>
                </article>
            </div>
        </div>
        <button class="modal-close is-large" aria-label="close"
                onclick='$("#modal-post").removeClass("is-active")'></button>
    </div>
    `;

  randomItemContainer.appendChild(randomItem);
}

function addClass() {
  $("#modal-post").addClass("is-active");
}

function anotherRandomDessert() {
  const mediaContent = document.getElementById("media-content");
  let randomNum = Math.floor(Math.random() * randomData.length);

  mediaContent.innerHTML = "";
}
