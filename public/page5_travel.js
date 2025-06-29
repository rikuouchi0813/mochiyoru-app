/**
 * 旅行持ち物管理ページのJavaScript
 * 持ち物の追加・削除機能とバリデーション機能を提供
 * Page6への持ち物データ受け渡し機能を含む
 */

class TravelItemsManager {
  constructor() {
    this.items = [];
    this.init();
  }

  /**
   * 初期化処理
   */
  init() {
    this.bindElements();
    this.attachEventListeners();
    this.loadExistingItems();
  }

  /**
   * DOM要素を取得
   */
  bindElements() {
    this.itemInput = document.getElementById("itemInput");
    this.addButton = document.getElementById("addButton");
    this.itemsContainer = document.getElementById("itemsContainer");
    this.nextButton = document.getElementById("nextButton");
  }

  /**
   * イベントリスナーを設定
   */
  attachEventListeners() {
    // 持ち物追加ボタン
    this.addButton.addEventListener("click", () => this.addItem());

    // Enterキーで持ち物追加
    this.itemInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.addItem();
      }
    });

    // 次に進むボタン
    this.nextButton.addEventListener("click", (e) => this.handleNextPage(e));
  }

  /**
   * 既存の持ち物を読み込み（HTML内にあるもの）
   */
  loadExistingItems() {
    const existingItems = this.itemsContainer.querySelectorAll(".item-tag");
    existingItems.forEach((itemTag) => {
      const span = itemTag.querySelector("span");
      if (span) {
        const itemName = span.textContent.trim();
        this.items.push(itemName);
      }
    });

    // 既存のアイテムも含めて表示を更新
    this.updateItemsList();
  }

  /**
   * 持ち物追加処理
   */
  addItem() {
    const itemName = this.itemInput.value.trim();

    if (!this.validateItemName(itemName)) {
      return;
    }

    if (this.isDuplicateItem(itemName)) {
      alert("その持ち物は既に追加されています");
      return;
    }

    this.items.push(itemName);
    this.updateItemsList();
    this.clearItemInput();

    // 持ち物が追加されるたびにデータを保存
    this.saveItemsToStorage();
  }

  /**
   * 持ち物名のバリデーション
   * @param {string} itemName
   * @returns {boolean}
   */
  validateItemName(itemName) {
    if (itemName === "") {
      alert("持ち物を入力してください");
      return false;
    }
    return true;
  }

  /**
   * 重複持ち物のチェック
   * @param {string} itemName
   * @returns {boolean}
   */
  isDuplicateItem(itemName) {
    return this.items.includes(itemName);
  }

  /**
   * 持ち物削除処理
   * @param {string} itemName
   */
  removeItem(itemName) {
    const index = this.items.indexOf(itemName);
    if (index > -1) {
      this.items.splice(index, 1);
      this.updateItemsList();

      // 削除後もデータを保存
      this.saveItemsToStorage();
    }
  }

  /**
   * 持ち物リスト表示更新
   */
  updateItemsList() {
    this.itemsContainer.innerHTML = "";

    this.items.forEach((item) => {
      const itemTag = this.createItemTag(item);
      this.itemsContainer.appendChild(itemTag);
    });
  }

  /**
   * 持ち物タグを作成
   * @param {string} item
   * @returns {HTMLElement}
   */
  createItemTag(item) {
    const itemTag = document.createElement("div");
    itemTag.className = "item-tag";

    const span = document.createElement("span");
    span.textContent = item;

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "×";
    removeBtn.title = "削除";
    removeBtn.addEventListener("click", () => this.removeItem(item));

    itemTag.appendChild(span);
    itemTag.appendChild(removeBtn);

    return itemTag;
  }

  /**
   * 持ち物入力フィールドをクリア
   */
  clearItemInput() {
    this.itemInput.value = "";
    this.itemInput.focus();
  }

  /**
   * 次のページに進むボタンのクリック処理
   * @param {Event} e
   */
  handleNextPage(e) {
    e.preventDefault();

    if (!this.validateNextPage()) {
      return;
    }

    // データを保存してPage6に遷移
    this.saveTravelItemsAndNavigate();
  }

  /**
   * 次のページに進む際のバリデーション
   * @returns {boolean}
   */
  validateNextPage() {
    if (this.items.length === 0) {
      alert("持ち物を少なくとも1つ追加してください");
      this.itemInput.focus();
      return false;
    }

    return true;
  }

  /**
   * sessionStorageに持ち物データを保存
   */
  saveItemsToStorage() {
    try {
      const travelData = {
        items: [...this.items],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      sessionStorage.setItem("travelItems", JSON.stringify(travelData));
      console.log("持ち物データをsessionStorageに保存しました:", travelData);
    } catch (error) {
      console.error("データの保存に失敗しました:", error);
    }
  }

  /**
   * 旅行持ち物データを保存してPage6に遷移
   */
  saveTravelItemsAndNavigate() {
    try {
      // sessionStorageに保存
      this.saveItemsToStorage();

      // ボタンの状態を変更（フィードバック）
      const originalText = this.nextButton.innerHTML;
      this.nextButton.innerHTML = "保存中...";
      this.nextButton.disabled = true;

      // 少し遅延を入れてユーザーに保存されたことを示す
      setTimeout(() => {
        this.nextButton.innerHTML = "保存完了！";

        setTimeout(() => {
          // Page6に遷移（URLパラメータとsessionStorage両方でデータを渡す）
          this.navigateToPage6();
        }, 500);
      }, 300);
    } catch (error) {
      console.error("データ保存エラー:", error);
      alert("データの保存に失敗しました。もう一度お試しください。");

      // ボタンを元に戻す
      this.nextButton.innerHTML = originalText;
      this.nextButton.disabled = false;
    }
  }

  /**
   * Page6への遷移処理
   */
  navigateToPage6() {
    try {
      // URLパラメータとして持ち物リストを渡す（バックアップ）
      const itemsParam = encodeURIComponent(JSON.stringify(this.items));
      const url = `page6.html?items=${itemsParam}`;

      // 遷移実行
      window.location.href = url;
    } catch (error) {
      console.error("遷移エラー:", error);
      // URLパラメータに失敗した場合はsessionStorageのみで遷移
      window.location.href = "page6.html";
    }
  }

  /**
   * 旅行持ち物データを保存
   * 実際のアプリケーションではサーバーAPIを呼び出す
   */
  saveTravelItems() {
    const travelData = {
      items: [...this.items],
      createdAt: new Date().toISOString(),
    };

    // 開発用：コンソールに出力
    console.log("旅行持ち物データ:", travelData);

    // 実装例：サーバーに送信する場合
    // this.sendToServer(travelData);
  }

  /**
   * サーバーにデータを送信（実装例）
   * @param {Object} travelData
   */
  async sendToServer(travelData) {
    try {
      const response = await fetch("/api/travel-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(travelData),
      });

      if (!response.ok) {
        throw new Error("持ち物リストの保存に失敗しました。");
      }

      const result = await response.json();
      console.log("持ち物リスト保存成功:", result);
    } catch (error) {
      console.error("エラー:", error);
      alert("持ち物リストの保存に失敗しました。もう一度お試しください。");
    }
  }

  /**
   * 既存のsessionStorageからデータを復元（ページリロード時用）
   */
  loadFromStorage() {
    try {
      const savedData = sessionStorage.getItem("travelItems");
      if (savedData) {
        const travelData = JSON.parse(savedData);
        if (travelData.items && Array.isArray(travelData.items)) {
          this.items = [...travelData.items];
          this.updateItemsList();
          console.log("sessionStorageからデータを復元しました:", travelData);
        }
      }
    } catch (error) {
      console.error("データの復元に失敗しました:", error);
    }
  }
}

// DOM読み込み完了後に初期化
document.addEventListener("DOMContentLoaded", () => {
  new TravelItemsManager();
});
