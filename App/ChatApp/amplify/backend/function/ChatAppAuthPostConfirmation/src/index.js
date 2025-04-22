/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	USER_TABLE
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const aws = require('aws-sdk');
const ddb = new aws.DynamoDB();
let date = new Date();

const DEFAULT_USERS = [
  "ash",
  "eren",
  "pikachu",
  "mikasa",
  "courage",
  "inuyasha",
  "pumba",
  "phineas",
  "mabel",
  "dipper",
  "soos",
  "kikyo",
  "seshomaru"
]

function getAvatarPath(email) {
  const username = email.split("@")[0]
  if (DEFAULT_USERS.includes(username)) {
    return `assets/images/users/${username}.jpg`
  }
  return null;
}

exports.handler = async (event, context, callback) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  if (event.request.userAttributes.email) {
    let params = {
      Item: {
        "id": {S: event.request.userAttributes.sub},
        "email": {S: event.request.userAttributes.email},
        "name": {S: event.request.userAttributes.email.split("@")[0]},
        "status": {S: "offline"},
        "createdAt": {S: date.toISOString()},
        "updatedAt": {S: date.toISOString()},
        "owner": {S: event.request.userAttributes.sub},
      },
      TableName: process.env.USER_TABLE
    }

    const avatarPath = getAvatarPath(event.request.userAttributes.email);
    if (avatarPath) {
      params.Item.avatarPath = {S: avatarPath};
    }

    console.log(params);
    try {
      await ddb.putItem(params).promise()
      console.log("Success")
    } catch (err) {
      console.log("Error: ", err)
    }
  }
  callback(null, event);
};
