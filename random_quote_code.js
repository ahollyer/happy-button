const AWS = require('aws-sdk');
const fetch = require("node-fetch");
const FormData = require("form-data");

exports.handler = (event, context, callback) => {
  let form = new FormData();
  form.append("method", "getQuote");
  form.append("lang", "en");
  form.append("format", "json");

  const url = 'http://api.forismatic.com/api/1.0/';
  const options = {
    method: 'POST',
    body: form,
    headers: form.getHeaders(),
  };

  fetch(url, options)
    .then(response => response.json())
    .then(json => {
      const message = `${json.quoteText} --${json.quoteAuthor}`;
      const sns = new AWS.SNS();
      sns.publish({
          TopicArn: 'arn:aws:sns:us-west-2:746389856619:test-esp32-button-mySNSTopic-1J6Q6K03G2NC5',
          Message: JSON.stringify(message)
      }, function(err, data) {
          if(err) {
            console.error('error publishing to SNS');
            context.fail(err);
          } else {
            console.info('message published to SNS');
            context.succeed();
          }
      });
    })
    .catch(console.error);
}
