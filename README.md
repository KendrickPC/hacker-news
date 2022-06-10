# How I Built This:

Static Async Exlained:
[static async funcion in javascript class](https://stackoverflow.com/questions/66796403/static-async-funcion-in-javascript-class)

[Hack or Snooze API Documentation](https://hackorsnoozeapi.docs.apiary.io/#)

##### Review of Code Base to get an underestanding of how everything works:
- [x] Index.html
- [x] main.js
- [x] models.js
- [x] nav.js
- [x] stories.js
- [x] user.js

### Subpart: 2A:

##### We’ve given you a comment string and a stub method for this, addStory, in the StoryList class. Complete this function, making sure your function takes in the same parameters and returns the same result as our comment said.

1. Get rid of favicon error:
```html
<link rel="shortcut icon" href="#">
```
2. Create an account so that we can test some features:

3. Changed colors of nav.css to dodgerblue. 😬

4. Get the addStory to start working. See what's inside user argument.
```js
  async addStory(user, {title, author, url}) {
    // UNIMPLEMENTED: complete this function!
    console.log(user);
    // Returns user object...
  }
```

5. Build out the addStory function:
- Grab the loginToken from the user object:
- Make a post request to the stories API
```js
async addStory(user, { title, author, url }) {
  const token = user.loginToken;
  const response = await axios({
    method: "POST",
    url: `${BASE_URL}/stories`,
    data: { token, story: { title, author, url } },
  });
}
```

6. Inside of the console, create a newStory with the following code: Copy/Paste:
```js
let newStory = await storyList.addStory(currentUser,
  {title: "Test", author: "Me", url: "http://meow.com"});
```

7. So the new story title is test, author is me, and url is meow.com.
Find the new story data in the response.data;
Inside addStory, create a new instance of Story with the new story data.

```js
  const story = new Story(response.data.story);
```

8. Add new story instance to stories:
```js
  this.stories.unshift(story);
  // user.ownStories.unshift(story);

  return story;
```

9. Completed addStory function:
```js
async addStory(user, { title, author, url }) {
  const token = user.loginToken;
  const response = await axios({
    method: "POST",
    url: `${BASE_URL}/stories`,
    data: { token, story: { title, author, url } },
  });

  const story = new Story(response.data.story);
  this.stories.unshift(story);
  return story;
}
```

10. Fix hostname.com string when new Story is posted.
```js
getHostName() {
  return this.url;
}
```