export type ProgressionConfig = {
  readinessWeights: {
    pretestBaseline: number;
    mastery: number;
    moduleCompletion: number;
    recentQuizPerformance: number;
    practiceExam: number;
  };
  thresholds: {
    strengthScore: number;
    urgentWeakAreaScore: number;
    practiceBuildScore: number;
    buildingReadinessScore: number;
    nearlyReadyScore: number;
    examReadyScore: number;
    mockExamPassingScore: number;
  };
  gates: {
    practiceExamMinLessonsCompleted: number;
    practiceExamMinQuizzesCompleted: number;
    practiceExamMinReadinessScore: number;
  };
  caps: {
    pretestBaselineMaxContribution: number;
    moduleCompletionMaxContribution: number;
  };
  activity: {
    recentDays: number;
    coolingDays: number;
    inactiveDays: number;
  };
  improvement: {
    domainLiftThreshold: number;
    quizDeltaForBonus: number;
    mockDeltaForBonus: number;
  };
  adjustments: {
    consistencyBonusMax: number;
    improvementBonusMax: number;
    domainImprovementBonusMax: number;
    repeatedImprovementBonusMax: number;
    recentPoorPenaltyMax: number;
    repeatedLowPenaltyMax: number;
    inactivityPenaltyMax: number;
  };
};

export const DEFAULT_PROGRESSION_CONFIG: ProgressionConfig = {
  readinessWeights: {
    pretestBaseline: 0.1,
    mastery: 0.4,
    moduleCompletion: 0.1,
    recentQuizPerformance: 0.15,
    practiceExam: 0.25,
  },
  thresholds: {
    strengthScore: 80,
    urgentWeakAreaScore: 70,
    practiceBuildScore: 80,
    buildingReadinessScore: 55,
    nearlyReadyScore: 75,
    examReadyScore: 85,
    mockExamPassingScore: 75,
  },
  gates: {
    practiceExamMinLessonsCompleted: 2,
    practiceExamMinQuizzesCompleted: 1,
    practiceExamMinReadinessScore: 0,
  },
  caps: {
    pretestBaselineMaxContribution: 72,
    moduleCompletionMaxContribution: 80,
  },
  activity: {
    recentDays: 3,
    coolingDays: 7,
    inactiveDays: 14,
  },
  improvement: {
    domainLiftThreshold: 8,
    quizDeltaForBonus: 6,
    mockDeltaForBonus: 5,
  },
  adjustments: {
    consistencyBonusMax: 6,
    improvementBonusMax: 5,
    domainImprovementBonusMax: 4,
    repeatedImprovementBonusMax: 2,
    recentPoorPenaltyMax: 12,
    repeatedLowPenaltyMax: 10,
    inactivityPenaltyMax: 6,
  },
};
