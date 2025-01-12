const monthDisplay = document.getElementById('calendarMonth');
const calendarBody = document.getElementById('calendarBody');
const toggleButton = document.getElementById('toggleViewButton');

let currentDate = new Date();
let viewMode = 'week'; // Tracks whether we're in 'week' or 'month' view
let events = JSON.parse(localStorage.getItem('events')) || {};

function displayCalendar() {
    calendarBody.innerHTML = ''; // Clear previous content
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    if (viewMode === 'month') {
        monthDisplay.textContent = `${monthNames[month]} ${year}`;
        let day = 1;

        for (let i = 0; i < 6; i++) {
            const row = document.createElement('tr');
            for (let j = 0; j < 9; j++) { // Loop through 9 columns (including blanks)
                const cell = document.createElement('td');

                if (j === 0 || j === 8) { 
                    // Blank columns for first and last
                    cell.textContent = '';
                    cell.className = 'blankColumn';
                } else if (i === 0 && j - 1 < firstDay) {
                    // Blank cells before the first day of the month
                    cell.textContent = '';
                } else if (day > daysInMonth) {
                    // Blank cells after the last day of the month
                    cell.textContent = '';
                } else {
                    // Fill day numbers and events
                    cell.textContent = day;
                    addEventCell(cell, year, month + 1, day);
                    day++;
                }
                row.appendChild(cell);
            }
            calendarBody.appendChild(row);
        }
    } else {
        const weekStart = getWeekStart(currentDate);
        monthDisplay.textContent = `Week of ${weekStart.toLocaleDateString()}`;
        
        const row = document.createElement('tr');
        for (let i = 0; i < 9; i++) { // Loop through 9 columns (including blanks)
            const cell = document.createElement('td');

            if (i === 0 || i === 8) {
                // Blank columns for first and last
                cell.textContent = '';
                cell.className = 'blankColumn';
            } else {
                // Fill week day numbers and events
                const day = new Date(weekStart);
                day.setDate(day.getDate() + (i - 1)); // Adjust to account for blank column
                cell.textContent = day.getDate();
                addEventCell(cell, day.getFullYear(), day.getMonth() + 1, day.getDate());
            }
            row.appendChild(cell);
        }
        calendarBody.appendChild(row);
    }
}

function getWeekStart(date) {
    const dayOfWeek = date.getDay();
    const start = new Date(date);
    start.setDate(date.getDate() - dayOfWeek);
    return start;
}

function changeTime(offset) {
    if (viewMode === 'month') {
        currentDate.setMonth(currentDate.getMonth() + offset);
    } else {
        currentDate.setDate(currentDate.getDate() + offset * 7);
    }
    displayCalendar();
}

function toggleView() {
    viewMode = viewMode === 'month' ? 'week' : 'month';
    toggleButton.textContent = viewMode === 'month' ? 'Show Week View' : 'Show Month View';
    displayCalendar();
}

function addEventCell(cell, year, month, day) {
    const dateKey = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    cell.setAttribute('data-date', dateKey);
    cell.className = 'calendarCell';
    cell.addEventListener('click', () => openModal(dateKey));

    if (Array.isArray(events[dateKey])) {
        events[dateKey].forEach(event => {
            const eventDiv = document.createElement('div');
            eventDiv.className = 'eventText';
            eventDiv.textContent = event.text;
            cell.appendChild(eventDiv);
        });
    }
}

function openModal(dateKey) {
    // Open modal logic here
}

function addEvent() {
    // Add event logic here
}

function formatDateKey(date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

// Initialize the calendar with the current view
displayCalendar();