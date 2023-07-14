const loadNewKey = document.getElementById("load-new-news");
const newsSection = document.querySelector(".news-section");
const savedNewsBtn = document.getElementById("load-saved");
const categoryBox = document.querySelector(".category-section");
const homeBox = document.querySelector(".home");
let savedNews = getFromLocal();

function getFromLocal() {
  return JSON.parse(localStorage.getItem("news-list")) || [];
}

function setToLocal(newsToSave) {
  localStorage.setItem("news-list", JSON.stringify(newsToSave));
}

function showSavedNews() {
  categoryBox.style.display = "none";
  homeBox.style.display = "none";

  document.querySelectorAll(".btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  newsSection.textContent = "";
  savedNewsBtn.classList.add("active");
  savedNews.forEach((news) => {
    const newsCard = createNewsCard(news);
    newsSection.appendChild(newsCard);
  });
}

function saveToLocal(e, news) {
  news.saved = !news.saved;

  if (news.saved) {
    e.target.classList.add("fa-solid");
    savedNews.push(news);
    setToLocal(savedNews);
  } else {
    e.target.classList.remove("fa-solid");
    let savedNewsIndex = savedNews.findIndex((newsObj) => {
      return newsObj.id === news.id;
    });
    savedNews.splice(savedNewsIndex, 1);
    setToLocal(savedNews);
  }
}

function createNewsCard(news) {
  const category = news[" category"];
  const author = news[" author"];
  const content = news.content;
  const newsUrl = news.url;

  const newsContainer = document.createElement("div");
  newsContainer.className = "news-container";
  newsContainer.innerHTML = `
        <span class="category">${category}</span>
        <p>by <span class="author">${author}</span></p>
        <p class="content">${content} <a href="${newsUrl}" target="_blank">Read more</a></p>
        <div class="save-container">
        <i class="fa-regular fa-heart save-icon fa-${
          news.saved ? "solid" : ""
        }"></i>
        </div>
    `;
  newsContainer.querySelector(".save-icon").addEventListener("click", (e) => {
    saveToLocal(e, news);
  });
  return newsContainer;
}

const fetchData = async () => {
  const response = await fetch(
    "https://content.newtonschool.co/v1/pr/64806cf8b7d605c99eecde47/news"
  );
  const categories = await response.json();
  return categories;
};

async function createCategories() {
  const categories = await fetchData();
  const button = document.createElement("button");
  button.className = "btn category-btn";
  button.textContent = "all";
  const categoriesBox = document.querySelector(".categories");
  categoriesBox.textContent = "";
  categoriesBox.appendChild(button);
  button.addEventListener("click", (e) => {
    document.querySelectorAll(".btn").forEach((btn) => {
      btn.classList.remove("active");
    });

    e.target.classList.add("active");
    newsSection.textContent = "";

    categories.forEach((news) => {
      const newsCard = createNewsCard(news);
      newsSection.appendChild(newsCard);
    });
  });

  categories.forEach((newsCategory) => {
    const category = newsCategory[" category"];
    const button = document.createElement("button");
    button.className = "btn category-btn";
    button.textContent = category;
    newsCategory.id =
      category +
      newsCategory[" author"].split(" ")[0] +
      newsCategory.content.split(" ")[0];

    const index = savedNews.findIndex((news) => news.id === newsCategory.id);
    newsCategory.saved = index !== -1 ? savedNews[index].saved : false;

    button.addEventListener("click", (e) => {
      document.querySelectorAll(".btn").forEach((btn) => {
        btn.classList.remove("active");
      });
      e.target.classList.add("active");
      const newsSection = document.querySelector(".news-section");
      newsSection.textContent = "";
      const newsCard = createNewsCard(newsCategory);
      newsSection.appendChild(newsCard);
    });

    categoriesBox.appendChild(button);
  });

  categoryBox.style.display = "none";
}

document.querySelector(".logo").addEventListener("click", () => {
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  homeBox.style.display = "block";
  categoryBox.style.display = "none";
  newsSection.style.display = "none";
});
savedNewsBtn.addEventListener("click", showSavedNews);
loadNewKey.addEventListener("click", () => {
  categoryBox.style.display = "block";
  newsSection.style.display = "block";
  homeBox.style.display = "none";
  newsSection.textContent = "";
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  loadNewKey.classList.add("active");
});
createCategories();
