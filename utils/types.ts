export interface AccountObj {
    email: string,
    name: string,
    image: string,
    trialExpDate: string // date string
}

export interface ProjectObj {
    accountId: string, // ID
    name: string,
    description: string,
    collaborators: string[], // array of IDs
    featuredQuestions: string[],
}

export interface UserObj {
    email: string,
    name: string,
    projectID: string // ID
}

export interface NoteObj {
    userId: string, // ID
    date: string, // date string
    selections: string[], // array of IDs
    texts: string[],
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
