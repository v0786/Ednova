/**
 * @fileoverview Unit tests for TimetableView component
 * TASK-20251017-FRONTEND-003: Week-view Timetable
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import TimetableView from './TimetableView';
import type { TeacherScheduleEntry } from '@/lib/actions/timetableActions';

// Mock the server action
vi.mock('@/lib/actions/timetableActions', () => ({
  getTeacherSchedule: vi.fn(),
}));

import { getTeacherSchedule } from '@/lib/actions/timetableActions';

describe('TimetableView', () => {
  const mockGetTeacherSchedule = getTeacherSchedule as Mock;

  // Mock schedule data factory
  const createMockScheduleEntry = (overrides: Partial<TeacherScheduleEntry> = {}): TeacherScheduleEntry => ({
    id: 'entry-001',
    classId: 'div-001',
    subject: 'Mathematics',
    subjectCode: 'MATH101',
    grade: 'Grade 7',
    division: 'Section A',
    day: 1, // Monday
    startTime: '08:00',
    endTime: '09:00',
    room: 'Room 101',
    periodNumber: 1,
    ...overrides,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    // Set a fixed time for consistent testing (10:30 AM on a Monday)
    const fixedDate = new Date(2025, 9, 13, 10, 30, 0); // Monday, Oct 13, 2025, 10:30 AM
    vi.setSystemTime(fixedDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('loading state', () => {
    it('should show loading state when fetching schedule', async () => {
      mockGetTeacherSchedule.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      );

      render(<TimetableView />);

      expect(screen.getByText(/loading your schedule/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(mockGetTeacherSchedule).toHaveBeenCalled();
      });
    });
  });

  describe('empty state', () => {
    it('should show empty state when no classes scheduled', async () => {
      mockGetTeacherSchedule.mockResolvedValue({
        success: true,
        data: [],
        academicYearId: 'ay-2025',
        academicYearName: '2025-2026',
        schoolId: 'sch-001',
      });

      render(<TimetableView />);

      await waitFor(() => {
        expect(screen.getByText(/no classes scheduled this week/i)).toBeInTheDocument();
      });

      expect(screen.getByText(/your timetable is empty/i)).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('should display error message when schedule fetch fails', async () => {
      mockGetTeacherSchedule.mockResolvedValue({
        success: false,
        error: 'Failed to load schedule',
        data: [],
        academicYearId: '',
        academicYearName: '',
        schoolId: '',
      });

      render(<TimetableView />);

      await waitFor(() => {
        expect(screen.getByText(/failed to load schedule/i)).toBeInTheDocument();
      });
    });

    it('should handle unexpected errors gracefully', async () => {
      mockGetTeacherSchedule.mockRejectedValue(new Error('Network error'));

      render(<TimetableView />);

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });
  });

  describe('weekly schedule display', () => {
    it('should display all days of the week (Mon-Sat)', async () => {
      mockGetTeacherSchedule.mockResolvedValue({
        success: true,
        data: [],
        academicYearId: 'ay-2025',
        academicYearName: '2025-2026',
        schoolId: 'sch-001',
      });

      render(<TimetableView />);

      await waitFor(() => {
        expect(screen.getByText('Monday')).toBeInTheDocument();
      });

      expect(screen.getByText('Tuesday')).toBeInTheDocument();
      expect(screen.getByText('Wednesday')).toBeInTheDocument();
      expect(screen.getByText('Thursday')).toBeInTheDocument();
      expect(screen.getByText('Friday')).toBeInTheDocument();
      expect(screen.getByText('Saturday')).toBeInTheDocument();
    });

    it('should highlight the current day', async () => {
      mockGetTeacherSchedule.mockResolvedValue({
        success: true,
        data: [],
        academicYearId: 'ay-2025',
        academicYearName: '2025-2026',
        schoolId: 'sch-001',
      });

      render(<TimetableView />);

      await waitFor(() => {
        // Monday is the current day in our test setup
        expect(screen.getByText('TODAY')).toBeInTheDocument();
      });
    });

    it('should display classes for each day', async () => {
      const mockData = [
        createMockScheduleEntry({ id: '1', day: 1, subject: 'Mathematics' }),
        createMockScheduleEntry({ id: '2', day: 2, subject: 'Science' }),
        createMockScheduleEntry({ id: '3', day: 3, subject: 'English' }),
      ];

      mockGetTeacherSchedule.mockResolvedValue({
        success: true,
        data: mockData,
        academicYearId: 'ay-2025',
        academicYearName: '2025-2026',
        schoolId: 'sch-001',
      });

      render(<TimetableView />);

      await waitFor(() => {
        expect(screen.getByText('Mathematics')).toBeInTheDocument();
      });

      expect(screen.getByText('Science')).toBeInTheDocument();
      expect(screen.getByText('English')).toBeInTheDocument();
    });

    it('should display class count in header', async () => {
      const mockData = [
        createMockScheduleEntry({ id: '1' }),
        createMockScheduleEntry({ id: '2' }),
        createMockScheduleEntry({ id: '3' }),
      ];

      mockGetTeacherSchedule.mockResolvedValue({
        success: true,
        data: mockData,
        academicYearId: 'ay-2025',
        academicYearName: '2025-2026',
        schoolId: 'sch-001',
      });

      render(<TimetableView />);

      await waitFor(() => {
        expect(screen.getByText(/3 classes scheduled this week/i)).toBeInTheDocument();
      });
    });
  });

  describe('subject colors', () => {
    it('should apply indigo colors for Mathematics', async () => {
      const mockData = [createMockScheduleEntry({ subject: 'Mathematics' })];

      mockGetTeacherSchedule.mockResolvedValue({
        success: true,
        data: mockData,
        academicYearId: 'ay-2025',
        academicYearName: '2025-2026',
        schoolId: 'sch-001',
      });

      const { container } = render(<TimetableView />);

      await waitFor(() => {
        expect(screen.getByText('Mathematics')).toBeInTheDocument();
      });

      const classBlock = container.querySelector('[role="button"]');
      expect(classBlock?.className).toContain('bg-indigo-500/20');
    });

    it('should apply emerald colors for Science', async () => {
      const mockData = [createMockScheduleEntry({ subject: 'Science' })];

      mockGetTeacherSchedule.mockResolvedValue({
        success: true,
        data: mockData,
        academicYearId: 'ay-2025',
        academicYearName: '2025-2026',
        schoolId: 'sch-001',
      });

      const { container } = render(<TimetableView />);

      await waitFor(() => {
        expect(screen.getByText('Science')).toBeInTheDocument();
      });

      const classBlock = container.querySelector('[role="button"]');
      expect(classBlock?.className).toContain('bg-emerald-500/20');
    });

    it('should apply blue colors for English', async () => {
      const mockData = [createMockScheduleEntry({ subject: 'English' })];

      mockGetTeacherSchedule.mockResolvedValue({
        success: true,
        data: mockData,
        academicYearId: 'ay-2025',
        academicYearName: '2025-2026',
        schoolId: 'sch-001',
      });

      const { container } = render(<TimetableView />);

      await waitFor(() => {
        expect(screen.getByText('English')).toBeInTheDocument();
      });

      const classBlock = container.querySelector('[role="button"]');
      expect(classBlock?.className).toContain('bg-blue-500/20');
    });

    it('should apply default colors for unknown subjects', async () => {
      const mockData = [createMockScheduleEntry({ subject: 'SomeUnknownSubject' })];

      mockGetTeacherSchedule.mockResolvedValue({
        success: true,
        data: mockData,
        academicYearId: 'ay-2025',
        academicYearName: '2025-2026',
        schoolId: 'sch-001',
      });

      const { container } = render(<TimetableView />);

      await waitFor(() => {
        expect(screen.getByText('SomeUnknownSubject')).toBeInTheDocument();
      });

      const classBlock = container.querySelector('[role="button"]');
      expect(classBlock?.className).toContain('bg-slate-500/20');
    });
  });

  describe('class modal', () => {
    it('should open modal when clicking a class', async () => {
      const mockData = [createMockScheduleEntry({ id: '1', subject: 'Mathematics' })];

      mockGetTeacherSchedule.mockResolvedValue({
        success: true,
        data: mockData,
        academicYearId: 'ay-2025',
        academicYearName: '2025-2026',
        schoolId: 'sch-001',
      });

      render(<TimetableView />);

      await waitFor(() => {
        expect(screen.getByText('Mathematics')).toBeInTheDocument();
      });

      const classBlock = screen.getByRole('button', { name: /mathematics/i });
      fireEvent.click(classBlock);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Mathematics')).toBeInTheDocument();
      expect(screen.getByText('Take Attendance')).toBeInTheDocument();
      expect(screen.getByText('Lesson Log')).toBeInTheDocument();
    });

    it('should close modal when clicking close button', async () => {
      const mockData = [createMockScheduleEntry({ id: '1', subject: 'Mathematics' })];

      mockGetTeacherSchedule.mockResolvedValue({
        success: true,
        data: mockData,
        academicYearId: 'ay-2025',
        academicYearName: '2025-2026',
        schoolId: 'sch-001',
      });

      render(<TimetableView />);

      await waitFor(() => {
        expect(screen.getByText('Mathematics')).toBeInTheDocument();
      });

      const classBlock = screen.getByRole('button', { name: /mathematics/i });
      fireEvent.click(classBlock);

      expect(screen.getByRole('dialog')).toBeInTheDocument();

      const closeButton = screen.getByLabelText('Close modal');
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('should display class details in modal', async () => {
      const mockData = [
        createMockScheduleEntry({
          id: '1',
          subject: 'Mathematics',
          subjectCode: 'MATH101',
          grade: 'Grade 8',
          division: 'Section B',
          room: 'Room 202',
          startTime: '09:00',
          endTime: '10:30',
        }),
      ];

      mockGetTeacherSchedule.mockResolvedValue({
        success: true,
        data: mockData,
        academicYearId: 'ay-2025',
        academicYearName: '2025-2026',
        schoolId: 'sch-001',
      });

      render(<TimetableView />);

      await waitFor(() => {
        expect(screen.getByText('Mathematics')).toBeInTheDocument();
      });

      const classBlock = screen.getByRole('button', { name: /mathematics/i });
      fireEvent.click(classBlock);

      expect(screen.getByText('Code: MATH101')).toBeInTheDocument();
      expect(screen.getByText('Grade 8')).toBeInTheDocument();
      expect(screen.getByText('Section B')).toBeInTheDocument();
      expect(screen.getByText('Room 202')).toBeInTheDocument();
    });

    it('should show "Room TBA" when room is not provided', async () => {
      const mockData = [createMockScheduleEntry({ room: null })];

      mockGetTeacherSchedule.mockResolvedValue({
        success: true,
        data: mockData,
        academicYearId: 'ay-2025',
        academicYearName: '2025-2026',
        schoolId: 'sch-001',
      });

      render(<TimetableView />);

      await waitFor(() => {
        expect(screen.getByText('Mathematics')).toBeInTheDocument();
      });

      const classBlock = screen.getByRole('button', { name: /mathematics/i });
      fireEvent.click(classBlock);

      expect(screen.getByText('Room TBA')).toBeInTheDocument();
    });
  });

  describe('time display', () => {
    it('should format times in 12-hour format', async () => {
      const mockData = [
        createMockScheduleEntry({ startTime: '08:00', endTime: '09:30' }),
      ];

      mockGetTeacherSchedule.mockResolvedValue({
        success: true,
        data: mockData,
        academicYearId: 'ay-2025',
        academicYearName: '2025-2026',
        schoolId: 'sch-001',
      });

      render(<TimetableView />);

      await waitFor(() => {
        expect(screen.getByText('Mathematics')).toBeInTheDocument();
      });

      expect(screen.getByText(/8:00 AM/i)).toBeInTheDocument();
      expect(screen.getByText(/9:30 AM/i)).toBeInTheDocument();
    });

    it('should display PM times correctly', async () => {
      const mockData = [
        createMockScheduleEntry({ startTime: '13:00', endTime: '14:30' }),
      ];

      mockGetTeacherSchedule.mockResolvedValue({
        success: true,
        data: mockData,
        academicYearId: 'ay-2025',
        academicYearName: '2025-2026',
        schoolId: 'sch-001',
      });

      render(<TimetableView />);

      await waitFor(() => {
        expect(screen.getByText('Mathematics')).toBeInTheDocument();
      });

      expect(screen.getByText(/1:00 PM/i)).toBeInTheDocument();
      expect(screen.getByText(/2:30 PM/i)).toBeInTheDocument();
    });
  });

  describe('mobile view', () => {
    it('should render mobile day navigation', async () => {
      const mockData = [createMockScheduleEntry({ day: 1 })];

      mockGetTeacherSchedule.mockResolvedValue({
        success: true,
        data: mockData,
        academicYearId: 'ay-2025',
        academicYearName: '2025-2026',
        schoolId: 'sch-001',
      });

      // Mock window.innerWidth for mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      window.dispatchEvent(new Event('resize'));

      render(<TimetableView />);

      await waitFor(() => {
        expect(screen.getByLabelText('Previous day')).toBeInTheDocument();
        expect(screen.getByLabelText('Next day')).toBeInTheDocument();
      });
    });

    it('should show day quick switch buttons', async () => {
      const mockData = [];

      mockGetTeacherSchedule.mockResolvedValue({
        success: true,
        data: mockData,
        academicYearId: 'ay-2025',
        academicYearName: '2025-2026',
        schoolId: 'sch-001',
      });

      render(<TimetableView />);

      await waitFor(() => {
        // Should show short day names for quick switching
        expect(screen.getByText('Mon')).toBeInTheDocument();
        expect(screen.getByText('Tue')).toBeInTheDocument();
        expect(screen.getByText('Wed')).toBeInTheDocument();
        expect(screen.getByText('Thu')).toBeInTheDocument();
        expect(screen.getByText('Fri')).toBeInTheDocument();
        expect(screen.getByText('Sat')).toBeInTheDocument();
      });
    });
  });

  describe('drag and drop', () => {
    it('should render draggable class blocks', async () => {
      const mockData = [createMockScheduleEntry({ id: '1' })];

      mockGetTeacherSchedule.mockResolvedValue({
        success: true,
        data: mockData,
        academicYearId: 'ay-2025',
        academicYearName: '2025-2026',
        schoolId: 'sch-001',
      });

      render(<TimetableView />);

      await waitFor(() => {
        const classBlock = screen.getByRole('button');
        expect(classBlock).toHaveAttribute('draggable', 'true');
      });
    });
  });

  describe('teacherId prop', () => {
    it('should pass teacherId to getTeacherSchedule when provided', async () => {
      mockGetTeacherSchedule.mockResolvedValue({
        success: true,
        data: [],
        academicYearId: 'ay-2025',
        academicYearName: '2025-2026',
        schoolId: 'sch-001',
      });

      render(<TimetableView teacherId="teacher-123" />);

      await waitFor(() => {
        expect(mockGetTeacherSchedule).toHaveBeenCalledWith('teacher-123');
      });
    });

    it('should call getTeacherSchedule without args when teacherId not provided', async () => {
      mockGetTeacherSchedule.mockResolvedValue({
        success: true,
        data: [],
        academicYearId: 'ay-2025',
        academicYearName: '2025-2026',
        schoolId: 'sch-001',
      });

      render(<TimetableView />);

      await waitFor(() => {
        expect(mockGetTeacherSchedule).toHaveBeenCalledWith(undefined);
      });
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA labels on class blocks', async () => {
      const mockData = [createMockScheduleEntry({ subject: 'Mathematics', startTime: '08:00' })];

      mockGetTeacherSchedule.mockResolvedValue({
        success: true,
        data: mockData,
        academicYearId: 'ay-2025',
        academicYearName: '2025-2026',
        schoolId: 'sch-001',
      });

      render(<TimetableView />);

      await waitFor(() => {
        const classBlock = screen.getByRole('button', { name: /mathematics at 8:00 am/i });
        expect(classBlock).toBeInTheDocument();
      });
    });

    it('should open modal on Enter key press', async () => {
      const mockData = [createMockScheduleEntry({ id: '1', subject: 'Mathematics' })];

      mockGetTeacherSchedule.mockResolvedValue({
        success: true,
        data: mockData,
        academicYearId: 'ay-2025',
        academicYearName: '2025-2026',
        schoolId: 'sch-001',
      });

      render(<TimetableView />);

      await waitFor(() => {
        expect(screen.getByText('Mathematics')).toBeInTheDocument();
      });

      const classBlock = screen.getByRole('button', { name: /mathematics/i });
      fireEvent.keyDown(classBlock, { key: 'Enter' });

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should have proper heading structure', async () => {
      mockGetTeacherSchedule.mockResolvedValue({
        success: true,
        data: [],
        academicYearId: 'ay-2025',
        academicYearName: '2025-2026',
        schoolId: 'sch-001',
      });

      render(<TimetableView />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /weekly timetable/i })).toBeInTheDocument();
      });
    });
  });

  describe('class information display', () => {
    it('should display grade and division information', async () => {
      const mockData = [
        createMockScheduleEntry({ grade: 'Grade 10', division: 'Honors' }),
      ];

      mockGetTeacherSchedule.mockResolvedValue({
        success: true,
        data: mockData,
        academicYearId: 'ay-2025',
        academicYearName: '2025-2026',
        schoolId: 'sch-001',
      });

      render(<TimetableView />);

      await waitFor(() => {
        expect(screen.getByText(/grade 10/i)).toBeInTheDocument();
        expect(screen.getByText(/honors/i)).toBeInTheDocument();
      });
    });

    it('should display room information when available', async () => {
      const mockData = [createMockScheduleEntry({ room: 'Science Lab A' })];

      mockGetTeacherSchedule.mockResolvedValue({
        success: true,
        data: mockData,
        academicYearId: 'ay-2025',
        academicYearName: '2025-2026',
        schoolId: 'sch-001',
      });

      render(<TimetableView />);

      await waitFor(() => {
        expect(screen.getByText('Science Lab A')).toBeInTheDocument();
      });
    });
  });
});
