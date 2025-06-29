// frontend/index.js

document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.querySelector(".start-button");
  if (!startButton) return;

  startButton.addEventListener("click", (e) => {
    e.preventDefault(); // aタグのデフォルト遷移をキャンセル

    // セッションを初期化
    sessionStorage.removeItem("groupData");
    sessionStorage.removeItem("currentGroupId");

    // 遷移
    window.location.href = "page2.html";
  });
});
