import boto3

from generate_user_scripts import AWS_EXPORTS_PATH, read_js_content
from mock_conversations import get_tables, CONVERSATION_TABLE, MESSAGE_TABLE, USER_CONVERSATION_TABLE, USER_TABLE

aws_exports = read_js_content(AWS_EXPORTS_PATH)
dynamodb = boto3.resource('dynamodb', region_name=aws_exports["aws_cognito_region"])

PK = "id"


def delete_all_items_from_table(table_name):
    print("Start deleting items from {} ...".format(table_name))
    table = dynamodb.Table(table_name)

    scan = None
    with table.batch_writer() as batch:
        while scan is None or 'LastEvaluatedKey' in scan:
            if scan is not None and 'LastEvaluatedKey' in scan:
                scan = table.scan(
                    ProjectionExpression=PK,  # Replace with your actual Primary Key
                    ExclusiveStartKey=scan['LastEvaluatedKey'],
                )
            else:
                scan = table.scan(ProjectionExpression=PK)

            for item in scan['Items']:
                batch.delete_item(Key={PK: item[PK]})
    print("Clear {} successful.\n".format(table_name))


if __name__ == '__main__':
    DS = get_tables()
    delete_all_items_from_table(DS[MESSAGE_TABLE])
    delete_all_items_from_table(DS[USER_CONVERSATION_TABLE])
    delete_all_items_from_table(DS[CONVERSATION_TABLE])
    # delete_all_items_from_table(DS[USER_TABLE])
