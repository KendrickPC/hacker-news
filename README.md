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

### Subpart 2B: Building The UI for New Story Form/Add New Story
Now, we’ll add the UI for the story-adding feature:

- Add a form in the HTML for the story. This should initially be hidden.
1. Creating submit new story form in index.html. Take out the hidden class in form to test.
```html
<section class="submit-story-container container">
  <form id="new-story-form" class="hidden">
    <div>
      <label for="new-story-author">Author: </label>
      <input id="new-story-author" required placeholder="Author Name">
    </div>
    <div>
      <label for="new-story-title">Title: </label>
      <input id="new-story-title" require placeholder="Story Title">
    </div>
    <div>
      <label for="new-story-url">URL: </label>
      <input id="new-story-url" required placeholder="URL">
    </div>
    <button type="submit">submit</button>
  </form>
</section>
```

- Add a link in the navbar with the text of “submit”.
2. Check on nav.js file. There is a jQuery call to .main-nav-links class. However, there is no main-nav-links class in our index.html file, so let's make one here.
```html
<div class="main-nav-links hidden">
    <a class="nav-link" href="#" id="nav-submit">submit</a>
</div>
```



- Write a function in nav.js that is called when users click that navbar link. Look at the other function names in that file that do similar things and pick something descriptive and similar.

- Write a function in stories.js that is called when users submit the form. Pick a good name for it. This function should get the data from the form, call the .addStory method you wrote, and then put that new story on the page.