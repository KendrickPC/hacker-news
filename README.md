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

7. Inside main.js, inside the hidePageComponents function, add $newStoryForm to the components array.

### Part 3: Favorite stories
In this step, you’ll add a feature marking/unmarking a story as a favorite.

As before, it’s best to write the data-logic and API-call part first, and do the UI afterwards.

- [x] I want to build the UI first, and then get something clicking on the screen so that I can can use chrome debut tools:

1. First, I want to build the favorites tab for on the homepage:
```html
<a class="nav-link" href="#" id="nav-favorites">favorites</a>
```

2. Make a jQuery variable to our newly created nav-favorites link:
Inside main.js
```js
const $navFavorites = $("#nav-favorites")
```

3. Make an index.html section for our favorites list:
```html
  <!-- List of stories favorited by the user -->
  <ol id="favorite-stories" class="hidden stories-list"></ol>
```

4. Make a jQuery call to #favorite-stories:
```js
const $favoriteStories = $("#favorite-stories");
```

5. Add an on("click") event on our newly created favorites nav link. Attach this function to our nav-favorites when clicking.
Inside nav.js
```js
function navFavoritesClick(evt) {
  console.debug("navFavoritesClick", evt);
  // console.log("nav favorites click clicked")
  hidePageComponents();
  putFavoritesListOnPage();
}
$navFavorites.on("click", navFavoritesClick);
```

6. We gotta write a putFavoritesListOnPage() function here. I've decided 4o place this function inside the js/stories.js file: Here, I can use the putStoriesOnPage() reference to build this one (putFavoritesListOnPage) out...

Template on how to build this out:

```js 
/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}
```
 
favorites list is stored in currentUser.favorites
```js
/******************************************************************************
 * Functionality for favorites list and starr/un-starr a story
 */
/** Put favorites list on page. */

function putFavoritesListOnPage() {
  console.debug("putFavoritesListOnPage");
  $favoriteStories.empty();
  if (currentUser.favorites.length !== 0) {
    // iterate through currentUser.favorites:
    for (let story of currentUser.favorites) {
      const $favoriteStory = generateStoryMarkup(story);
      $favoriteStories.append($favoriteStory);
    }
  } else {
    $favoriteStories.append("<h1>No favorite stories added</h1>");
  }
  $favoriteStories.show();
}
```

7. Write data logic of favorites for stories - start with js/models.js ...
Inside the User class, create addFavorites and deleteFavorites methods:
```js
  /** Add a story to the list of user favorites and update the API
   * - story: a Story instance to add to favorites
   */

  async addFavorite(story) {
    this.favorites.push(story);
    await this._addOrRemoveFavorite("add", story)
  }

  /** Remove a story to the list of user favorites and update the API
   * - story: the Story instance to remove from favorites
   */

  async removeFavorite(story) {
    this.favorites = this.favorites.filter(s => s.storyId !== story.storyId);
    await this._addOrRemoveFavorite("remove", story);
  }

  /** Update API with favorite/not-favorite.
   *   - newState: "add" or "remove"
   *   - story: Story instance to make favorite / not favorite
   * */

  async _addOrRemoveFavorite(newState, story) {
    const method = newState === "add" ? "POST" : "DELETE";
    const token = this.loginToken;
    await axios({
      url: `${BASE_URL}/users/${this.username}/favorites/${story.storyId}`,
      method: method,
      data: { token },
    });
  }
```

8. Adding star icon to UI. Inside stories.js
```js
  // Inside generateStoryMarkup(story);
  // if a user is logged in, show favorite/not-favorite star
  const showStar = Boolean(currentUser);

  // Inside the return html markup:
  ${showStar ? getStarHTML(story, currentUser) : ""}

/** Make favorite/not-favorite star for story */
function getStarHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
      <span class="star">
        <i class="${starType} fa-star"></i>
      </span>`;
}
```

9. isFavorites is undefined. Add isFavorites to the bottom of models.js
```js
  /** Return true/false if given Story instance is a favorite of this user. */
  isFavorite(story) {
    return this.favorites.some(s => (s.storyId === story.storyId));
  }
```

10. $storiesLists is undefined. Inside main.js, add the jQuery selector:
```js
// selector that finds all three story lists
const $storiesLists = $(".stories-list");
```

11. Add $favoriteStories variable to js/main.js hideComponents() array.


### Part 4: Removing Stories
Allow logged in users to remove a story. Once a story has been deleted, remove it from the DOM and let the API know its been deleted.

1. Let's start by creating a nav link for user stories in index.html
```html
<a class="nav-link" href="#" id="nav-user-stories">user stories</a>

<!-- List of stories by the user -->
<ol id="user-stories" class="hidden stories-list"></ol>
```

2. Make a jQuery variable #for nav-user-stories in the js/main.js file:

```js
const $navUserStories = $("#nav-user-stories");
const $userStories = $("#user-stories");
```

3. Create a function to handle the click on user stories link:
Inside js/nav.js:

```js
/** Show My Stories on clicking "my stories" */
function navUserStories(evt) {
  console.debug("navUserStories", evt);
  hidePageComponents();
  putUserStoriesOnPage();

}
$navUserStories.on("click", navUserStories);
```

4. Next, we need to putUserStoriesOnPage by writing our own function to handle this:
```js
function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");
  $userStories.empty();
  if (currentUser.ownStories.length !== 0) {
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $userStories.append($story);
    } 
  } else {
      // loop through all of users stories and generate HTML for them
      $$userStories.append("<h5>No stories added by user yet!</h5>");
    }
  $userStories.show();
}

$userStories.on("click", )
```

5. Hide user stories from page components when not in use:
Inside js/main.js, add $userStories to hidePageComponents();

6. Next, add a delete icon to delete our own stories from the server.
Inside stories.js
```js
/** Make delete button HTML for story */
function getDeleteBtnHTML() {
  return `
      <span class="trash-can">
        <i class="fas fa-trash-alt"></i>
      </span>`;
}
```

7. Build the removeStory function inside models.js StoryList class
```js
  /** Delete story from API and remove from the story lists.
   *
   * - user: the current User instance
   * - storyId: the ID of the story you want to remove
   */

  async removeStory(user, storyId) {
    const token = user.loginToken;
    await axios({
      url: `${BASE_URL}/stories/${storyId}`,
      method: "DELETE",
      data: { token: user.loginToken }
    });

    // filter out the story whose ID we are removing
    this.stories = this.stories.filter(story => story.storyId !== storyId);

    // do the same thing for the user's list of stories & their favorites
    user.ownStories = user.ownStories.filter(s => s.storyId !== storyId);
    user.favorites = user.favorites.filter(s => s.storyId !== storyId);
  }
```

8. Inside stoires.js, build out the deleteStory function:
```js
/** Handle deleting a story. */

async function deleteStory(evt) {
  console.debug("deleteStory");

  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");

  await storyList.removeStory(currentUser, storyId);

  // re-generate story list
  await putUserStoriesOnPage();
}

$userStories.on("click", ".trash-can", deleteStory);
```