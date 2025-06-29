/**
 * 準備リスト完了ページのJavaScript
 * Page6から分担データを継承して表示する
 */

class CompletionPageManager {
  constructor() {
    this.assignmentData = null;
    this.groupData = null;
    this.init();
  }

  /**
   * 初期化処理
   */
  init() {
    this.bindElements();
    this.loadDataFromPage6();
    this.setupEventListeners();
    this.renderCompletionPage();
  }

  /**
   * DOM要素を取得
   */
  bindElements() {
    this.listDisplay = document.getElementById("listDisplay");
    this.groupTitleElement = document.getElementById("groupTitle"); // 修正: IDを正しく取得
    this.editButtons = document.querySelectorAll(".edit-btn");
  }

  /**
   * Page6からデータを読み込み
   */
  loadDataFromPage6() {
    try {
      // 最終的な分担データを取得
      const finalAssignmentData = sessionStorage.getItem("finalAssignmentData");
      if (finalAssignmentData) {
        this.assignmentData = JSON.parse(finalAssignmentData);
        console.log(
          "Page6から最終分担データを読み込みました:",
          this.assignmentData
        );
      } else {
        // フォールバック: 通常の分担データを取得
        const assignmentData = sessionStorage.getItem("assignmentData");
        if (assignmentData) {
          this.assignmentData = JSON.parse(assignmentData);
          console.log(
            "Page6から分担データを読み込みました:",
            this.assignmentData
          );
        }
      }

      // グループデータを取得
      const groupData = sessionStorage.getItem("groupData");
      if (groupData) {
        this.groupData = JSON.parse(groupData);
        console.log("グループデータを読み込みました:", this.groupData);
      }

      // データが取得できない場合はデフォルトデータを使用
      if (!this.assignmentData) {
        this.setDefaultData();
      }
    } catch (error) {
      console.error("データ読み込みエラー:", error);
      this.setDefaultData();
    }
  }

  /**
   * デフォルトデータを設定（フォールバック用）
   */
  setDefaultData() {
    console.warn(
      "Page6からのデータが見つかりません。デフォルトデータを使用します。"
    );

    this.assignmentData = {
      assignments: [
        { name: "パスポート", assignee: "全員", quantity: "1" },
        { name: "財布", assignee: "全員", quantity: "1" },
        { name: "パスポートのコピー", assignee: "全員", quantity: "1" },
        { name: "航空券", assignee: "全員", quantity: "1" },
        { name: "クレジットカード", assignee: "全員", quantity: "1" },
        { name: "カメラ", assignee: "りく", quantity: "1" },
        { name: "変圧器", assignee: "まりん", quantity: "1" },
      ],
      members: ["りく", "まりん"],
      items: [
        "パスポート",
        "財布",
        "パスポートのコピー",
        "航空券",
        "クレジットカード",
        "カメラ",
        "変圧器",
      ],
    };

    this.groupData = {
      groupName: "おはなグループ",
      members: ["りく", "まりん"],
    };
  }

  /**
   * 完了ページのレンダリング
   */
  renderCompletionPage() {
    this.updateGroupName();
    this.renderAssignmentTable();
  }

  /**
   * グループ名の更新
   */
  updateGroupName() {
    if (this.groupData && this.groupData.groupName && this.groupTitleElement) {
      this.groupTitleElement.textContent = `${this.groupData.groupName}の持ち物リスト`;
    }
  }

  /**
   * 分担テーブルのレンダリング
   */
  renderAssignmentTable() {
    if (!this.assignmentData || !this.assignmentData.assignments) {
      console.error("分担データがありません");
      return;
    }

    // テーブルボディをクリア
    this.listDisplay.innerHTML = "";

    // 各分担データをテーブル行として追加
    this.assignmentData.assignments.forEach((assignment, index) => {
      if (assignment.assignee && assignment.quantity) {
        const row = this.createTableRow(assignment);
        this.listDisplay.appendChild(row);
      }
    });

    // アニメーション効果を追加
    this.addFadeInAnimation();
  }

  /**
   * テーブル行の作成
   */
  createTableRow(assignment) {
    const row = document.createElement("div");
    row.className = "table-row";

    // 担当者カラム
    const personCol = document.createElement("div");
    personCol.className = "col-person";
    personCol.textContent = assignment.assignee;

    // 「全員」の場合は特別なスタイルを適用
    if (assignment.assignee === "全員") {
      personCol.classList.add("all-members");
    }

    // 持ち物カラム
    const itemCol = document.createElement("div");
    itemCol.className = "col-item";
    itemCol.textContent = assignment.name;

    // 個数カラム
    const countCol = document.createElement("div");
    countCol.className = "col-count";
    countCol.textContent = assignment.quantity;

    row.appendChild(personCol);
    row.appendChild(itemCol);
    row.appendChild(countCol);

    return row;
  }

  /**
   * イベントリスナーの設定
   */
  setupEventListeners() {
    // 編集ボタンのイベント設定
    this.editButtons.forEach((button) => {
      button.addEventListener("click", (e) => this.handleEditButton(e));
    });
  }

  /**
   * 編集ボタンの処理
   */
  handleEditButton(event) {
    const button = event.target.closest(".edit-btn");
    const buttonType = button.getAttribute("data-type");

    // ボタンクリック効果
    button.style.transform = "scale(0.90)";
    setTimeout(() => {
      button.style.transform = "scale(1)";
    }, 150);

    if (buttonType === "group-name") {
      // 修正: HTMLの data-type に合わせる
      this.handleGroupNameEdit();
    } else if (buttonType === "list-edit") {
      // 修正: HTMLの data-type に合わせる
      this.handleListEdit();
    }
  }

  /**
   * グループ名変更処理
   */
  handleGroupNameEdit() {
    const currentGroupName = this.groupData
      ? this.groupData.groupName
      : "おはなグループ";
    const newGroupName = prompt(
      "新しいグループ名を入力してください:",
      currentGroupName
    );

    if (
      newGroupName &&
      newGroupName.trim() &&
      newGroupName.trim() !== currentGroupName
    ) {
      const trimmedName = newGroupName.trim();

      // グループデータを更新
      if (!this.groupData) {
        this.groupData = {};
      }
      this.groupData.groupName = trimmedName;

      // セッションストレージに保存
      sessionStorage.setItem("groupData", JSON.stringify(this.groupData));

      // 表示を更新
      this.updateGroupName();

      // 更新時のアニメーション効果
      this.groupTitleElement.classList.add("updating");
      setTimeout(() => {
        this.groupTitleElement.classList.remove("updating");
      }, 300);

      this.showAlert(`グループ名を「${trimmedName}」に変更しました`);
    }
  }

  /**
   * リスト編集処理（Page6に戻る）
   */
  handleListEdit() {
    const confirmEdit = confirm(
      "リストを編集しますか？\nPage6（分担設定ページ）に戻ります。"
    );

    if (confirmEdit) {
      // Page6に戻る
      window.location.href = "page6.html";
    }
  }

  /**
   * フェードインアニメーションの追加
   */
  addFadeInAnimation() {
    const tableRows = this.listDisplay.querySelectorAll(".table-row");
    tableRows.forEach((row, index) => {
      row.style.opacity = "0";
      row.style.transform = "translateY(10px)";

      setTimeout(() => {
        row.style.transition = "opacity 0.4s ease-out, transform 0.4s ease-out";
        row.style.opacity = "1";
        row.style.transform = "translateY(0)";
      }, index * 100);
    });
  }

  /**
   * アラートメッセージの表示
   */
  showAlert(message) {
    const alertDiv = document.createElement("div");
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #00E1A9;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-family: "M PLUS 1p", sans-serif;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 225, 169, 0.3);
        animation: slideDown 0.3s ease-out;
      `;
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);

    // CSS Animation
    const style = document.createElement("style");
    style.textContent = `
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `;
    document.head.appendChild(style);

    setTimeout(() => {
      alertDiv.style.animation = "slideUp 0.3s ease-out forwards";
      style.textContent += `
          @keyframes slideUp {
            from {
              opacity: 1;
              transform: translateX(-50%) translateY(0);
            }
            to {
              opacity: 0;
              transform: translateX(-50%) translateY(-20px);
            }
          }
        `;

      setTimeout(() => {
        if (document.body.contains(alertDiv)) {
          document.body.removeChild(alertDiv);
        }
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      }, 300);
    }, 2500);
  }

  /**
   * データのエクスポート（将来的な機能拡張用）
   */
  exportData() {
    const exportData = {
      groupName: this.groupData ? this.groupData.groupName : "未設定",
      assignments: this.assignmentData ? this.assignmentData.assignments : [],
      exportedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(dataBlob);
    link.download = `持ち物リスト_${exportData.groupName}_${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    link.click();
  }
}

// ページ読み込み完了時にアプリケーションを初期化
document.addEventListener("DOMContentLoaded", () => {
  new CompletionPageManager();
});
