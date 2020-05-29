type Plan = {
  id: string;
  title: string;
  descriptionMarkdown: string;
  credentialsMarkdown: string;
  visibleToPod: boolean;
};

type User = {
  id: string;
  name: string;
};

type Message = {
  timestampSeconds: number;
  senderId: string;
  recipientId: string;
  planId: string;
  messageMarkdown: string;
};

type Conversation = {
  planId: string;
  ownerId: string;
  sharerId: string;
  messages: Message[];
  isUnread: boolean;
};

type State = {
  plans: {
    [id: string]: Plan;
  };
};

interface AnyAction {
  type: string;
  payload: {};
}

export const reducer = (state: State, action: AnyAction): State => {
  return state;
};

/*
- createPlan()
- updatePlan()
- createUser()
*/

const CREATE_PLAN = "CREATE_PLAN" as const;
interface CreatePlanAction extends AnyAction {
  type: typeof CREATE_PLAN;
  payload: {
    plan: Plan;
  };
}

export const createPlan = ({
  title,
  descriptionMarkdown,
  credentialsMarkdown,
}: Omit<Plan, "id">): CreatePlanAction => {
  const id = title.toLowerCase();
  return {
    type: CREATE_PLAN,
    payload: {
      plan: {
        id,
        title,
        descriptionMarkdown,
        credentialsMarkdown,
      },
    },
  };
};
