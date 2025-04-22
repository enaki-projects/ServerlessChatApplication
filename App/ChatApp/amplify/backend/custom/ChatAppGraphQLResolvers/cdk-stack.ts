import * as cdk from '@aws-cdk/core';
import * as AmplifyHelpers from '@aws-amplify/cli-extensibility-helper';
import * as appsync from '@aws-cdk/aws-appsync';
import { AmplifyDependentResourcesAttributes } from '../../types/amplify-dependent-resources-ref';
import * as path from "path";

const paths = {
  "common": "../resolvers/common/",
  "query": {
    "me": "../resolvers/QueryMe/"
  },
  "mutation": {
    "createConversation": "../resolvers/MutationCreateConversation/",
    "createMessage": "../resolvers/MutationCreateMessage/",
    "deleteMessage": "../resolvers/MutationDeleteMessage/",
    "notifyUserOfConversationCreation": "../resolvers/MutationNotifyUserOfConversationCreation/",
    "notifyUserConversation": "../resolvers/MutationNotifyUserConversation/",
    "updateUserStatus": "../resolvers/MutationUpdateUserStatus",
    "updateUserName": "../resolvers/MutationUpdateUserName",
    "updateCognitoIdentityId": "../resolvers/MutationUpdateCognitoIdentityId"
  }
}

function replaceAll(string, search, replace) {
  return string.split(search).join(replace);
}

export class cdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps, amplifyResourceProps?: AmplifyHelpers.AmplifyResourceProps) {
    super(scope, id, props);
    /* Do not remove - Amplify CLI automatically injects the current deployment environment in this input parameter */
    new cdk.CfnParameter(this, 'env', {
      type: 'String',
      description: 'Current Amplify CLI env name',
    });

    // Access other Amplify Resources
    const retVal:AmplifyDependentResourcesAttributes = AmplifyHelpers.addResourceDependency(this,
      amplifyResourceProps.category,
      amplifyResourceProps.resourceName,
      [{
        category: "api",
        resourceName: "ChatAppGraphQLApi"
      }]
    );

    //common
    let initDataSourcesRequestStr: string = appsync.MappingTemplate.fromFile(path.join(__dirname, paths.common, "InitDataSourcesFcn.req.vtl")).renderTemplate();
    initDataSourcesRequestStr = replaceAll(initDataSourcesRequestStr, "{graphql_api_id}", cdk.Fn.ref(retVal.api.ChatAppGraphQLApi.GraphQLAPIIdOutput))
    initDataSourcesRequestStr = replaceAll(initDataSourcesRequestStr, "{env_id}", cdk.Fn.ref('env'))

    const InitDataSourcesFcn = new appsync.CfnFunctionConfiguration(this, "InitDataSourcesFcn", {
      apiId: cdk.Fn.ref(retVal.api.ChatAppGraphQLApi.GraphQLAPIIdOutput),
      dataSourceName: "NONE_DS",
      functionVersion: "2018-05-29",
      name: "InitDataSourcesFcn",
      requestMappingTemplate: initDataSourcesRequestStr,
      responseMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.common, "InitDataSourcesFcn.res.vtl")).renderTemplate(),
    })
    const AuthRequestFcn = new appsync.CfnFunctionConfiguration(this, "AuthRequestFcn", {
      apiId: cdk.Fn.ref(retVal.api.ChatAppGraphQLApi.GraphQLAPIIdOutput),
      dataSourceName: "NONE_DS",
      functionVersion: "2018-05-29",
      name: "AuthRequestFcn",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.common, "AuthRequestFcn.req.vtl")).renderTemplate(),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.common, "AuthRequestFcn.res.vtl")).renderTemplate(),
    })
    const GetMyUserConversationsFcn = new appsync.CfnFunctionConfiguration(this, "GetMyUserConversationsFcn", {
      apiId: cdk.Fn.ref(retVal.api.ChatAppGraphQLApi.GraphQLAPIIdOutput),
      dataSourceName: "UserConversationTable",
      functionVersion: "2018-05-29",
      name: "GetMyUserConversationsFcn",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.common, "GetMyUserConversationsFcn.req.vtl")).renderTemplate(),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.common, "GetMyUserConversationsFcn.res.vtl")).renderTemplate(),
    })

    // Query Me
    const GetMeFcn = new appsync.CfnFunctionConfiguration(this, "GetMeFcn", {
      apiId: cdk.Fn.ref(retVal.api.ChatAppGraphQLApi.GraphQLAPIIdOutput),
      dataSourceName: "UserTable",
      functionVersion: "2018-05-29",
      name: "GetMeFcn",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.query.me, "GetMeFcn.req.vtl")).renderTemplate(),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.query.me, "GetMeFcn.res.vtl")).renderTemplate(),
    })
    const GetMyConversationsFcn = new appsync.CfnFunctionConfiguration(this, "GetMyConversationsFcn", {
      apiId: cdk.Fn.ref(retVal.api.ChatAppGraphQLApi.GraphQLAPIIdOutput),
      dataSourceName: "ConversationTable",
      functionVersion: "2018-05-29",
      name: "GetMyConversationsFcn",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.query.me, "GetMyConversationsFcn.req.vtl")).renderTemplate(),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.query.me, "GetMyConversationsFcn.res.vtl")).renderTemplate(),
    })

    // Mutation createConversation
    const CheckConversationBetweenUsersExistFcn = new appsync.CfnFunctionConfiguration(this, "CheckConversationBetweenUsersExistFcn", {
      apiId: cdk.Fn.ref(retVal.api.ChatAppGraphQLApi.GraphQLAPIIdOutput),
      dataSourceName: "ConversationTable",
      functionVersion: "2018-05-29",
      name: "CheckConversationBetweenUsersExistFcn",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.createConversation, "CheckConversationBetweenUsersExistFcn.req.vtl")).renderTemplate(),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.createConversation, "CheckConversationBetweenUsersExistFcn.res.vtl")).renderTemplate(),
    })
    const CheckUsersExistFcn = new appsync.CfnFunctionConfiguration(this, "CheckUsersExistFcn", {
      apiId: cdk.Fn.ref(retVal.api.ChatAppGraphQLApi.GraphQLAPIIdOutput),
      dataSourceName: "UserTable",
      functionVersion: "2018-05-29",
      name: "CheckUsersExistFcn",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.createConversation, "CheckUsersExistFcn.req.vtl")).renderTemplate(),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.createConversation, "CheckUsersExistFcn.res.vtl")).renderTemplate(),
    })
    const CreateConversationFcn = new appsync.CfnFunctionConfiguration(this, "CreateConversationFcn", {
      apiId: cdk.Fn.ref(retVal.api.ChatAppGraphQLApi.GraphQLAPIIdOutput),
      dataSourceName: "ConversationTable",
      functionVersion: "2018-05-29",
      name: "CreateConversationFcn",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.createConversation, "CreateConversationFcn.req.vtl")).renderTemplate(),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.createConversation, "CreateConversationFcn.res.vtl")).renderTemplate(),
    })
    const CreateUserConversationFcn = new appsync.CfnFunctionConfiguration(this, "CreateUserConversationFcn", {
      apiId: cdk.Fn.ref(retVal.api.ChatAppGraphQLApi.GraphQLAPIIdOutput),
      dataSourceName: "UserConversationTable",
      functionVersion: "2018-05-29",
      name: "CreateUserConversationFcn",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.createConversation, "CreateUserConversationFcn.req.vtl")).renderTemplate(),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.createConversation, "CreateUserConversationFcn.res.vtl")).renderTemplate(),
    })
    const GetIntersectionWithUserConversationsFcn = new appsync.CfnFunctionConfiguration(this, "GetIntersectionWithUserConversationsFcn", {
      apiId: cdk.Fn.ref(retVal.api.ChatAppGraphQLApi.GraphQLAPIIdOutput),
      dataSourceName: "UserConversationTable",
      functionVersion: "2018-05-29",
      name: "GetIntersectionWithUserConversationsFcn",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.createConversation, "GetIntersectionWithUserConversationsFcn.req.vtl")).renderTemplate(),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.createConversation, "GetIntersectionWithUserConversationsFcn.res.vtl")).renderTemplate(),
    })

    // Mutation createMessage
    const CheckPermissionForConversationFcn = new appsync.CfnFunctionConfiguration(this, "CheckPermissionForConversationFcn", {
      apiId: cdk.Fn.ref(retVal.api.ChatAppGraphQLApi.GraphQLAPIIdOutput),
      dataSourceName: "NONE_DS",
      functionVersion: "2018-05-29",
      name: "CheckPermissionForConversationFcn",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.createMessage, "CheckPermissionForConversationFcn.req.vtl")).renderTemplate(),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.createMessage, "CheckPermissionForConversationFcn.res.vtl")).renderTemplate(),
    })
    const CheckPermissionForReplyToMsgFcn = new appsync.CfnFunctionConfiguration(this, "CheckPermissionForReplyToMsgFcn", {
      apiId: cdk.Fn.ref(retVal.api.ChatAppGraphQLApi.GraphQLAPIIdOutput),
      dataSourceName: "MessageTable",
      functionVersion: "2018-05-29",
      name: "CheckPermissionForReplyToMsgFcn",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.createMessage, "CheckPermissionForReplyToMsgFcn.req.vtl")).renderTemplate(),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.createMessage, "CheckPermissionForReplyToMsgFcn.res.vtl")).renderTemplate(),
    })
    const CreateMessageFcn = new appsync.CfnFunctionConfiguration(this, "CreateMessageFcn", {
      apiId: cdk.Fn.ref(retVal.api.ChatAppGraphQLApi.GraphQLAPIIdOutput),
      dataSourceName: "MessageTable",
      functionVersion: "2018-05-29",
      name: "CreateMessageFcn",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.createMessage, "CreateMessageFcn.req.vtl")).renderTemplate(),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.createMessage, "CreateMessageFcn.res.vtl")).renderTemplate(),
    })
    const UpdateConversationWithLatestMsgFcn = new appsync.CfnFunctionConfiguration(this, "UpdateConversationWithLatestMsgFcn", {
      apiId: cdk.Fn.ref(retVal.api.ChatAppGraphQLApi.GraphQLAPIIdOutput),
      dataSourceName: "ConversationTable",
      functionVersion: "2018-05-29",
      name: "UpdateConversationWithLatestMsgFcn",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.createMessage, "UpdateConversationWithLatestMsgFcn.req.vtl")).renderTemplate(),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.createMessage, "UpdateConversationWithLatestMsgFcn.res.vtl")).renderTemplate(),
    })

    // Mutation deleteMessage
    const CheckPermissionForMessageDeletionFcn = new appsync.CfnFunctionConfiguration(this, "CheckPermissionForMessageDeletionFcn", {
      apiId: cdk.Fn.ref(retVal.api.ChatAppGraphQLApi.GraphQLAPIIdOutput),
      dataSourceName: "MessageTable",
      functionVersion: "2018-05-29",
      name: "CheckPermissionForMessageDeletionFcn",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.deleteMessage, "CheckPermissionForMessageDeletionFcn.req.vtl")).renderTemplate(),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.deleteMessage, "CheckPermissionForMessageDeletionFcn.res.vtl")).renderTemplate(),
    })
    const DeleteMessageFcn = new appsync.CfnFunctionConfiguration(this, "DeleteMessageFcn", {
      apiId: cdk.Fn.ref(retVal.api.ChatAppGraphQLApi.GraphQLAPIIdOutput),
      dataSourceName: "MessageTable",
      functionVersion: "2018-05-29",
      name: "DeleteMessageFcn",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.deleteMessage, "DeleteMessageFcn.req.vtl")).renderTemplate(),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.deleteMessage, "DeleteMessageFcn.res.vtl")).renderTemplate(),
    })

    // Mutation notifyUserOfConversationCreation
    const NotificationOnConversationCreationFcn = new appsync.CfnFunctionConfiguration(this, "NotificationOnConversationCreationFcn", {
      apiId: cdk.Fn.ref(retVal.api.ChatAppGraphQLApi.GraphQLAPIIdOutput),
      dataSourceName: "NONE_DS",
      functionVersion: "2018-05-29",
      name: "NotificationOnConversationCreationFcn",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.notifyUserOfConversationCreation, "NotificationOnConversationCreationFcn.req.vtl")).renderTemplate(),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.notifyUserOfConversationCreation, "NotificationOnConversationCreationFcn.res.vtl")).renderTemplate(),
    })

    // Mutation updateUserConversation
    const UpdateUserConversationForNotificationFcn = new appsync.CfnFunctionConfiguration(this, "UpdateUserConversationForNotificationFcn", {
      apiId: cdk.Fn.ref(retVal.api.ChatAppGraphQLApi.GraphQLAPIIdOutput),
      dataSourceName: "UserConversationTable",
      functionVersion: "2018-05-29",
      name: "UpdateUserConversationForNotificationFcn",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.notifyUserConversation, "UpdateUserConversationForNotificationFcn.req.vtl")).renderTemplate(),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.notifyUserConversation, "UpdateUserConversationForNotificationFcn.res.vtl")).renderTemplate(),
    })

    // Mutation updateUserStatus
    const UpdateUserStatusFcn = new appsync.CfnFunctionConfiguration(this, "UpdateUserStatusFcn", {
      apiId: cdk.Fn.ref(retVal.api.ChatAppGraphQLApi.GraphQLAPIIdOutput),
      dataSourceName: "UserTable",
      functionVersion: "2018-05-29",
      name: "UpdateUserStatusFcn",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.updateUserStatus, "UpdateUserStatusFcn.req.vtl")).renderTemplate(),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.updateUserStatus, "UpdateUserStatusFcn.res.vtl")).renderTemplate(),
    })

    // Mutation updateUserStatus
    const UpdateUserNameFcn = new appsync.CfnFunctionConfiguration(this, "UpdateUserNameFcn", {
      apiId: cdk.Fn.ref(retVal.api.ChatAppGraphQLApi.GraphQLAPIIdOutput),
      dataSourceName: "UserTable",
      functionVersion: "2018-05-29",
      name: "UpdateUserNameFcn",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.updateUserName, "UpdateUserNameFcn.req.vtl")).renderTemplate(),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.updateUserName, "UpdateUserNameFcn.res.vtl")).renderTemplate(),
    })

    // Mutation updateCognitoIdentityId
    const UpdateCognitoIdentityFcn = new appsync.CfnFunctionConfiguration(this, "UpdateCognitoIdentityFcn", {
      apiId: cdk.Fn.ref(retVal.api.ChatAppGraphQLApi.GraphQLAPIIdOutput),
      dataSourceName: "UserTable",
      functionVersion: "2018-05-29",
      name: "UpdateCognitoIdentityFcn",
      requestMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.updateCognitoIdentityId, "UpdateUserCognitoIdentityIdFcn.req.vtl")).renderTemplate(),
      responseMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.updateCognitoIdentityId, "UpdateUserCognitoIdentityIdFcn.res.vtl")).renderTemplate(),
    })

    const pipelines = [
      new appsync.CfnResolver(this, "MeQuery", {
        apiId: cdk.Fn.ref(retVal.api.ChatAppGraphQLApi.GraphQLAPIIdOutput),
        kind: "PIPELINE",
        fieldName: "me",
        typeName: "Query", // Query | Mutation | Subscription
        pipelineConfig: {
          functions: [
            AuthRequestFcn.attrFunctionId,
            InitDataSourcesFcn.attrFunctionId,
            GetMyUserConversationsFcn.attrFunctionId,
            GetMyConversationsFcn.attrFunctionId,
            GetMeFcn.attrFunctionId
          ]
        },
        requestMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.query.me, "Query.me.req.vtl")).renderTemplate(),
        responseMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.query.me, "Query.me.res.vtl")).renderTemplate(),
      }),
      new appsync.CfnResolver(this, "CreateConversationMutation", {
        apiId: cdk.Fn.ref(retVal.api.ChatAppGraphQLApi.GraphQLAPIIdOutput),
        kind: "PIPELINE",
        fieldName: "createConversation",
        typeName: "Mutation", // Query | Mutation | Subscription
        pipelineConfig: {
          functions: [
            AuthRequestFcn.attrFunctionId,
            InitDataSourcesFcn.attrFunctionId,
            CheckUsersExistFcn.attrFunctionId,
            GetMyUserConversationsFcn.attrFunctionId,
            GetIntersectionWithUserConversationsFcn.attrFunctionId,
            CheckConversationBetweenUsersExistFcn.attrFunctionId,
            CreateConversationFcn.attrFunctionId,
            CreateUserConversationFcn.attrFunctionId
          ]
        },
        requestMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.createConversation, "Mutation.createConversation.req.vtl")).renderTemplate(),
        responseMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.createConversation, "Mutation.createConversation.res.vtl")).renderTemplate(),
      }),
      new appsync.CfnResolver(this, "CreateMessageMutation", {
        apiId: cdk.Fn.ref(retVal.api.ChatAppGraphQLApi.GraphQLAPIIdOutput),
        kind: "PIPELINE",
        fieldName: "createMessage",
        typeName: "Mutation", // Query | Mutation | Subscription
        pipelineConfig: {
          functions: [
            AuthRequestFcn.attrFunctionId,
            InitDataSourcesFcn.attrFunctionId,
            GetMyUserConversationsFcn.attrFunctionId,
            CheckPermissionForConversationFcn.attrFunctionId,
            CheckPermissionForReplyToMsgFcn.attrFunctionId,
            CreateMessageFcn.attrFunctionId,
            UpdateConversationWithLatestMsgFcn.attrFunctionId
          ]
        },
        requestMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.createMessage, "Mutation.createMessage.req.vtl")).renderTemplate(),
        responseMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.createMessage, "Mutation.createMessage.res.vtl")).renderTemplate(),
      }),
      new appsync.CfnResolver(this, "DeleteMessageMutation", {
        apiId: cdk.Fn.ref(retVal.api.ChatAppGraphQLApi.GraphQLAPIIdOutput),
        kind: "PIPELINE",
        fieldName: "deleteMessage",
        typeName: "Mutation", // Query | Mutation | Subscription
        pipelineConfig: {
          functions: [
            AuthRequestFcn.attrFunctionId,
            InitDataSourcesFcn.attrFunctionId,
            CheckPermissionForMessageDeletionFcn.attrFunctionId,
            DeleteMessageFcn.attrFunctionId,
          ]
        },
        requestMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.deleteMessage, "Mutation.deleteMessage.req.vtl")).renderTemplate(),
        responseMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.deleteMessage, "Mutation.deleteMessage.res.vtl")).renderTemplate(),
      }),
      new appsync.CfnResolver(this, "NotifyUserOfConversationCreationMutation", {
        apiId: cdk.Fn.ref(retVal.api.ChatAppGraphQLApi.GraphQLAPIIdOutput),
        kind: "PIPELINE",
        fieldName: "notifyUserOfConversationCreation",
        typeName: "Mutation", // Query | Mutation | Subscription
        pipelineConfig: {
          functions: [
            AuthRequestFcn.attrFunctionId,
            NotificationOnConversationCreationFcn.attrFunctionId,
          ]
        },
        requestMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.notifyUserOfConversationCreation, "Mutation.notifyUserOfConversationCreation.req.vtl")).renderTemplate(),
        responseMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.notifyUserOfConversationCreation, "Mutation.notifyUserOfConversationCreation.res.vtl")).renderTemplate(),
      }),
      new appsync.CfnResolver(this, "NotifyUserConversationMutation", {
        apiId: cdk.Fn.ref(retVal.api.ChatAppGraphQLApi.GraphQLAPIIdOutput),
        kind: "PIPELINE",
        fieldName: "updateUserConversationForNotification",
        typeName: "Mutation", // Query | Mutation | Subscription
        pipelineConfig: {
          functions: [
            AuthRequestFcn.attrFunctionId,
            UpdateUserConversationForNotificationFcn.attrFunctionId,
          ]
        },
        requestMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.notifyUserConversation, "Mutation.notifyUserConversation.req.vtl")).renderTemplate(),
        responseMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.notifyUserConversation, "Mutation.notifyUserConversation.res.vtl")).renderTemplate(),
      }),
      new appsync.CfnResolver(this, "UpdateUserStatusMutation", {
        apiId: cdk.Fn.ref(retVal.api.ChatAppGraphQLApi.GraphQLAPIIdOutput),
        kind: "PIPELINE",
        fieldName: "updateUserStatus",
        typeName: "Mutation", // Query | Mutation | Subscription
        pipelineConfig: {
          functions: [
            AuthRequestFcn.attrFunctionId,
            UpdateUserStatusFcn.attrFunctionId,
          ]
        },
        requestMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.updateUserStatus, "Mutation.updateUserStatus.req.vtl")).renderTemplate(),
        responseMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.updateUserStatus, "Mutation.updateUserStatus.res.vtl")).renderTemplate(),
      }),
      new appsync.CfnResolver(this, "UpdateUserNameMutation", {
        apiId: cdk.Fn.ref(retVal.api.ChatAppGraphQLApi.GraphQLAPIIdOutput),
        kind: "PIPELINE",
        fieldName: "updateUserName",
        typeName: "Mutation", // Query | Mutation | Subscription
        pipelineConfig: {
          functions: [
            AuthRequestFcn.attrFunctionId,
            UpdateUserNameFcn.attrFunctionId,
          ]
        },
        requestMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.updateUserName, "Mutation.updateUserName.req.vtl")).renderTemplate(),
        responseMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.updateUserName, "Mutation.updateUserName.res.vtl")).renderTemplate(),
      }),
      new appsync.CfnResolver(this, "UpdateCognitoIdentityIdMutation", {
        apiId: cdk.Fn.ref(retVal.api.ChatAppGraphQLApi.GraphQLAPIIdOutput),
        kind: "PIPELINE",
        fieldName: "updateCognitoIdentityId",
        typeName: "Mutation", // Query | Mutation | Subscription
        pipelineConfig: {
          functions: [
            AuthRequestFcn.attrFunctionId,
            UpdateCognitoIdentityFcn.attrFunctionId,
          ]
        },
        requestMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.updateCognitoIdentityId, "Mutation.updateCognitoIdentityId.req.vtl")).renderTemplate(),
        responseMappingTemplate: appsync.MappingTemplate.fromFile(path.join(__dirname, paths.mutation.updateCognitoIdentityId, "Mutation.updateCognitoIdentityId.res.vtl")).renderTemplate(),
      }),
    ]
  }
}
