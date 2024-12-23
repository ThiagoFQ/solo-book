export interface RollAction {
  stat: string;
  skill: string;
  threshold: number;
  outcomes: {
    success: {
      description: string;
      nextFragmentId: string;
    };
    failure: {
      description: string;
      nextFragmentId: string;
    };
  };
}

export interface ChoiceAction {
  options: {
    label: string;
    nextFragmentId?: string;
    roll?: RollAction;
  }[];
}

export type Actions = {
  choice?: ChoiceAction;
  roll?: RollAction;
};
