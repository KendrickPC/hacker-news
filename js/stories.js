"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  // if a user is logged in, show favorite/not-favorite star
  const showStar = Boolean(currentUser);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        ${showStar ? getStarHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Make favorite/not-favorite star for story */
function getStarHTML(story, user) {
  console.log(user);
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
      <span class="star">
        <i class="${starType} fa-star"></i>
      </span>`;
}

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


/* When users submit the form. Gets data from the form, calls the addStory method, and puts new story to page: */
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


/** Handle favorite/un-favorite a story */

async function toggleStoryFavorite(evt) {
  console.debug("toggleStoryFavorite");

  const $tgt = $(evt.target);
  const $closestLi = $tgt.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  // see if the item is already favorited (checking by presence of star)
  if ($tgt.hasClass("fas")) {
    // currently a favorite: remove from user's fav list and change star
    await currentUser.removeFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  } else {
    // currently not a favorite: do the opposite
    await currentUser.addFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  }
}

$storiesLists.on("click", ".star", toggleStoryFavorite);


/******************************************************************************
 * Functionality for list of user's own stories
 */

 function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");

  $ownStories.empty();

  if (currentUser.ownStories.length === 0) {
    $ownStories.append("<h5>No stories added by user yet!</h5>");
  } else {
    // loop through all of users stories and generate HTML for them
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }

  $ownStories.show();
}