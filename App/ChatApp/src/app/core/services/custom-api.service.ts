import { Injectable } from '@angular/core';
import API, {graphqlOperation} from "@aws-amplify/api-graphql";
import {
  Conversation, Message, ModelMessageFilterInput,
  ModelSortDirection, ModelStringKeyConditionInput,
  ModelUserConversationFilterInput,
  UserConversation,
} from "./api.service";
import {Observable} from "zen-observable-ts";

export type __SubscriptionContainer = {
  onCreateConversation: ExtendedConversation;
};

export type ExtendedConversation = {
  __typename: "Conversation";
  id: string;
  isGroup: boolean;
  createdAt: string;
  updatedAt: string;
  lastMessageId: string | null;
  lastMessage: Message | null;
  userConversations: {
    items: Array<UserConversation | null>;
    nextToken?: string | null;
  };
}

export type ConversationsWithUsersByUserIdQuery = {
  __typename: "ModelUserConversationsConnection";
  items: Array<{
    __typename: "UserConversation";
    id: string;
    userId: string;
    conversationId: string;
    createdAt: string;
    updatedAt: string;
    conversation: ExtendedConversation;
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
  } | null>;
  nextToken?: string | null;
};

@Injectable({
  providedIn: 'root'
})
export class CustomApiService {

  constructor() { }

  // Mutations
  async CreateConversation(
    userId: string
  ): Promise<ExtendedConversation> {
    const statement = `mutation CreateConversation($userId: ID!) {
        createConversation(userId: $userId) {
          __typename
          id
          isGroup
          lastMessage {
            __typename
            id
            content
            type
            createdAt
            updatedAt
            authorId
            conversationId
            isSent
          }
          messages {
            __typename
            nextToken
          }
          userConversations {
            items {
              id
              createdAt
              updatedAt
              noUnread
              user {
                status
                avatarPath
                createdAt
                email
                id
                name
                cognitoIdentityId
                updatedAt
              }
            }
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
    return <ExtendedConversation>response.data.createConversation;
  }

  // Queries
  async ConversationsWithUsersByUserId(
    userId: string,
    sortDirection?: ModelSortDirection,
    filter?: ModelUserConversationFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ConversationsWithUsersByUserIdQuery> {
    const statement = `query UserConversationsByUserId($userId: ID!, $sortDirection: ModelSortDirection, $filter: ModelUserConversationFilterInput, $limit: Int, $nextToken: String) {
        userConversationsByUserId(userId: $userId, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          nextToken
          items {
            id
            conversation {
              createdAt
              id
              isGroup
              updatedAt
              lastMessageId
              lastMessage {
                __typename
                id
                content
                type
                createdAt
                updatedAt
                authorId
                conversationId
                isSent
              }
              userConversations {
                items {
                  id
                  createdAt
                  updatedAt
                  noUnread
                  user {
                    status
                    avatarPath
                    createdAt
                    email
                    id
                    name
                    cognitoIdentityId
                    updatedAt
                  }
                }
              }
            }
          }
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
    return <ConversationsWithUsersByUserIdQuery>(
      response.data.userConversationsByUserId
    );
  }

  async GetConversation(id: string): Promise<ExtendedConversation> {
    const statement = `query GetConversation($id: ID!) {
        getConversation(id: $id) {
          __typename
          id
          isGroup
          messages {
            __typename
            nextToken
          }
          userConversations {
            items {
              user {
                avatarPath
                createdAt
                email
                id
                name
                updatedAt
                status
                cognitoIdentityId
              }
            }
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
    return <ExtendedConversation>response.data.getConversation;
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
        messagesByConversationIdAndCreatedAt(conversationId: $conversationId, createdAt: $createdAt, sortDirection: $sortDirection, filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
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
}
