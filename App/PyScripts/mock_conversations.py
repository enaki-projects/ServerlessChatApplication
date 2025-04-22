import json
import uuid

import boto3
from dateutil import parser

from generate_user_scripts import read_js_content, AWS_EXPORTS_PATH, read_content

CONVERSATION_TABLE = "Conversation"
MESSAGE_TABLE = "Message"
USER_TABLE = "User"
USER_CONVERSATION_TABLE = "UserConversation"
CHATS_PATH = "input/chats.json"

aws_exports = read_js_content(AWS_EXPORTS_PATH)
dynamodb = boto3.resource('dynamodb', region_name=aws_exports["aws_cognito_region"])


def get_tables():
    tables = list(dynamodb.tables.all())
    map_tables = {}

    for table in tables:
        if MESSAGE_TABLE in table.name:
            map_tables[MESSAGE_TABLE] = table.name
        elif USER_CONVERSATION_TABLE in table.name:
            map_tables[USER_CONVERSATION_TABLE] = table.name
        elif USER_TABLE in table.name:
            map_tables[USER_TABLE] = table.name
        elif CONVERSATION_TABLE in table.name:
            map_tables[CONVERSATION_TABLE] = table.name
    return map_tables


def get_users_info():
    table = dynamodb.Table(DS[USER_TABLE])
    response = table.scan()
    data = response['Items']
    return data


def insert_conversation(chat):
    print("Creating conversation between {} and {}.".format(chat["user1"], chat["user2"]))
    conversation_table = dynamodb.Table(DS[CONVERSATION_TABLE])
    user_conversation_table = dynamodb.Table(DS[USER_CONVERSATION_TABLE])
    message_table = dynamodb.Table(DS[MESSAGE_TABLE])

    conversation_id = uuid.uuid4().hex
    response = conversation_table.put_item(
        Item={
            'id': conversation_id,
            'createdAt': parser.parse(chat["conversation"]["createdAt"]).isoformat(),
            'updatedAt': parser.parse(chat["conversation"]["createdAt"]).isoformat(),
            'isGroup': False
        }
    )

    for t_user in [chat["user1"], chat["user2"]]:
        response = user_conversation_table.put_item(
            Item={
                'id': uuid.uuid4().hex,
                'conversationId': conversation_id,
                'userId': users_name_map[t_user]["id"],
                'createdAt': parser.parse(chat["conversation"]["createdAt"]).isoformat(),
                'updatedAt': parser.parse(chat["conversation"]["createdAt"]).isoformat(),
                'noUnread': 0,
            }
        )

    message_id = None

    for message in chat["conversation"]["messages"]:
        message_id = uuid.uuid4().hex
        response = message_table.put_item(
            Item={
                'id': message_id,
                'authorId': users_name_map[message["authorId"]]["id"],
                'conversationId': conversation_id,
                'content': message["content"],
                'type': "text",
                'createdAt': parser.parse(message["createdAt"]).isoformat(),
                'updatedAt': parser.parse(message["createdAt"]).isoformat(),
                'isSent': True,
            }
        )

    if message_id:
        response = conversation_table.update_item(
            ExpressionAttributeNames={
                '#lastMessageId': 'lastMessageId'
            },
            ExpressionAttributeValues={
                ':lastMessageId': message_id
            },
            Key={
                'id': conversation_id
            },
            ReturnValues='ALL_NEW',
            UpdateExpression='SET #lastMessageId = :lastMessageId',
        )

    print("Conversation between {} and {} created successfully.\n".format(chat["user1"], chat["user2"]))


if __name__ == '__main__':
    DS = get_tables()
    users = get_users_info()
    users_name_map = {}
    for user in users:
        users_name_map[user["name"]] = user

    chats = json.loads(read_content(CHATS_PATH))

    for chat in chats:
        insert_conversation(chat)
