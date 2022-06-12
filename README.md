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
3. Inside main.js, create a jQuery variable to store our nav-submit id:
```js
const $navSubmit = $("#nav-submit");
const $newStoryForm = $("#new-story-form");

```
4. 
```js
/** Show story submit form on clicking story "submit" */
function navSubmitStoryClick(evt) {
  console.debug("navSubmitStoryClick", evt);
  hidePageComponents();
  $allStoriesList.show();
  $submitForm.show();
}
$navSubmitStory.on("click", navSubmitStoryClick);
```

- Write a function in stories.js that is called when users submit the form. Pick a good name for it. This function should get the data from the form, call the .addStory method you wrote, and then put that new story on the page.
5. Create a submitStory function and delegate a click event on it.
js/stories.js
```js
function submitStory(evt) {
  console.debug("submitStory from stories.js");
  // To prevent reloading the page
  evt.preventDefault();
  console.log("submitStory click!")
}

$newStoryForm.on("submit", submitStory);
```

6. Need to grab new-story-title, new-story-url, new-story-author, and username:
```js
/* When users submit the form. Gets data from the form, calls the addStory method, and puts new story to page: */
// Calls addStory on storyList and pass in the currentUser and new story data. Make sure to call await.Store in newStory variable.
// call generateStoryMarkup with argument of newStory, created above. Save to a variable called $newStory.
// Add $newStory to top of $allStoriesList 
// Use slideUp and trigger reset on our $newStoryForm.
async function submitStory(evt) {
  console.debug("submitStory from stories.js");
  // To prevent reloading the page
  evt.preventDefault();
  // console.log("submitStory click!")
  const title = $("#new-story-title").val();
  const url = $("#new-story-url").val();
  const author = $("#new-story-author").val();
  const username = currentUser.username;
  const newStoryData = {title, url, author, username};

  // console.log(newStoryData);

  const newStory = await storyList.addStory(currentUser, newStoryData);
  // console.log(newStory);
  const $newStory = generateStoryMarkup(newStory);
  $allStoriesList.prepend($newStory);

  $newStoryForm.slideUp("slow");
  $newStoryForm.trigger("reset");
}

$newStoryForm.on("submit", submitStory);
```

### Part 3: Favorite stories
In this step, you’ll add a feature marking/unmarking a story as a favorite.

As before, it’s best to write the data-logic and API-call part first, and do the UI afterwards.

- [x] I want to build the UI first, and then get something clicking on the screen so that I can can use chrome debut tools:

1. First, I want to build the favorites tab for on the homepage:
```html
<a class="nav-link" href="#" id="nav-favorites">favorites</a>
```

99. Writing data logic of favorites for stories: Starting with js/models.js:
Inside the User class, I'll start by creating an addFavorites and deleteFavorites methods:
```js
  static async addUserFavorite(user, id) {
    await axios({
      url: `${BASE_URL}/users/${user.username}/favorites/${id}`,
      method: "POST",
      data: { token: user.loginToken },
    });
  }

  static async userFavoritesDelete(user, id) {
    await axios({
      url: `${BASE_URL}/users/${user.username}/favorites/${id}`,
      method: "DELETE",
      data: { token: user.loginToken },
    });
  }

  static findFavorites(story) {
    return currentUser.favorites.some(
      (element) => element.storyId === story.storyId
    );
  }

```

2. Inside stories.js, iterate through currentUser.favorites ....
```js
//**Filter through favorites and add to favorite tab for user to see */
async function addFavoritetoList() {
  if (currentUser.favorites.length > 0) {
    $("#favorite-stories").empty();
    for (let story of currentUser.favorites) {
      const favStory = generateStoryMarkup(story);
      $("#favorite-stories").append(favStory);
    }
  } else {
    $("#favorite-stories").empty();
    $("#favorite-stories").append(`<h5>You have no favorited stories!</h5>`);
  }
}
```

3. 