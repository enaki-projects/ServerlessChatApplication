/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.
import { Injectable } from "@angular/core";
import API, { graphqlOperation, GraphQLResult } from "@aws-amplify/api-graphql";
import { Observable } from "zen-observable-ts";

export interface SubscriptionResponse<T> {
  value: GraphQLResult<T>;
}

export type __SubscriptionContainer = {
  onUpdateUserStatus: OnUpdateUserStatusSubscription;
  onMessageMutation: OnMessageMutationSubscription;
  onNotifyUserOfConversationCreation: OnNotifyUserOfConversationCreationSubscription;
  onUpdateUserConversationForNotification: OnUpdateUserConversationForNotificationSubscription;
};

export type User = {
  __typename: "User";
  id: string;
  cognitoIdentityId?: string | null;
  email: string;
  name: string;
  avatarPath?: string | null;
  status?: Status | null;
  userConversations?: ModelUserConversationConnection | null;
  messages?: ModelMessageConnection | null;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export enum Status {
  online = "online",
  offline = "offline",
  away = "away"
}

export type ModelUserConversationConnection = {
  __typename: "ModelUserConversationConnection";
  items: Array<UserConversation | null>;
  nextToken?: string | null;
};

export type UserConversation = {
  __typename: "UserConversation";
  id: string;
  conversationId: string;
  userId: string;
  noUnread: number;
  conversation?: Conversation | null;
  user?: User | null;
  createdAt: string;
  updatedAt: string;
};

export type Conversation = {
  __typename: "Conversation";
  id: string;
  isGroup: boolean;
  messages?: ModelMessageConnection | null;
  lastMessageId?: string | null;
  lastMessage?: Message | null;
  userConversations?: ModelUserConversationConnection | null;
  createdAt: string;
  updatedAt: string;
};

export type ModelMessageConnection = {
  __typename: "ModelMessageConnection";
  items: Array<Message | null>;
  nextToken?: string | null;
};

export type Message = {
  __typename: "Message";
  id: string;
  content: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  replyToMessageId?: string | null;
  replyToMessage?: Message | null;
  authorId: string;
  conversationId: string;
  isSent?: boolean | null;
};

export type ConversationNotification = {
  __typename: "ConversationNotification";
  userId: string;
  conversationId: string;
};

export type ModelUserFilterInput = {
  id?: ModelIDInput | null;
  cognitoIdentityId?: ModelStringInput | null;
  email?: ModelStringInput | null;
  name?: ModelStringInput | null;
  avatarPath?: ModelStringInput | null;
  status?: ModelStatusInput | null;
  and?: Array<ModelUserFilterInput | null> | null;
  or?: Array<ModelUserFilterInput | null> | null;
  not?: ModelUserFilterInput | null;
};

export type ModelIDInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null"
}

export type ModelSizeInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
};

export type ModelStringInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export type ModelStatusInput = {
  eq?: Status | null;
  ne?: Status | null;
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC"
}

export type ModelUserConnection = {
  __typename: "ModelUserConnection";
  items: Array<User | null>;
  nextToken?: string | null;
};

export type ModelUserConversationFilterInput = {
  id?: ModelIDInput | null;
  conversationId?: ModelIDInput | null;
  userId?: ModelIDInput | null;
  noUnread?: ModelIntInput | null;
  and?: Array<ModelUserConversationFilterInput | null> | null;
  or?: Array<ModelUserConversationFilterInput | null> | null;
  not?: ModelUserConversationFilterInput | null;
};

export type ModelIntInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
};

export type ModelConversationFilterInput = {
  id?: ModelIDInput | null;
  isGroup?: ModelBooleanInput | null;
  lastMessageId?: ModelIDInput | null;
  and?: Array<ModelConversationFilterInput | null> | null;
  or?: Array<ModelConversationFilterInput | null> | null;
  not?: ModelConversationFilterInput | null;
};

export type ModelBooleanInput = {
  ne?: boolean | null;
  eq?: boolean | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
};

export type ModelConversationConnection = {
  __typename: "ModelConversationConnection";
  items: Array<Conversation | null>;
  nextToken?: string | null;
};

export type ModelMessageFilterInput = {
  id?: ModelIDInput | null;
  content?: ModelStringInput | null;
  type?: ModelStringInput | null;
  createdAt?: ModelStringInput | null;
  updatedAt?: ModelStringInput | null;
  replyToMessageId?: ModelIDInput | null;
  authorId?: ModelIDInput | null;
  conversationId?: ModelIDInput | null;
  isSent?: ModelBooleanInput | null;
  and?: Array<ModelMessageFilterInput | null> | null;
  or?: Array<ModelMessageFilterInput | null> | null;
  not?: ModelMessageFilterInput | null;
};

export type ModelStringKeyConditionInput = {
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
};

export type UpdateUserNameMutation = {
  __typename: "User";
  id: string;
  cognitoIdentityId?: string | null;
  email: string;
  name: string;
  avatarPath?: string | null;
  status?: Status | null;
  userConversations?: {
    __typename: "ModelUserConversationConnection";
    nextToken?: string | null;
  } | null;
  messages?: {
    __typename: "ModelMessageConnection";
    nextToken?: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type UpdateUserStatusMutation = {
  __typename: "User";
  id: string;
  cognitoIdentityId?: string | null;
  email: string;
  name: string;
  avatarPath?: string | null;
  status?: Status | null;
  userConversations?: {
    __typename: "ModelUserConversationConnection";
    nextToken?: string | null;
  } | null;
  messages?: {
    __typename: "ModelMessageConnection";
    nextToken?: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type UpdateCognitoIdentityIdMutation = {
  __typename: "User";
  id: string;
  cognitoIdentityId?: string | null;
  email: string;
  name: string;
  avatarPath?: string | null;
  status?: Status | null;
  userConversations?: {
    __typename: "ModelUserConversationConnection";
    nextToken?: string | null;
  } | null;
  messages?: {
    __typename: "ModelMessageConnection";
    nextToken?: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type CreateConversationMutation = {
  __typename: "Conversation";
  id: string;
  isGroup: boolean;
  messages?: {
    __typename: "ModelMessageConnection";
    nextToken?: string | null;
  } | null;
  lastMessageId?: string | null;
  lastMessage?: {
    __typename: "Message";
    id: string;
    content: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    replyToMessageId?: string | null;
    authorId: string;
    conversationId: string;
    isSent?: boolean | null;
  } | null;
  userConversations?: {
    __typename: "ModelUserConversationConnection";
    nextToken?: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateMessageMutation = {
  __typename: "Message";
  id: string;
  content: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  replyToMessageId?: string | null;
  replyToMessage?: {
    __typename: "Message";
    id: string;
    content: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    replyToMessageId?: string | null;
    authorId: string;
    conversationId: string;
    isSent?: boolean | null;
  } | null;
  authorId: string;
  conversationId: string;
  isSent?: boolean | null;
};

export type DeleteMessageMutation = {
  __typename: "Message";
  id: string;
  content: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  replyToMessageId?: string | null;
  replyToMessage?: {
    __typename: "Message";
    id: string;
    content: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    replyToMessageId?: string | null;
    authorId: string;
    conversationId: string;
    isSent?: boolean | null;
  } | null;
  authorId: string;
  conversationId: string;
  isSent?: boolean | null;
};

export type NotifyUserOfConversationCreationMutation = {
  __typename: "ConversationNotification";
  userId: string;
  conversationId: string;
};

export type UpdateUserConversationForNotificationMutation = {
  __typename: "UserConversation";
  id: string;
  conversationId: string;
  userId: string;
  noUnread: number;
  conversation?: {
    __typename: "Conversation";
    id: string;
    isGroup: boolean;
    lastMessageId?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  user?: {
    __typename: "User";
    id: string;
    cognitoIdentityId?: string | null;
    email: string;
    name: string;
    avatarPath?: string | null;
    status?: Status | null;
    createdAt: string;
    updatedAt: string;
    owner?: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
};

export type MeQuery = {
  __typename: "User";
  id: string;
  cognitoIdentityId?: string | null;
  email: string;
  name: string;
  avatarPath?: string | null;
  status?: Status | null;
  userConversations?: {
    __typename: "ModelUserConversationConnection";
    nextToken?: string | null;
  } | null;
  messages?: {
    __typename: "ModelMessageConnection";
    nextToken?: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type GetUserQuery = {
  __typename: "User";
  id: string;
  cognitoIdentityId?: string | null;
  email: string;
  name: string;
  avatarPath?: string | null;
  status?: Status | null;
  userConversations?: {
    __typename: "ModelUserConversationConnection";
    nextToken?: string | null;
  } | null;
  messages?: {
    __typename: "ModelMessageConnection";
    nextToken?: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type ListUsersQuery = {
  __typename: "ModelUserConnection";
  items: Array<{
    __typename: "User";
    id: string;
    cognitoIdentityId?: string | null;
    email: string;
    name: string;
    avatarPath?: string | null;
    status?: Status | null;
    createdAt: string;
    updatedAt: string;
    owner?: string | null;
  } | null>;
  nextToken?: string | null;
};

export type GetUserConversationQuery = {
  __typename: "UserConversation";
  id: string;
  conversationId: string;
  userId: string;
  noUnread: number;
  conversation?: {
    __typename: "Conversation";
    id: string;
    isGroup: boolean;
    lastMessageId?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  user?: {
    __typename: "User";
    id: string;
    cognitoIdentityId?: string | null;
    email: string;
    name: string;
    avatarPath?: string | null;
    status?: Status | null;
    createdAt: string;
    updatedAt: string;
    owner?: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
};

export type ListUserConversationsQuery = {
  __typename: "ModelUserConversationConnection";
  items: Array<{
    __typename: "UserConversation";
    id: string;
    conversationId: string;
    userId: string;
    noUnread: number;
    createdAt: string;
    updatedAt: string;
  } | null>;
  nextToken?: string | null;
};

export type GetConversationQuery = {
  __typename: "Conversation";
  id: string;
  isGroup: boolean;
  messages?: {
    __typename: "ModelMessageConnection";
    nextToken?: string | null;
  } | null;
  lastMessageId?: string | null;
  lastMessage?: {
    __typename: "Message";
    id: string;
    content: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    replyToMessageId?: string | null;
    authorId: string;
    conversationId: string;
    isSent?: boolean | null;
  } | null;
  userConversations?: {
    __typename: "ModelUserConversationConnection";
    nextToken?: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
};

export type ListConversationsQuery = {
  __typename: "ModelConversationConnection";
  items: Array<{
    __typename: "Conversation";
    id: string;
    isGroup: boolean;
    lastMessageId?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null>;
  nextToken?: string | null;
};

export type GetMessageQuery = {
  __typename: "Message";
  id: string;
  content: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  replyToMessageId?: string | null;
  replyToMessage?: {
    __typename: "Message";
    id: string;
    content: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    replyToMessageId?: string | null;
    authorId: string;
    conversationId: string;
    isSent?: boolean | null;
  } | null;
  authorId: string;
  conversationId: string;
  isSent?: boolean | null;
};

export type ListMessagesQuery = {
  __typename: "ModelMessageConnection";
  items: Array<{
    __typename: "Message";
    id: string;
    content: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    replyToMessageId?: string | null;
    authorId: string;
    conversationId: string;
    isSent?: boolean | null;
  } | null>;
  nextToken?: string | null;
};

export type UsersByCognitoIdentityIdAndEmailQuery = {
  __typename: "ModelUserConnection";
  items: Array<{
    __typename: "User";
    id: string;
    cognitoIdentityId?: string | null;
    email: string;
    name: string;
    avatarPath?: string | null;
    status?: Status | null;
    createdAt: string;
    updatedAt: string;
    owner?: string | null;
  } | null>;
  nextToken?: string | null;
};

export type UserConversationsByConversationIdQuery = {
  __typename: "ModelUserConversationConnection";
  items: Array<{
    __typename: "UserConversation";
    id: string;
    conversationId: string;
    userId: string;
    noUnread: number;
    createdAt: string;
    updatedAt: string;
  } | null>;
  nextToken?: string | null;
};

export type UserConversationsByUserIdQuery = {
  __typename: "ModelUserConversationConnection";
  items: Array<{
    __typename: "UserConversation";
    id: string;
    conversationId: string;
    userId: string;
    noUnread: number;
    createdAt: string;
    updatedAt: string;
  } | null>;
  nextToken?: string | null;
};

export type MessagesByAuthorIdAndCreatedAtQuery = {
  __typename: "ModelMessageConnection";
  items: Array<{
    __typename: "Message";
    id: string;
    content: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    replyToMessageId?: string | null;
    authorId: string;
    conversationId: string;
    isSent?: boolean | null;
  } | null>;
  nextToken?: string | null;
};

export type MessagesByConversationIdAndCreatedAtQuery = {
  __typename: "ModelMessageConnection";
  items: Array<{
    __typename: "Message";
    id: string;
    content: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    replyToMessageId?: string | null;
    authorId: string;
    conversationId: string;
    isSent?: boolean | null;
  } | null>;
  nextToken?: string | null;
};

export type OnUpdateUserStatusSubscription = {
  __typename: "User";
  id: string;
  cognitoIdentityId?: string | null;
  email: string;
  name: string;
  avatarPath?: string | null;
  status?: Status | null;
  userConversations?: {
    __typename: "ModelUserConversationConnection";
    nextToken?: string | null;
  } | null;
  messages?: {
    __typename: "ModelMessageConnection";
    nextToken?: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  owner?: string | null;
};

export type OnMessageMutationSubscription = {
  __typename: "Message";
  id: string;
  content: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  replyToMessageId?: string | null;
  replyToMessage?: {
    __typename: "Message";
    id: string;
    content: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    replyToMessageId?: string | null;
    authorId: string;
    conversationId: string;
    isSent?: boolean | null;
  } | null;
  authorId: string;
  conversationId: string;
  isSent?: boolean | null;
};

export type OnNotifyUserOfConversationCreationSubscription = {
  __typename: "ConversationNotification";
  userId: string;
  conversationId: string;
};

export type OnUpdateUserConversationForNotificationSubscription = {
  __typename: "UserConversation";
  id: string;
  conversationId: string;
  userId: string;
  noUnread: number;
  conversation?: {
    __typename: "Conversation";
    id: string;
    isGroup: boolean;
    lastMessageId?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  user?: {
    __typename: "User";
    id: string;
    cognitoIdentityId?: string | null;
    email: string;
    name: string;
    avatarPath?: string | null;
    status?: Status | null;
    createdAt: string;
    updatedAt: string;
    owner?: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
};

@Injectable({
  providedIn: "root"
})
export class APIService {
  async UpdateUserName(name: string): Promise<UpdateUserNameMutation> {
    const statement = `mutation UpdateUserName($name: String!) {
        updateUserName(name: $name) {
          __typename
          id
          cognitoIdentityId
          email
          name
          avatarPath
          status
          userConversations {
            __typename
            nextToken
          }
          messages {
            __typename
            nextToken
          }
          createdAt
          updatedAt
          owner
        }
      }`;
    const gqlAPIServiceArguments: any = {
      name
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateUserNameMutation>response.data.updateUserName;
  }
  async UpdateUserStatus(status: Status): Promise<UpdateUserStatusMutation> {
    const statement = `mutation UpdateUserStatus($status: Status!) {
        updateUserStatus(status: $status) {
          __typename
          id
          cognitoIdentityId
          email
          name
          avatarPath
          status
          userConversations {
            __typename
            nextToken
          }
          messages {
            __typename
            nextToken
          }
          createdAt
          updatedAt
          owner
        }
      }`;
    const gqlAPIServiceArguments: any = {
      status
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateUserStatusMutation>response.data.updateUserStatus;
  }
  async UpdateCognitoIdentityId(
    cognitoIdentityId: string
  ): Promise<UpdateCognitoIdentityIdMutation> {
    const statement = `mutation UpdateCognitoIdentityId($cognitoIdentityId: String!) {
        updateCognitoIdentityId(cognitoIdentityId: $cognitoIdentityId) {
          __typename
          id
          cognitoIdentityId
          email
          name
          avatarPath
          status
          userConversations {
            __typename
            nextToken
          }
          messages {
            __typename
            nextToken
          }
          createdAt
          updatedAt
          owner
        }
      }`;
    const gqlAPIServiceArguments: any = {
      cognitoIdentityId
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateCognitoIdentityIdMutation>(
      response.data.updateCognitoIdentityId
    );
  }
  async CreateConversation(
    userId: string
  ): Promise<CreateConversationMutation> {
    const statement = `mutation CreateConversation($userId: ID!) {
        createConversation(userId: $userId) {
          __typename
          id
          isGroup
          messages {
            __typename
            nextToken
          }
          lastMessageId
          lastMessage {
            __typename
            id
            content
            type
            createdAt
            updatedAt
            replyToMessageId
            authorId
            conversationId
            isSent
          }
          userConversations {
            __typename
            nextToken
          }
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      userId
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateConversationMutation>response.data.createConversation;
  }
  async CreateMessage(
    content: string,
    type: string,
    conversationId: string,
    replyToMessageId?: string
  ): Promise<CreateMessageMutation> {
    const statement = `mutation CreateMessage($content: String!, $type: String!, $conversationId: ID!, $replyToMessageId: ID) {
        createMessage(
          content: $content
          type: $type
          conversationId: $conversationId
          replyToMessageId: $replyToMessageId
        ) {
          __typename
          id
          content
          type
          createdAt
          updatedAt
          replyToMessageId
          replyToMessage {
            __typename
            id
            content
            type
            createdAt
            updatedAt
            replyToMessageId
            authorId
            conversationId
            isSent
          }
          authorId
          conversationId
          isSent
        }
      }`;
    const gqlAPIServiceArguments: any = {
      content,
      type,
      conversationId
    };
    if (replyToMessageId) {
      gqlAPIServiceArguments.replyToMessageId = replyToMessageId;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateMessageMutation>response.data.createMessage;
  }
  async DeleteMessage(messageId: string): Promise<DeleteMessageMutation> {
    const statement = `mutation DeleteMessage($messageId: ID!) {
        deleteMessage(messageId: $messageId) {
          __typename
          id
          content
          type
          createdAt
          updatedAt
          replyToMessageId
          replyToMessage {
            __typename
            id
            content
            type
            createdAt
            updatedAt
            replyToMessageId
            authorId
            conversationId
            isSent
          }
          authorId
          conversationId
          isSent
        }
      }`;
    const gqlAPIServiceArguments: any = {
      messageId
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteMessageMutation>response.data.deleteMessage;
  }
  async NotifyUserOfConversationCreation(
    userId: string,
    conversationId: string
  ): Promise<NotifyUserOfConversationCreationMutation> {
    const statement = `mutation NotifyUserOfConversationCreation($userId: ID!, $conversationId: ID!) {
        notifyUserOfConversationCreation(
          userId: $userId
          conversationId: $conversationId
        ) {
          __typename
          userId
          conversationId
        }
      }`;
    const gqlAPIServiceArguments: any = {
      userId,
      conversationId
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <NotifyUserOfConversationCreationMutation>(
      response.data.notifyUserOfConversationCreation
    );
  }
  async UpdateUserConversationForNotification(
    userConversationId: string,
    reset?: boolean
  ): Promise<UpdateUserConversationForNotificationMutation> {
    const statement = `mutation UpdateUserConversationForNotification($userConversationId: ID!, $reset: Boolean) {
        updateUserConversationForNotification(
          userConversationId: $userConversationId
          reset: $reset
        ) {
          __typename
          id
          conversationId
          userId
          noUnread
          conversation {
            __typename
            id
            isGroup
            lastMessageId
            createdAt
            updatedAt
          }
          user {
            __typename
            id
            cognitoIdentityId
            email
            name
            avatarPath
            status
            createdAt
            updatedAt
            owner
          }
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      userConversationId
    };
    if (reset) {
      gqlAPIServiceArguments.reset = reset;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateUserConversationForNotificationMutation>(
      response.data.updateUserConversationForNotification
    );
  }
  async Me(): Promise<MeQuery> {
    const statement = `query Me {
        me {
          __typename
          id
          cognitoIdentityId
          email
          name
          avatarPath
          status
          userConversations {
            __typename
            nextToken
          }
          messages {
            __typename
            nextToken
          }
          createdAt
          updatedAt
          owner
        }
      }`;
    const response = (await API.graphql(graphqlOperation(statement))) as any;
    return <MeQuery>response.data.me;
  }
  async GetUser(id: string): Promise<GetUserQuery> {
    const statement = `query GetUser($id: ID!) {
        getUser(id: $id) {
          __typename
          id
          cognitoIdentityId
          email
          name
          avatarPath
          status
          userConversations {
            __typename
            nextToken
          }
          messages {
            __typename
            nextToken
          }
          createdAt
          updatedAt
          owner
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetUserQuery>response.data.getUser;
  }
  async ListUsers(
    id?: string,
    filter?: ModelUserFilterInput,
    limit?: number,
    nextToken?: string,
    sortDirection?: ModelSortDirection
  ): Promise<ListUsersQuery> {
    const statement = `query ListUsers($id: ID, $filter: ModelUserFilterInput, $limit: Int, $nextToken: String, $sortDirection: ModelSortDirection) {
        listUsers(
          id: $id
          filter: $filter
          limit: $limit
          nextToken: $nextToken
          sortDirection: $sortDirection
        ) {
          __typename
          items {
            __typename
            id
            cognitoIdentityId
            email
            name
            avatarPath
            status
            createdAt
            updatedAt
            owner
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (id) {
      gqlAPIServiceArguments.id = id;
    }
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    if (sortDirection) {
      gqlAPIServiceArguments.sortDirection = sortDirection;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListUsersQuery>response.data.listUsers;
  }
  async GetUserConversation(id: string): Promise<GetUserConversationQuery> {
    const statement = `query GetUserConversation($id: ID!) {
        getUserConversation(id: $id) {
          __typename
          id
          conversationId
          userId
          noUnread
          conversation {
            __typename
            id
            isGroup
            lastMessageId
            createdAt
            updatedAt
          }
          user {
            __typename
            id
            cognitoIdentityId
            email
            name
            avatarPath
            status
            createdAt
            updatedAt
            owner
          }
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetUserConversationQuery>response.data.getUserConversation;
  }
  async ListUserConversations(
    id?: string,
    filter?: ModelUserConversationFilterInput,
    limit?: number,
    nextToken?: string,
    sortDirection?: ModelSortDirection
  ): Promise<ListUserConversationsQuery> {
    const statement = `query ListUserConversations($id: ID, $filter: ModelUserConversationFilterInput, $limit: Int, $nextToken: String, $sortDirection: ModelSortDirection) {
        listUserConversations(
          id: $id
          filter: $filter
          limit: $limit
          nextToken: $nextToken
          sortDirection: $sortDirection
        ) {
          __typename
          items {
            __typename
            id
            conversationId
            userId
            noUnread
            createdAt
            updatedAt
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (id) {
      gqlAPIServiceArguments.id = id;
    }
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    if (sortDirection) {
      gqlAPIServiceArguments.sortDirection = sortDirection;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListUserConversationsQuery>response.data.listUserConversations;
  }
  async GetConversation(id: string): Promise<GetConversationQuery> {
    const statement = `query GetConversation($id: ID!) {
        getConversation(id: $id) {
          __typename
          id
          isGroup
          messages {
            __typename
            nextToken
          }
          lastMessageId
          lastMessage {
            __typename
            id
            content
            type
            createdAt
            updatedAt
            replyToMessageId
            authorId
            conversationId
            isSent
          }
          userConversations {
            __typename
            nextToken
          }
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetConversationQuery>response.data.getConversation;
  }
  async ListConversations(
    id?: string,
    filter?: ModelConversationFilterInput,
    limit?: number,
    nextToken?: string,
    sortDirection?: ModelSortDirection
  ): Promise<ListConversationsQuery> {
    const statement = `query ListConversations($id: ID, $filter: ModelConversationFilterInput, $limit: Int, $nextToken: String, $sortDirection: ModelSortDirection) {
        listConversations(
          id: $id
          filter: $filter
          limit: $limit
          nextToken: $nextToken
          sortDirection: $sortDirection
        ) {
          __typename
          items {
            __typename
            id
            isGroup
            lastMessageId
            createdAt
            updatedAt
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (id) {
      gqlAPIServiceArguments.id = id;
    }
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    if (sortDirection) {
      gqlAPIServiceArguments.sortDirection = sortDirection;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListConversationsQuery>response.data.listConversations;
  }
  async GetMessage(id: string): Promise<GetMessageQuery> {
    const statement = `query GetMessage($id: ID!) {
        getMessage(id: $id) {
          __typename
          id
          content
          type
          createdAt
          updatedAt
          replyToMessageId
          replyToMessage {
            __typename
            id
            content
            type
            createdAt
            updatedAt
            replyToMessageId
            authorId
            conversationId
            isSent
          }
          authorId
          conversationId
          isSent
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetMessageQuery>response.data.getMessage;
  }
  async ListMessages(
    id?: string,
    filter?: ModelMessageFilterInput,
    limit?: number,
    nextToken?: string,
    sortDirection?: ModelSortDirection
  ): Promise<ListMessagesQuery> {
    const statement = `query ListMessages($id: ID, $filter: ModelMessageFilterInput, $limit: Int, $nextToken: String, $sortDirection: ModelSortDirection) {
        listMessages(
          id: $id
          filter: $filter
          limit: $limit
          nextToken: $nextToken
          sortDirection: $sortDirection
        ) {
          __typename
          items {
            __typename
            id
            content
            type
            createdAt
            updatedAt
            replyToMessageId
            authorId
            conversationId
            isSent
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (id) {
      gqlAPIServiceArguments.id = id;
    }
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    if (sortDirection) {
      gqlAPIServiceArguments.sortDirection = sortDirection;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListMessagesQuery>response.data.listMessages;
  }
  async UsersByCognitoIdentityIdAndEmail(
    cognitoIdentityId: string,
    email?: ModelStringKeyConditionInput,
    sortDirection?: ModelSortDirection,
    filter?: ModelUserFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<UsersByCognitoIdentityIdAndEmailQuery> {
    const statement = `query UsersByCognitoIdentityIdAndEmail($cognitoIdentityId: String!, $email: ModelStringKeyConditionInput, $sortDirection: ModelSortDirection, $filter: ModelUserFilterInput, $limit: Int, $nextToken: String) {
        usersByCognitoIdentityIdAndEmail(
          cognitoIdentityId: $cognitoIdentityId
          email: $email
          sortDirection: $sortDirection
          filter: $filter
          limit: $limit
          nextToken: $nextToken
        ) {
          __typename
          items {
            __typename
            id
            cognitoIdentityId
            email
            name
            avatarPath
            status
            createdAt
            updatedAt
            owner
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {
      cognitoIdentityId
    };
    if (email) {
      gqlAPIServiceArguments.email = email;
    }
    if (sortDirection) {
      gqlAPIServiceArguments.sortDirection = sortDirection;
    }
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UsersByCognitoIdentityIdAndEmailQuery>(
      response.data.usersByCognitoIdentityIdAndEmail
    );
  }
  async UserConversationsByConversationId(
    conversationId: string,
    sortDirection?: ModelSortDirection,
    filter?: ModelUserConversationFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<UserConversationsByConversationIdQuery> {
    const statement = `query UserConversationsByConversationId($conversationId: ID!, $sortDirection: ModelSortDirection, $filter: ModelUserConversationFilterInput, $limit: Int, $nextToken: String) {
        userConversationsByConversationId(
          conversationId: $conversationId
          sortDirection: $sortDirection
          filter: $filter
          limit: $limit
          nextToken: $nextToken
        ) {
          __typename
          items {
            __typename
            id
            conversationId
            userId
            noUnread
            createdAt
            updatedAt
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {
      conversationId
    };
    if (sortDirection) {
      gqlAPIServiceArguments.sortDirection = sortDirection;
    }
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UserConversationsByConversationIdQuery>(
      response.data.userConversationsByConversationId
    );
  }
  async UserConversationsByUserId(
    userId: string,
    sortDirection?: ModelSortDirection,
    filter?: ModelUserConversationFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<UserConversationsByUserIdQuery> {
    const statement = `query UserConversationsByUserId($userId: ID!, $sortDirection: ModelSortDirection, $filter: ModelUserConversationFilterInput, $limit: Int, $nextToken: String) {
        userConversationsByUserId(
          userId: $userId
          sortDirection: $sortDirection
          filter: $filter
          limit: $limit
          nextToken: $nextToken
        ) {
          __typename
          items {
            __typename
            id
            conversationId
            userId
            noUnread
            createdAt
            updatedAt
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {
      userId
    };
    if (sortDirection) {
      gqlAPIServiceArguments.sortDirection = sortDirection;
    }
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UserConversationsByUserIdQuery>(
      response.data.userConversationsByUserId
    );
  }
  async MessagesByAuthorIdAndCreatedAt(
    authorId: string,
    createdAt?: ModelStringKeyConditionInput,
    sortDirection?: ModelSortDirection,
    filter?: ModelMessageFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<MessagesByAuthorIdAndCreatedAtQuery> {
    const statement = `query MessagesByAuthorIdAndCreatedAt($authorId: ID!, $createdAt: ModelStringKeyConditionInput, $sortDirection: ModelSortDirection, $filter: ModelMessageFilterInput, $limit: Int, $nextToken: String) {
        messagesByAuthorIdAndCreatedAt(
          authorId: $authorId
          createdAt: $createdAt
          sortDirection: $sortDirection
          filter: $filter
          limit: $limit
          nextToken: $nextToken
        ) {
          __typename
          items {
            __typename
            id
            content
            type
            createdAt
            updatedAt
            replyToMessageId
            authorId
            conversationId
            isSent
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {
      authorId
    };
    if (createdAt) {
      gqlAPIServiceArguments.createdAt = createdAt;
    }
    if (sortDirection) {
      gqlAPIServiceArguments.sortDirection = sortDirection;
    }
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <MessagesByAuthorIdAndCreatedAtQuery>(
      response.data.messagesByAuthorIdAndCreatedAt
    );
  }
  async MessagesByConversationIdAndCreatedAt(
    conversationId: string,
    createdAt?: ModelStringKeyConditionInput,
    sortDirection?: ModelSortDirection,
    filter?: ModelMessageFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<MessagesByConversationIdAndCreatedAtQuery> {
    const statement = `query MessagesByConversationIdAndCreatedAt($conversationId: ID!, $createdAt: ModelStringKeyConditionInput, $sortDirection: ModelSortDirection, $filter: ModelMessageFilterInput, $limit: Int, $nextToken: String) {
        messagesByConversationIdAndCreatedAt(
          conversationId: $conversationId
          createdAt: $createdAt
          sortDirection: $sortDirection
          filter: $filter
          limit: $limit
          nextToken: $nextToken
        ) {
          __typename
          items {
            __typename
            id
            content
            type
            createdAt
            updatedAt
            replyToMessageId
            authorId
            conversationId
            isSent
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {
      conversationId
    };
    if (createdAt) {
      gqlAPIServiceArguments.createdAt = createdAt;
    }
    if (sortDirection) {
      gqlAPIServiceArguments.sortDirection = sortDirection;
    }
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <MessagesByConversationIdAndCreatedAtQuery>(
      response.data.messagesByConversationIdAndCreatedAt
    );
  }
  OnUpdateUserStatusListener(
    id: string
  ): Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateUserStatus">>
  > {
    const statement = `subscription OnUpdateUserStatus($id: ID!) {
        onUpdateUserStatus(id: $id) {
          __typename
          id
          cognitoIdentityId
          email
          name
          avatarPath
          status
          userConversations {
            __typename
            nextToken
          }
          messages {
            __typename
            nextToken
          }
          createdAt
          updatedAt
          owner
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateUserStatus">>
    >;
  }

  OnMessageMutationListener(
    conversationId: string
  ): Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onMessageMutation">>
  > {
    const statement = `subscription OnMessageMutation($conversationId: ID!) {
        onMessageMutation(conversationId: $conversationId) {
          __typename
          id
          content
          type
          createdAt
          updatedAt
          replyToMessageId
          replyToMessage {
            __typename
            id
            content
            type
            createdAt
            updatedAt
            replyToMessageId
            authorId
            conversationId
            isSent
          }
          authorId
          conversationId
          isSent
        }
      }`;
    const gqlAPIServiceArguments: any = {
      conversationId
    };
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<Pick<__SubscriptionContainer, "onMessageMutation">>
    >;
  }

  OnNotifyUserOfConversationCreationListener(
    userId: string
  ): Observable<
    SubscriptionResponse<
      Pick<__SubscriptionContainer, "onNotifyUserOfConversationCreation">
    >
  > {
    const statement = `subscription OnNotifyUserOfConversationCreation($userId: ID!) {
        onNotifyUserOfConversationCreation(userId: $userId) {
          __typename
          userId
          conversationId
        }
      }`;
    const gqlAPIServiceArguments: any = {
      userId
    };
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<
        Pick<__SubscriptionContainer, "onNotifyUserOfConversationCreation">
      >
    >;
  }

  OnUpdateUserConversationForNotificationListener(
    userId: string
  ): Observable<
    SubscriptionResponse<
      Pick<__SubscriptionContainer, "onUpdateUserConversationForNotification">
    >
  > {
    const statement = `subscription OnUpdateUserConversationForNotification($userId: ID!) {
        onUpdateUserConversationForNotification(userId: $userId) {
          __typename
          id
          conversationId
          userId
          noUnread
          conversation {
            __typename
            id
            isGroup
            lastMessageId
            createdAt
            updatedAt
          }
          user {
            __typename
            id
            cognitoIdentityId
            email
            name
            avatarPath
            status
            createdAt
            updatedAt
            owner
          }
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      userId
    };
    return API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    ) as Observable<
      SubscriptionResponse<
        Pick<__SubscriptionContainer, "onUpdateUserConversationForNotification">
      >
    >;
  }
}
