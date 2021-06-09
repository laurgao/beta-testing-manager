export interface AccountObj {
    _id: string,
    email: string,
    name: string,
    image: string,
    trialExpDate: string // date string
}

export interface ProjectObj {
    _id: string,
    accountId: string, // ID
    name: string,
    description?: string,
    collaborators: string[], // array of IDs
    featuredQuestions: string[],
}

export interface UserObj {
    _id: string,
    createdAt: string, // date string?
    email?: string, 
    name: string, 
    projectId: string, // ID
    tags: string[],
}

export interface UpdateObj {
    _id: string,
    createdAt: string, // date string?
    userId: string, // ID
    projectId: string,
    name: string,
    date: string, // date string. or date?
    selections: string[], // array of IDs
    texts: string[],
}

export interface SelectionTemplateObj {
    _id: string,
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
