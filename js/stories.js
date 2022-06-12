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

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
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

/**  see if story is a favorite and update hearts on page */
function checkforFavoritesandUpdateUI(story) {
  // /not sure why I had to call user on static function?
  let heart = "";
  if (User.findFavorites(story) === true) {
    heart = "fas";
  } else {
    heart = "far";
  }
  return `
      <span class="${heart} fa-heart"></i>
      </span>`;
}
/**When user clicks change the heart and save the favorite/unfavorite it to the api and favorite story array*/
async function updateFavoriteStoryOnClick(e) {
  let parentLI = $(e.target).parent();
  let clickedStoryId = parentLI.attr("id");

  if ($(e.target).hasClass("fas")) {
    await User.userFavoritesDelete(currentUser, clickedStoryId);
    $(e.target).removeClass("fas").addClass("far");
    currentUser.favorites = currentUser.favorites.filter(
      (element) => element.storyId !== clickedStoryId
    );
    addFavoritetoList();
  } else {
    await User.userFavorites(currentUser, clickedStoryId);
    $(e.target).removeClass("far").addClass("fas");
    const story = storyList.stories.find(
      (element) => element.storyId === clickedStoryId
    );
    currentUser.favorites.push(story);
    addFavoritetoList();
  }
}
$body.on("click", "span", updateFavoriteStoryOnClick);