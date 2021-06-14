export interface AccountObj {
    email: string,
    name: string,
    image: string,
    trialExpDate: string // date string
}

export interface ProjectObj {
    accountId: string, // ID
    name: string,
    description?: string,
    collaborators?: string[], // array of IDs
    featuredQuestions?: string[],
    userArr?: DatedObj<UserObj>[],
    updates?: DatedObj<UpdateObj>[],
    latestUpdate?: DatedObj<UpdateObj>,
    selectionTemplateArr?: DatedObj<SelectionTemplateObj>[],
    textTemplateArr?: DatedObj<TextTemplateObj>[],
}

export interface UserObj {
    email?: string, 
    name: string,
    date: string, // Date string
    projectId: string, // ID
    tags: string[],
    updateArr?: DatedObj<UpdateObj>[],
    projectArr?: DatedObj<ProjectObj>[],
}

export interface UserGraphObj {
    userData: DatedObj<UserObj>[],
    updateData: DatedObj<UpdateObj>[],
    projectData: DatedObj<ProjectObj>,
    selectionTemplateData: DatedObj<SelectionTemplateObj>[],
    textTemplateData: DatedObj<TextTemplateObj>[]
}

export interface UpdateObj {
    userId: string, // ID
    projectId: string,
    name: string,
    date: string, // Date string
    selections: string[], // array of IDs
    texts: string[],
    selectionArr?: DatedObj<SelectionObj>[],
    textArr?: DatedObj<TextObj>[],
    userArr?: DatedObj<UserObj>[],
}

export interface SelectionTemplateObj {
    projectId: string, // ID
    question: string,
    options: string[],
    required: boolean,
}

export interface TextTemplateObj {
    projectId: string, // ID
    question: string,
    required: boolean
}

export interface SelectionObj {
    noteId: string, // ID
    templateId: string, // ID
    selected: string
}

export interface TextObj {
    noteId: string, // ID
    templateId: string, // ID
    body: string
}

// generic / type alias from https://stackoverflow.com/questions/26652179/extending-interface-with-generic-in-typescript
export type DatedObj<T extends {}> = T & {
    _id: string,
    createdAt: string, // ISO date
    updatedAt: string, // ISO date
}

export type IdObj<T extends {}> = T & {
    _id: string,
}