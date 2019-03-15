This is official Sidemail API Node.js wrapper for sending transactional emails.

**Example:**
```javascript
/**
	* Require the Sidemail library.
	*
	* If you haven't already, install it with either:
	*	- npm install @sidemail/sdk-js
	*	- yarn @sidemail/sdk-js
**/
const configureSidemail = require("@sidemail/sdk-js");

// Create Sidemail instance and set your API key.
const sidemail = configureSidemail({
	apiKey: "xxxxx",
});

try {
	const response = await sidemail.sendMail({
		toAddress: "user@email.com",
		templateName: "Single sign-on",
		templateProps: { url: "https://your.app/sso?token=123" },
	});
	// Response will contain scheduled email ID
	console.log(
		`An email with ID '${response.id}'
		 was successfully scheduled to be send. :)`
	);
} catch (err) {
	// Uh-oh, we have an error! You error handling logic...
	console.error(err);
}
```

Visit https://docs.sidemail.io/docs/sending-emails for more information.