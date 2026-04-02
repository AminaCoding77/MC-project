/**
 * Database Manager - Handles all data operations using LocalStorage
 */

class Database {
    constructor() {
        this.STORAGE_KEY_CLASSES = 'teacher_classes';
        this.STORAGE_KEY_ASSIGNMENTS = 'teacher_assignments';
        this.initializeStorage();
    }

    initializeStorage() {
        if (!localStorage.getItem(this.STORAGE_KEY_CLASSES)) {
            localStorage.setItem(this.STORAGE_KEY_CLASSES, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.STORAGE_KEY_ASSIGNMENTS)) {
            localStorage.setItem(this.STORAGE_KEY_ASSIGNMENTS, JSON.stringify([]));
        }
    }

    // CLASS OPERATIONS
    createClass(classData) {
        const classes = this.getAllClasses();
        const newClass = {
            id: Date.now(),
            name: classData.name,
            code: classData.code,
            description: classData.description || '',
            createdAt: new Date().toISOString()
        };
        classes.push(newClass);
        localStorage.setItem(this.STORAGE_KEY_CLASSES, JSON.stringify(classes));
        return newClass;
    }

    getAllClasses() {
        const data = localStorage.getItem(this.STORAGE_KEY_CLASSES);
        return data ? JSON.parse(data) : [];
    }

    getClassById(id) {
        return this.getAllClasses().find(c => c.id == id);
    }

    updateClass(id, updates) {
        let classes = this.getAllClasses();
        classes = classes.map(c => c.id == id ? { ...c, ...updates } : c);
        localStorage.setItem(this.STORAGE_KEY_CLASSES, JSON.stringify(classes));
    }

    deleteClass(id) {
        let classes = this.getAllClasses();
        classes = classes.filter(c => c.id != id);
        localStorage.setItem(this.STORAGE_KEY_CLASSES, JSON.stringify(classes));
    }

    // ASSIGNMENT OPERATIONS
    createAssignment(assignmentData) {
        const assignments = this.getAllAssignments();
        const newAssignment = {
            id: Date.now(),
            title: assignmentData.title,
            classId: assignmentData.classId,
            dueDate: assignmentData.dueDate,
            type: assignmentData.type,
            description: assignmentData.description || '',
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        assignments.push(newAssignment);
        localStorage.setItem(this.STORAGE_KEY_ASSIGNMENTS, JSON.stringify(assignments));
        return newAssignment;
    }

    getAllAssignments() {
        const data = localStorage.getItem(this.STORAGE_KEY_ASSIGNMENTS);
        return data ? JSON.parse(data) : [];
    }

    getAssignmentById(id) {
        return this.getAllAssignments().find(a => a.id == id);
    }

    getAssignmentsByDate(date) {
        return this.getAllAssignments().filter(a => a.dueDate === date);
    }

    getAssignmentsByClass(classId) {
        return this.getAllAssignments().filter(a => a.classId == classId);
    }

    getAssignmentsByMonth(year, month) {
        const monthStr = String(month + 1).padStart(2, '0');
        const yearStr = year;
        return this.getAllAssignments().filter(a => {
            return a.dueDate.startsWith(`${yearStr}-${monthStr}`);
        });
    }

    getUpcomingAssignments(days = 14) {
        const today = new Date();
        const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
        
        return this.getAllAssignments()
            .filter(a => {
                const assignDate = new Date(a.dueDate);
                return assignDate >= today && assignDate <= futureDate;
            })
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }

    updateAssignment(id, updates) {
        let assignments = this.getAllAssignments();
        assignments = assignments.map(a => a.id == id ? { ...a, ...updates } : a);
        localStorage.setItem(this.STORAGE_KEY_ASSIGNMENTS, JSON.stringify(assignments));
    }

    completeAssignment(id) {
        this.updateAssignment(id, { status: 'completed' });
    }

    deleteAssignment(id) {
        let assignments = this.getAllAssignments();
        assignments = assignments.filter(a => a.id != id);
        localStorage.setItem(this.STORAGE_KEY_ASSIGNMENTS, JSON.stringify(assignments));
    }
}

const db = new Database();