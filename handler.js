'use strict';
const AWS = require("aws-sdk");
const lambda = new AWS.Lambda({
  region: "us-west-2"
});

module.exports.echo = async (event, context) => {
  console.log('event:');
  console.log(JSON.stringify(event, null, 2));
  console.log('context:');
  console.log(JSON.stringify(context, null, 2))
  console.log('env:')
  console.log(process.env);
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        event: event,
        context: context,
        env: {
          GLOBAL_API_KEY: process.env.GLOBAL_API_KEY,
          ECHO_API_KEY: process.env.ECHO_API_KEY,
        },
        message: 'Go Serverless v1.0! Your function executed successfully!',
      },
      null,
      2
    ),
  };
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

module.exports.callEcho = (event, context, callback) => {
  console.log('callEcho:');
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

  console.log('callEcho:before lambda')
  lambda.invoke(params, (error, data) => {
    console.log('callEcho:lambda.invoke:callback');
    if (error) {
      console.error(error.message);
      callback(error);
    } else if (data) {
      console.log('returned from echo:')
      console.log(data);
      callback(null, { success: true });
    }
  });
  console.log('callEcho:after lambda');
}
