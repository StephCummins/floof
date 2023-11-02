const AWS = require('aws-sdk');
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../server/.env') })

AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY

})

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'floof';

const getIds = async () => {
  const params = {
    TableName: 'floof-ids'
  }
  return await dynamoClient.scan(params).promise();
}

exports.getIds = getIds;

const getFloof = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id
    },
  }
  return await dynamoClient.get(params).promise();
}

exports.getFloof = getFloof;

const addOrUpdateFloof = async (floof) => {
  const params = {
    TableName: TABLE_NAME,
    Item: floof
  }
  return await dynamoClient.put(params).promise();
}

exports.addOrUpdateFloof = addOrUpdateFloof;

const getFloofOfTheDay = async () => {
    const params = {
      TableName: 'top-floof-of-the-day',
      Key: {
        id: 0,
      }
    }
    return await dynamoClient.get(params).promise();
}

exports.getFloofOfTheDay = getFloofOfTheDay;

const updateTopFloof = async (floof) => {
  const params = {
    TableName: 'top-floof-of-the-day',
    Item: floof
  }
  return await dynamoClient.put(params).promise();
}

exports.updateTopFloof = updateTopFloof;

const addToIdTable = async (floof) => {
  const params = {
    TableName: 'floof-ids',
    Item: floof
  }
  return await dynamoClient.put(params).promise();
}

exports.addToIdTable = addToIdTable;