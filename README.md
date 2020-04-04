# Sidemail Node.js library

[![Try on RunKit](https://badgen.net/badge/try%20on%20runkit/sidemail/0090f0)](https://npm.runkit.com/@sidemail/sdk-js)

The Sidemail Node.js library provides convenient access to the Sidemail API from applications written in server-side JavaScript.

## Installation

Install this package with:

```sh
npm install @sidemail/sdk-js --save
# or
yarn add @sidemail/sdk-js
```

## Usage

First, the package needs to be configured with your project's API key, which you can find in the Sidemail Dashboard.

Here's how:

```javascript
// Create Sidemail instance and set your API key.
const configureSidemail = require("@sidemail/sdk-js");
const sidemail = configureSidemail({ apiKey: "xxxxx" });
```

Then, you can call `sidemail.sendEmail` method to send emails like so:

```javascript
try {
  const response = await sidemail.sendMail({
    toAddress: "user@email.com",
    fromAddress: "you@example.com",
    fromName: "Your app",
    templateName: "Single sign-on",
    templateProps: { url: "https://your.app/sso?token=123" },
  });

  // Response will contain scheduled email ID
  console.log(
    `An email with ID '${response.id}' was successfully scheduled to be send. :)`
  );
} catch (err) {
  // Uh-oh, we have an error! You error handling logic...
  console.error(err);
}
```

## Email sending examples

### Send password reset email template

```javascript
await sidemail.sendMail({
  toAddress: "user@email.com",
  fromAddress: "you@example.com",
  fromName: "Your app",
  templateName: "Password reset",
  templateProps: { resetUrl: "https://your.app/reset?token=123" },
});
```

### Schedule email delivery

```javascript
await sidemail.sendMail({
  toAddress: "user@email.com",
  fromName: "Startup name",
  fromAddress: "your@startup.com",
  templateName: "Welcome",
  templateProps: { firstName: "Patrik" },
  // Deliver email in 60 minutes from now
  scheduledAt: "2020-04-04T12:58:50.964Z",
});
```

### Send email template with dynamic list

Useful for dynamic data where you have `n` items that you want to render in email. For example, items in a receipt, weekly statistic per project, new comments, etc.

```javascript
await sidemail.sendMail({
    toAddress: "user@email.com",
    fromName: "Startup name",
    fromAddress: "your@startup.com",
    templateName: "Template with dynamic list",
    templateProps: {
        list: [
            { text: "Dynamic list" },
            { text: "allows you to generate email template content" },
            { text: "based on template props." },
        ],
    }
}
});
```

### Send custom HTML email

```javascript
await sidemail.sendMail({
  toAddress: "user@email.com",
  fromName: "Startup name",
  fromAddress: "your@startup.com",
  subject: "Testing html only custom emails :)",
  html: "<html><body><h1>Hello world! 👋</h1><body></html>",
});
```

### Send custom plain text email

```javascript
await sidemail.sendMail({
  toAddress: "user@email.com",
  fromName: "Startup name",
  fromAddress: "your@startup.com",
  subject: "Testing plain-text only custom emails :)",
  text: "Hello world! 👋",
});
```

## Contacts

### Create or update a contact

```javascript
try {
  const response = await sidemail.contacts.createOrUpate({
    emailAddress: "marry@lightning.com",
    identifier: "123",
    customProps: {
      name: "Marry Lightning",
      // ... more of your contact props ...
    },
  });

  // Response will contain scheduled email ID
  console.log(`Contact was '${response.status}'.`);
} catch (err) {
  // Uh-oh, we have an error! You error handling logic...
  console.error(err);
}
```

### Find contact

```javascript
try {
  const response = await sidemail.contacts.find({
    emailAddress: "marry@lightning.com",
  });

  // Response will contain scheduled email ID
  console.log(`Contact data:' ${response.contact}'.`);
} catch (err) {
  // Uh-oh, we have an error! You error handling logic...
  console.error(err);
}
```

### Delete contact

```javascript
try {
  const response = await sidemail.contacts.delete({
    emailAddress: "marry@lightning.com",
  });

  // Response will contain scheduled email ID
  console.log(`Contact deleted:' ${response.deleted}'.`);
} catch (err) {
  // Uh-oh, we have an error! You error handling logic...
  console.error(err);
}
```

## More info

Visit [Sidemail docs](https://sidemail.io/docs/) for more information.
