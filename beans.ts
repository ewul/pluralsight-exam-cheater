
export interface Role {
    id: string,
    name: string,
    skills: Skill[]
}
export interface Skill {
    assessmentId: string,
    userAssessmentStatus: string,
    id: string,
    name: string
}

export interface SkillAssessment {
    skill: string,
    assessment_item_id: number,
    format: string,
    stem: string,
    stem_image_url: string,
    answer_index: number,
    choices: string[]
}

export interface Question {
    state: string,
    ctx: {
        stem: string,
        choices: string[],
        timer: number,
        totalTime: number,
        id: number,
        answer_index: number,

    }
}

export interface VersionConfiguration {
    type: "version",
    data: {
        currentVersion: string,
        minValidVersion: string
    }
}
