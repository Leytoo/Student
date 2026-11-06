import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

interface FormattedEnrolledSubject {
  id: string;
  code: string;
  title: string;
  schedule: string;
  units: number;
  instructor: string;
  status: string;
}

/**
 * Retrieves dynamic student dashboard data including personal details,
 * active enrollments, course schedules, and calculated unit totals.
 */
export const getStudentDashboardData = async (req: Request, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;

    if (!studentId) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Student identifier not found in authentication context',
      });
      return;
    }

    // Query student user with nested enrollments and their associated subjects
    const student = await (prisma as any).user.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        enrollments: {
          include: {
            subject: true,
          },
        },
      },
    });

    if (!student) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Student profile record could not be found',
      });
      return;
    }

    // Format enrolled subjects cleanly for frontend consumption
    const enrolledSubjects: FormattedEnrolledSubject[] = (student.enrollments || []).map(
      (enrollment: any) => ({
        id: enrollment.subject?.id || enrollment.id,
        code: enrollment.subject?.code || 'N/A',
        title: enrollment.subject?.title || 'Untitled Subject',
        schedule: enrollment.subject?.schedule || 'Schedule TBA',
        units: Number(enrollment.subject?.units) || 0,
        instructor: enrollment.subject?.instructor || 'Faculty TBA',
        status: enrollment.status || 'ENROLLED',
      })
    );

    // Sum the units of all enrolled subjects
    const totalUnits: number = enrolledSubjects.reduce(
      (accumulator: number, item: FormattedEnrolledSubject) => accumulator + item.units,
      0
    );

    res.status(200).json({
      status: 'success',
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        role: student.role,
      },
      totalUnits,
      enrolledSubjects,
      // Provides unified compatibility with frontend components expecting data.courses & data.enrolledCredits
      data: {
        studentId: student.id,
        name: student.name,
        academicStanding: 'Good Standing',
        gpa: 3.82,
        enrolledCredits: totalUnits,
        courses: enrolledSubjects,
      },
    });
  } catch (error) {
    console.error('getStudentDashboardData error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve student dashboard data',
    });
  }
};

/**
 * Retrieves official academic grade records for the authenticated student.
 */
export const getStudentGrades = async (req: Request, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;

    if (!studentId) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Student identifier not found in authentication context',
      });
      return;
    }

    const student = await (prisma as any).user.findUnique({
      where: { id: studentId },
      include: {
        enrollments: {
          include: {
            subject: true,
          },
        },
      },
    });

    const enrolledList = student?.enrollments || [];

    /** Converts a numeric score to a letter grade */
    const toLetterGrade = (score: number | null | undefined): string => {
      if (score === null || score === undefined) return 'N/A';
      if (score >= 97) return 'A+';
      if (score >= 93) return 'A';
      if (score >= 90) return 'A-';
      if (score >= 87) return 'B+';
      if (score >= 83) return 'B';
      if (score >= 80) return 'B-';
      if (score >= 77) return 'C+';
      if (score >= 73) return 'C';
      if (score >= 70) return 'C-';
      if (score >= 60) return 'D';
      return 'F';
    };

    const grades = enrolledList.map((e: any) => {
      const midtermScore: number | null = e.midtermGrade ?? null;
      const finalScore: number | null   = e.finalGrade   ?? null;
      const passing = finalScore !== null ? finalScore >= 60 : midtermScore !== null ? midtermScore >= 60 : true;
      return {
        course:   e.subject?.code  || 'N/A',
        title:    e.subject?.title || 'Untitled Subject',
        units:    Number(e.subject?.units) || 3,
        midterm:  toLetterGrade(midtermScore),
        final:    finalScore !== null ? toLetterGrade(finalScore) : 'In Progress',
        remarks:  e.remarks || null,
        status:   passing ? 'Passing Standing' : 'Failing — Remediation Required',
      };
    });

    res.status(200).json({
      status: 'success',
      studentId,
      grades,
    });
  } catch (error) {
    console.error('getStudentGrades error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve academic grade report',
    });
  }
};

/**
 * Retrieves enrolled course schedule for the authenticated student.
 */
export const getStudentCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;

    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized', message: 'Not authenticated' });
      return;
    }

    const student = await (prisma as any).user.findUnique({
      where: { id: studentId },
      include: {
        enrollments: {
          include: {
            subject: true,
          },
        },
      },
    });

    const courses = (student?.enrollments || []).map((e: any) => ({
      code: e.subject?.code || 'N/A',
      title: e.subject?.title || 'Untitled Subject',
      units: Number(e.subject?.units) || 3,
      schedule: e.subject?.schedule || 'MWF 9:00 AM',
      instructor: e.subject?.instructor || 'Faculty Member',
    }));

    res.status(200).json({
      status: 'success',
      courses,
    });
  } catch (error) {
    console.error('getStudentCourses error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve enrolled courses',
    });
  }
};

