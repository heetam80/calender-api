
const API_BASE_URL = 'http://localhost:8080/api/calenders';

const $ = (id) => document.getElementById(id);

const state = {
    events: [],
    currentMonth: new Date(),
    selectedDate: '',
    editingId: null
};

// 日付を YYYY-MM-DD 形式に変換
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

// 文字列を Date に変換
function parseDate(value) {
    const [year, month, day] = String(value).slice(0, 10)
        .split('-').map(Number);

    if (!year || !month || !day) return null;

    return new Date(year, month - 1, day);
}

// 日本語の日付表示
function formatJapaneseDate(value) {
    const date = parseDate(value);

    if (!date) return value ?? '';

    return new Intl.DateTimeFormat('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short'
    }).format(date);
}

// エラーメッセージ表示
function showError(message) {
    $('error-message').textContent = message;
    $('status-message').textContent = '';
}

// 成功メッセージ表示
function showStatus(message) {
    $('status-message').textContent = message;
    $('error-message').textContent = '';
}

// メッセージを消去
function clearMessages() {
    $('error-message').textContent = '';
    $('status-message').textContent = '';
}

// HTMLエスケープ
function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[char]);
}

// 指定した日付の予定を取得
function getEventsForDate(date) {
    return state.events.filter(event =>
        String(event.dates ?? '').slice(0, 10) === date
    );
}

// APIから予定一覧を取得
async function fetchCalenders() {
    clearMessages();

    try {
        const response = await fetch(API_BASE_URL);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error('APIの返却データが配列ではありません。');
        }

        state.events = data;
        renderAll();

    } catch (error) {
        console.error('予定取得エラー:', error);

        showError(
            `予定の取得に失敗しました。${error.message}。` +
            'Spring Bootが起動しているか確認してください。'
        );

        $('today-events').innerHTML =
            '<p class="empty-message">予定を取得できませんでした。</p>';

        $('selected-events').innerHTML =
            '<p class="empty-message">予定を取得できませんでした。</p>';

        $('all-events').innerHTML =
            '<p class="empty-message">予定を取得できませんでした。</p>';
    }
}

// カレンダー表示
function renderCalendar() {
    const year = state.currentMonth.getFullYear();
    const month = state.currentMonth.getMonth();

    $('current-month').textContent = `${year}年${month + 1}月`;

    const firstDay = new Date(year, month, 1);
    const gridStart = new Date(year, month, 1 - firstDay.getDay());
    const today = formatDate(new Date());

    let html = '';

    for (let i = 0; i < 42; i++) {
        const date = new Date(gridStart);
        date.setDate(gridStart.getDate() + i);

        const dateString = formatDate(date);
        const events = getEventsForDate(dateString);

        const classes = [
            'calendar-day',
            date.getMonth() !== month ? 'other-month' : '',
            dateString === today ? 'today' : '',
            dateString === state.selectedDate ? 'selected' : ''
        ].filter(Boolean).join(' ');

        const eventLabels = events.slice(0, 2).map(event =>
            `<span class="day-event">${escapeHTML(event.title)}</span>`
        ).join('');

        const more = events.length > 2
            ? `<span class="more-events">+${events.length - 2}件</span>`
            : '';

        html += `
            <button type="button"
                class="${classes}"
                data-date="${dateString}"
                aria-label="${formatJapaneseDate(dateString)}、予定${events.length}件">
                <span class="day-number">${date.getDate()}</span>
                <span class="day-events">${eventLabels}${more}</span>
            </button>
        `;
    }

    $('calendar-days').innerHTML = html;
}

// 予定カードを作成
function createEventCard(event, showActions = false) {
    const date = parseDate(event.dates);

    const monthDay = date
        ? `${date.getMonth() + 1}/${date.getDate()}`
        : '--/--';

    const category = event.category
        ? `<span class="category-label">${escapeHTML(event.category)}</span>`
        : '';

    const content = event.content
        ? `<p>${escapeHTML(event.content)}</p>`
        : '';

    const eventActions = showActions
        ? `
            <div class="event-actions">
                <button type="button"
                    class="today-button"
                    data-edit-id="${Number(event.id)}">
                    編集
                </button>

                <button type="button"
                    class="delete-button"
                    data-delete-id="${Number(event.id)}">
                    削除
                </button>
            </div>
        `
        : '';

    return `
        <article class="event-card">
            <div class="event-date">
                <strong>${monthDay}</strong>
                ${
        date
            ? ['日', '月', '火', '水', '木', '金', '土'][date.getDay()] + '曜日'
            : ''
    }
            </div>

            <div class="event-info">
                <h3>${escapeHTML(event.title)}</h3>
                ${content}
                ${category}
            </div>

            ${eventActions}
        </article>
    `;
}

// 予定一覧を表示
function renderEventList(
    containerId,
    events,
    emptyMessage,
    showActions = false
) {
    const container = $(containerId);

    if (events.length === 0) {
        container.innerHTML =
            `<p class="empty-message">${escapeHTML(emptyMessage)}</p>`;
        return;
    }

    container.innerHTML = events.map(event =>
        createEventCard(event, showActions)
    ).join('');
}

// 今日の予定
function renderToday() {
    const today = formatDate(new Date());

    $('today-date').textContent = formatJapaneseDate(today);

    renderEventList(
        'today-events',
        getEventsForDate(today),
        '今日は登録されている予定がありません。'
    );
}

// 選択した日の予定
function renderSelectedDate() {
    $('selected-date-title').textContent =
        formatJapaneseDate(state.selectedDate) + ' の予定';

    renderEventList(
        'selected-events',
        getEventsForDate(state.selectedDate),
        'この日の予定はまだありません。'
    );
}

// 登録済みの予定一覧
function renderAllEvents() {
    const events = [...state.events].sort((a, b) =>
        String(a.dates ?? '').localeCompare(String(b.dates ?? ''))
    );

    renderEventList(
        'all-events',
        events,
        '登録されている予定はありません。',
        true
    );
}

// すべての表示を更新
function renderAll() {
    renderCalendar();
    renderToday();
    renderSelectedDate();
    renderAllEvents();
}

// 編集モードを開始
function startEdit(eventId) {
    const calender = state.events.find(
        event => Number(event.id) === Number(eventId)
    );

    if (!calender) {
        showError('編集する予定が見つかりません。');
        return;
    }

    state.editingId = Number(calender.id);

    $('dates').value = String(calender.dates ?? '').slice(0, 10);
    $('title').value = calender.title ?? '';
    $('category').value = calender.category ?? '';
    $('content').value = calender.content ?? '';

    $('save-button').textContent = '変更を保存する';
    $('cancel-edit-button').hidden = false;

    $('event-form').scrollIntoView({ behavior: 'smooth' });
    $('title').focus({ preventScroll: true });

    showStatus('予定を編集中です。');
}

// 編集をキャンセルして新規登録モードに戻す
function cancelEdit() {
    state.editingId = null;

    $('create-form').reset();
    $('dates').value = state.selectedDate;

    $('save-button').textContent = '予定を保存する';
    $('cancel-edit-button').hidden = true;

    clearMessages();
}

// HTMLの読み込みが完了してからイベントを登録
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();

    state.currentMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
    );

    state.selectedDate = formatDate(today);

    // カレンダーの日付選択
    $('calendar-days').addEventListener('click', event => {
        const button = event.target.closest('[data-date]');
        if (!button) return;

        state.selectedDate = button.dataset.date;

        renderCalendar();
        renderSelectedDate();
    });

    // 前の月
    $('prev-month').addEventListener('click', () => {
        state.currentMonth = new Date(
            state.currentMonth.getFullYear(),
            state.currentMonth.getMonth() - 1,
            1
        );

        renderCalendar();
    });

    // 次の月
    $('next-month').addEventListener('click', () => {
        state.currentMonth = new Date(
            state.currentMonth.getFullYear(),
            state.currentMonth.getMonth() + 1,
            1
        );

        renderCalendar();
    });

    // 今月に戻る
    $('today-month').addEventListener('click', () => {
        const now = new Date();

        state.currentMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        state.selectedDate = formatDate(now);

        renderAll();
    });

    // 選択した日付で予定を追加
    $('add-selected-date').addEventListener('click', () => {
        if (state.editingId !== null) {
            cancelEdit();
        }

        $('dates').value = state.selectedDate;
        $('event-form').scrollIntoView({ behavior: 'smooth' });
        $('title').focus({ preventScroll: true });
    });

    // 予定の新規登録・更新
    $('create-form').addEventListener('submit', async event => {
        event.preventDefault();
        clearMessages();

        const calender = {
            dates: $('dates').value,
            title: $('title').value.trim(),
            content: $('content').value.trim(),
            category: $('category').value
        };

        if (!calender.dates || !calender.title || !calender.content) {
            showError('日付・タイトル・内容を入力してください。');
            return;
        }

        const isEditing = state.editingId !== null;
        const eventId = state.editingId;
        const saveButton = $('save-button');

        saveButton.disabled = true;
        saveButton.textContent = isEditing ? '更新中...' : '保存中...';

        try {
            const response = await fetch(
                isEditing
                    ? `${API_BASE_URL}/${eventId}`
                    : API_BASE_URL,
                {
                    method: isEditing ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(calender)
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            state.selectedDate = calender.dates;

            const selected = parseDate(calender.dates);

            state.currentMonth = new Date(
                selected.getFullYear(),
                selected.getMonth(),
                1
            );

            state.editingId = null;

            $('create-form').reset();
            $('dates').value = state.selectedDate;
            $('save-button').textContent = '予定を保存する';
            $('cancel-edit-button').hidden = true;

            await fetchCalenders();

            showStatus(
                isEditing
                    ? '予定を更新しました！'
                    : '予定を保存しました！'
            );

            $('calendar').scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('予定保存エラー:', error);

            showError(
                `${isEditing ? '予定の更新' : '予定の登録'}に失敗しました。${error.message}`
            );

        } finally {
            saveButton.disabled = false;

            saveButton.textContent =
                state.editingId !== null
                    ? '変更を保存する'
                    : '予定を保存する';
        }
    });

    // 予定の編集
    $('all-events').addEventListener('click', event => {
        const button = event.target.closest('[data-edit-id]');
        if (!button) return;

        startEdit(button.dataset.editId);
    });

    // 編集キャンセル
    $('cancel-edit-button').addEventListener('click', cancelEdit);

    // 予定の削除
    $('all-events').addEventListener('click', async event => {
        const button = event.target.closest('[data-delete-id]');
        if (!button) return;

        const id = button.dataset.deleteId;

        if (!confirm(`ID ${id} の予定を削除しますか？`)) {
            return;
        }

        clearMessages();
        button.disabled = true;

        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            if (state.editingId === Number(id)) {
                cancelEdit();
            }

            await fetchCalenders();

            showStatus(`ID ${id} の予定を削除しました。`);

        } catch (error) {
            console.error('予定削除エラー:', error);
            showError(`予定の削除に失敗しました。${error.message}`);
        }
    });

    // 予定一覧の再取得
    $('refresh-button').addEventListener('click', fetchCalenders);

    // 初期表示
    $('dates').value = state.selectedDate;

    renderAll();
    fetchCalenders();
});

/* IDを指定して予定を1件取得 */
$('search-form').addEventListener('submit', async event => {
    event.preventDefault();

    const id = $('search-id').value;
    const result = $('search-result');
    const errorMessage = $('search-error');

    errorMessage.textContent = '';
    result.innerHTML = '';

    if (!id || Number(id) < 1) {
        errorMessage.textContent = '正しいIDを入力してください。';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('指定したIDの予定が見つかりません。');
            }

            throw new Error(`取得に失敗しました（HTTP ${response.status}）`);
        }

        const eventData = await response.json();

        result.innerHTML = createEventCard(eventData);

    } catch (error) {
        console.error('1件取得エラー:', error);
        errorMessage.textContent = error.message;
    }
});