/**
 * Teacher Assignment Calendar - Main Application Logic
 */

class CalendarApp {
    constructor() {
        this.currentDate = new Date();
        this.selectedClass = null;
        this.selectedAssignment = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderCalendar();
        this.renderClasses();
        this.renderUpcomingAssignments();
    }

    setupEventListeners() {
        document.getElementById('prevMonth').addEventListener('click', () => this.previousMonth());
        document.getElementById('nextMonth').addEventListener('click', () => this.nextMonth());
        document.getElementById('todayBtn').addEventListener('click', () => this.goToToday());

        document.getElementById('addClassBtn').addEventListener('click', () => this.openAddClassModal());
        document.getElementById('closeClassModal').addEventListener('click', () => this.closeAddClassModal());
        document.getElementById('addClassForm').addEventListener('submit', (e) => this.handleAddClass(e));

        document.getElementById('quickAddForm').addEventListener('submit', (e) => this.handleAddAssignment(e));
        document.getElementById('closeAssignmentModal').addEventListener('click', () => this.closeAssignmentModal());
        document.getElementById('closeModalBtn').addEventListener('click', () => this.closeAssignmentModal());
        document.getElementById('completeBtn').addEventListener('click', () => this.completeSelectedAssignment());
        document.getElementById('deleteBtn').addEventListener('click', () => this.deleteSelectedAssignment());

        document.getElementById('addClassModal').addEventListener('click', (e) => {
            if (e.target.id === 'addClassModal') this.closeAddClassModal();
        });
        document.getElementById('assignmentModal').addEventListener('click', (e) => {
            if (e.target.id === 'assignmentModal') this.closeAssignmentModal();
        });
    }

    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        const monthName = this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        document.getElementById('currentMonth').textContent = monthName;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        const calendarDays = document.getElementById('calendarDays');
        calendarDays.innerHTML = '';

        for (let i = firstDay - 1; i >= 0; i--) {
            const dayDiv = this.createDayElement(daysInPrevMonth - i, true, new Date(year, month - 1, daysInPrevMonth - i));
            calendarDays.appendChild(dayDiv);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = this.createDayElement(day, false, new Date(year, month, day));
            calendarDays.appendChild(dayDiv);
        }

        const totalCells = calendarDays.children.length;
        const remainingCells = (7 - (totalCells % 7)) % 7;
        for (let day = 1; day <= remainingCells; day++) {
            const dayDiv = this.createDayElement(day, true, new Date(year, month + 1, day));
            calendarDays.appendChild(dayDiv);
        }
    }

    createDayElement(day, isOtherMonth, date) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';

        if (isOtherMonth) {
            dayDiv.classList.add('other-month');
        }

        const today = new Date();
        if (date.toDateString() === today.toDateString()) {
            dayDiv.classList.add('today');
        }

        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayDiv.appendChild(dayNumber);

        const dateStr = date.toISOString().split('T')[0];
        const assignments = db.getAssignmentsByDate(dateStr);

        if (assignments.length > 0) {
            const assignmentsDiv = document.createElement('div');
            assignmentsDiv.className = 'assignments-in-day';

            assignments.forEach(assignment => {
                const badge = document.createElement('div');
                badge.className = `assignment-badge ${assignment.type}`;
                if (assignment.status === 'completed') {
                    badge.classList.add('completed');
                }

                const typeEmoji = {
                    homework: '📝',
                    test: '📋',
                    project: '🎨'
                };

                badge.textContent = `${typeEmoji[assignment.type]} ${assignment.title}`;
                badge.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.openAssignmentModal(assignment);
                });

                assignmentsDiv.appendChild(badge);
            });

            dayDiv.appendChild(assignmentsDiv);
        }

        return dayDiv;
    }

    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.renderCalendar();
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.renderCalendar();
    }

    goToToday() {
        this.currentDate = new Date();
        this.renderCalendar();
    }

    renderClasses() {
        const classes = db.getAllClasses();
        const classesList = document.getElementById('classesList');
        const classSelect = document.getElementById('assignmentClass');

        classesList.innerHTML = '';
        classSelect.innerHTML = '<option value="">Select class</option>';

        classes.forEach(cls => {
            const classItem = document.createElement('div');
            classItem.className = 'class-item';
            classItem.innerHTML = `<strong>${cls.name}</strong><br><small>${cls.code}</small>`;
            classItem.addEventListener('click', () => this.selectClass(cls.id));
            classesList.appendChild(classItem);

            const option = document.createElement('option');
            option.value = cls.id;
            option.textContent = `${cls.name} (${cls.code})`;
            classSelect.appendChild(option);
        });
    }

    selectClass(classId) {
        this.selectedClass = classId;
        document.querySelectorAll('.class-item').forEach(item => {
            item.classList.remove('active');
        });
        event.target.closest('.class-item')?.classList.add('active');
    }

    openAddClassModal() {
        document.getElementById('addClassModal').classList.add('active');
    }

    closeAddClassModal() {
        document.getElementById('addClassModal').classList.remove('active');
        document.getElementById('addClassForm').reset();
    }

    handleAddClass(e) {
        e.preventDefault();

        const classData = {
            name: document.getElementById('className').value,
            code: document.getElementById('classCode').value,
            description: document.getElementById('classDesc').value
        };

        if (classData.name && classData.code) {
            db.createClass(classData);
            this.renderClasses();
            this.closeAddClassModal();
            alert('✅ Class added successfully!');
        }
    }

    handleAddAssignment(e) {
        e.preventDefault();

        const classId = document.getElementById('assignmentClass').value;
        if (!classId) {
            alert('Please select a class');
            return;
        }

        const assignmentData = {
            title: document.getElementById('assignmentTitle').value,
            classId: parseInt(classId),
            dueDate: document.getElementById('assignmentDate').value,
            type: document.getElementById('assignmentType').value,
            description: document.getElementById('assignmentDesc').value
        };

        if (assignmentData.title && assignmentData.dueDate) {
            db.createAssignment(assignmentData);
            this.renderCalendar();
            this.renderUpcomingAssignments();
            document.getElementById('quickAddForm').reset();
            alert('✅ Assignment added successfully!');
        }
    }

    renderUpcomingAssignments() {
        const assignments = db.getUpcomingAssignments(14);
        const upcomingList = document.getElementById('upcomingList');

        upcomingList.innerHTML = '';

        if (assignments.length === 0) {
            upcomingList.innerHTML = '<p style="color: #999; font-size: 0.9rem;">No upcoming assignments</p>';
            return;
        }

        assignments.forEach(assignment => {
            const item = document.createElement('div');
            item.className = `upcoming-item ${assignment.type}`;
            const classData = db.getClassById(assignment.classId);
            const dueDate = new Date(assignment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            item.innerHTML = `
                <strong>${assignment.title}</strong><br>
                <small>${classData?.name || 'Unknown'}</small><br>
                <small style="opacity: 0.7;">${dueDate}</small>
            `;
            item.addEventListener('click', () => this.openAssignmentModal(assignment));
            upcomingList.appendChild(item);
        });
    }

    openAssignmentModal(assignment) {
        this.selectedAssignment = assignment;
        const classData = db.getClassById(assignment.classId);
        const modal = document.getElementById('assignmentModal');

        document.getElementById('modalTitle').textContent = assignment.title;

        const typeEmoji = {
            homework: '📝 Homework',
            test: '📋 Test',
            project: '🎨 Project'
        };

        const statusBadge = assignment.status === 'completed' ? '✅ Completed' : '⏳ Pending';

        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div class="detail-item">
                <div class="detail-label">Type</div>
                <div class="detail-value">${typeEmoji[assignment.type]}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Class</div>
                <div class="detail-value">${classData?.name} (${classData?.code})</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Due Date</div>
                <div class="detail-value">${new Date(assignment.dueDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Status</div>
                <div class="detail-value">${statusBadge}</div>
            </div>
            ${assignment.description ? `
            <div class="detail-item">
                <div class="detail-label">Description</div>
                <div class="detail-value">${assignment.description}</div>
            </div>
            ` : ''}
            <div class="detail-item">
                <div class="detail-label">Created</div>
                <div class="detail-value">${new Date(assignment.createdAt).toLocaleDateString()}</div>
            </div>
        `;

        modal.classList.add('active');
    }

    closeAssignmentModal() {
        document.getElementById('assignmentModal').classList.remove('active');
        this.selectedAssignment = null;
    }

    completeSelectedAssignment() {
        if (this.selectedAssignment) {
            db.completeAssignment(this.selectedAssignment.id);
            this.renderCalendar();
            this.renderUpcomingAssignments();
            this.closeAssignmentModal();
            alert('✅ Assignment marked as completed!');
        }
    }

    deleteSelectedAssignment() {
        if (this.selectedAssignment && confirm('Are you sure you want to delete this assignment?')) {
            db.deleteAssignment(this.selectedAssignment.id);
            this.renderCalendar();
            this.renderUpcomingAssignments();
            this.closeAssignmentModal();
            alert('🗑 Assignment deleted!');
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new CalendarApp();
    });
} else {
    new CalendarApp();
}