export interface AccountObj {
    _id?: string,
    email: string,
    name: string,
    image: string,
    trialExpDate: string // date string
}

export interface ProjectObj {
    _id?: string,
    accountId: string, // ID
    name: string,
    description?: string,
    collaborators: string[], // array of IDs
    featuredQuestions: string[],
    userArr?: UserObj[],
    selectionTemplateArr?: SelectionTemplateObj[],
    textTemplateArr?: TextTemplateObj[],
}

export interface UserObj {
    _id?: string,
    createdAt: string, // date string?
    email?: string, 
    name: string, 
    projectId: string, // ID
    tags: string[],
    updateArr?: UpdateObj[],
    projectArr?: ProjectObj[],
}

export interface UpdateObj {
    _id?: string,
    createdAt: string, // date string?
    userId: string, // ID
    projectId?: string,
    name: string,
    date: string, // date string. or date?
    selections: string[], // array of IDs
    texts: string[],
    selectionArr?: SelectionObj[],
    textArr?: TextObj[],
    userArr?: UserObj[],
}

export interface SelectionTemplateObj {
    _id?: string,
    projectId: string, // ID
    question: string,
    options: string[],
    required: boolean,
}

export interface TextTemplateObj {
    _id?: string,
    projectId: string, // ID
    question: string,
    required: boolean
  }
  
  export interface SelectionObj {
    _id?: string,
    noteId: string, // ID
    templateId: string, // ID
    selected: string
  }
  
  export interface TextObj {
    _id?: string,
    noteId: string, // ID
    templateId: string, // ID
    body: string
  }
