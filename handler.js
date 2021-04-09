'use strict';
const AWS = require('aws-sdk')
const lambda = new AWS.Lambda()

module.exports.echo = async (event, context) => {
  console.log('event:');
  console.log(JSON.stringify(event, null, 2));
  console.log('context:');
  console.log(JSON.stringify(context, null, 2))
  
  // Clone env
  const env = JSON.parse(JSON.stringify(process.env));
  env.AWS_ACCESS_KEY_ID = 'REDACTED'
  env.AWS_SECRET_ACCESS_KEY = 'REDACTED'
  env.AWS_SESSION_TOKEN = 'REDACTED'
  console.log('env:')
  console.log(env)

  const message = 'Go Serverless v1.0! Your function executed successfully!'
  const payload = { event, context, env, message }

  return { statusCode: 200, body: JSON.stringify(payload) };
};

module.exports.hello = async (event) => {
  console.log(JSON.stringify(event, null, 2));

  const name_ = (event.pathParameters || {}).name || 'Stranger';
  const payload = {
    message: `Hello, ${name_}!`,
  };

  if (event.httpMethod == 'POST') {
    if (event.body) {
      payload.eventBody = JSON.parse(event.body);
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(payload),
  };
};

module.exports.callEcho = async (event, context) => {
  console.log('event:')
  console.log(JSON.stringify(event, null, 2));
  console.log('context:')
  console.log(JSON.stringify(event, null, 2));

  const payload = {
    from: 'callEcho',
    to: 'echo',
    message: 'Hello World!'
  };
  const params = {
    FunctionName: "sls-nodejs-dev-echo",
    InvocationType: "Event",
    Payload: JSON.stringify(payload),
  };

  try {
    const result = await lambda.invoke(params).promise();
    console.log('result from echo lambda:')
    console.log(result)
    return {
      statusCode: 200,
      body: JSON.stringify({
        function: 'callEcho',
        message: 'success'
      })
    }
  }
  catch (err) {
    console.error(error)
    throw err
  }
}

