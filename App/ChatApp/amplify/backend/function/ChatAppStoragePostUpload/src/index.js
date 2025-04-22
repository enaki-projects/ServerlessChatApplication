/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	USER_TABLE
Amplify Params - DO NOT EDIT */

// https://docs.aws.amazon.com/lambda/latest/dg/with-s3-tutorial.html

// dependencies
const AWS = require('aws-sdk');
const util = require('util');
const sharp = require('sharp');

// get reference to S3 client
const s3 = new AWS.S3();

exports.handler = async (event, context, callback) => {

  // Read options from the event parameter.
  console.log(event);
  console.log("Reading options from event:\n", util.inspect(event, {depth: 5}));

  const srcBucket = event.Records[0].s3.bucket.name;
  // Object key may have spaces or unicode non-ASCII characters.
  const srcKey    = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));

  const srcKeysTokens = srcKey.split("/")
  if (!srcKey.includes("/avatar") && srcKeysTokens[2] !== "avatar" && srcKeysTokens.length !== 4) {
    console.log("Returning as this is not the use case for an avatar ...");
    return;
  }

  const dstBucket = srcBucket;
  const dstKey    = srcKey;


  // Infer the image type from the file suffix.
  const typeMatch = srcKey.match(/\.([^.]*)$/);
  if (!typeMatch) {
    console.log("Could not determine the image type.");
    return;
  }

  // Check that the image type is supported
  const imageType = typeMatch[1].toLowerCase();
  if (imageType != "jpg" && imageType != "png") {
    console.log(`Unsupported image type: ${imageType}`);
    return;
  }

  // Download the image from the S3 source bucket.
  try {
    const params = {
      Bucket: srcBucket,
      Key: srcKey
    };
    var origimage = await s3.getObject(params).promise();

  } catch (error) {
    console.log(error);
    return;
  }

  // set thumbnail width. Resize will set the height automatically to maintain aspect ratio.
  const width  = 200;

  // Use the sharp module to resize the image and save in a buffer.
  try {
    const verification_buffer = await sharp(origimage.Body)
    const metadata = await verification_buffer.metadata()
    if (metadata.width === width) {
      console.log("Image already resized. Returning ...")
      return;
    }
    var buffer = await sharp(origimage.Body).resize(width).toBuffer();

  } catch (error) {
    console.log(error);
    return;
  }

  // Upload the thumbnail image to the destination bucket
  try {
    const destparams = {
      Bucket: dstBucket,
      Key: dstKey,
      Body: buffer,
      ContentType: "image"
    };

    const putResult = await s3.putObject(destparams).promise();

  } catch (error) {
    console.log(error);
    return;
  }
  console.log('Successfully resized ' + srcBucket + '/' + srcKey + ' and uploaded to ' + dstBucket + '/' + dstKey);

  const ddb = new AWS.DynamoDB();
  cognitoIdentityId = srcKeysTokens[1]
  const query_params = {
    TableName: process.env.USER_TABLE,
    IndexName: 'byCognitoIdentityId',
    KeyConditionExpression: '#cognitoIdentityId = :cognitoIdentityId',
    ExpressionAttributeNames: {
      '#cognitoIdentityId': 'cognitoIdentityId'
    },
    ExpressionAttributeValues: {
      ':cognitoIdentityId': { S: cognitoIdentityId }
    }
  };

  console.log("Params for querying the user data: ", query_params)
  try {
    let data = await ddb.query(query_params).promise()
    console.log(data.Items)
    if (!data.Items || data.Items.length == 0) {
      console.log("No items found with " + cognitoIdentityId + ". Returning ...")
      return;
    }

    let avatarPath = srcKeysTokens[2] + "/" + srcKeysTokens[3]
    let put_params =
      {
        TableName: process.env.USER_TABLE,
        Key: {
          'id': { S: data.Items[0].id.S }
        },
        UpdateExpression: 'SET #avatarPath = :avatarPath',
        ExpressionAttributeNames: {
          '#avatarPath': 'avatarPath'
        },
        ExpressionAttributeValues: {
          ':avatarPath': { S: avatarPath }
        }
      };
    console.log("Params for updating user avatar path: ", put_params)

    try {
      await ddb.updateItem(put_params).promise()
      console.log("Successfully update user avatar path.")
    } catch (err) {
      console.log("Error on updating user avatar path: ", err)
    }
  } catch (err) {
    console.log("Error on querying user data: ", err)
  }
};
