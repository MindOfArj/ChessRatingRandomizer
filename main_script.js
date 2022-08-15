// This is needed to prevent infinite looping when the mutation observer is
// triggered.
let globalRatings = new Map();
let useTier = true;
let useUSCF = false;

function run() {
  // Hide end user rating
  const newRatingNode = document.querySelector('span.new-rating-component');
  if (newRatingNode) {
    newRatingNode.style.display = 'none';
  }
  const ratingChangeNode = document.querySelector('div.rating-change-right');
  if (ratingChangeNode) {
    ratingChangeNode.style.display = 'none';
  }

  // Replace user rating with a tier
  const tagline = document.querySelectorAll('div.user-tagline-component:not(.archive-tab-player)');
  for (let i = 0; i < tagline.length; i++) {
    const rating = tagline[i].querySelector('span.user-tagline-rating');
    if (rating !== null) {
      const ratingNum = parseInt(rating.innerHTML.replace(/\D/g,''), 10);
      const username = tagline[i].querySelector('.user-username-component').innerHTML; 
      if (!isNaN(ratingNum) && globalRatings.get(username) !== ratingNum) {
        swapNewRating(tagline[i], rating, ratingNum, username);
      }
    }
  }

  // Replace end user rating (and rating change) with a tier
  const endRating = document.querySelector('div.rating-value-value');
  if (endRating !== null) {
    const rating = endRating.querySelector('span.new-rating-component');
    const ratingNum = parseInt(rating.innerHTML.replace(/\D/g,''), 10);
    const ratingChange = endRating.querySelector('div.rating-change-right');
    const ratingChangeNum = parseInt(ratingChange.innerHTML.replace(/[^\d.-]/g,''), 10);
    const mapKey = 'endRating';
    const oldRatingNum = globalRatings.get(mapKey);
    if (!isNaN(ratingNum) && oldRatingNum !== ratingNum) {
      swapNewRating(endRating, rating, ratingNum, mapKey);
      swapChangeNode(endRating, ratingChange, ratingNum, ratingChangeNum);
    }
  }

  // Hide chat ratings
  const chatStartRatings = document.querySelectorAll('div.live-game-start-component')
  for (let i = 0; i < chatStartRatings.length; i++) {
    // TODO: Change chat ratings with jQuery
    chatStartRatings[i].style.display = 'none';
  }
  const chatEndRatings = document.querySelectorAll('div.live-game-over-component')
  for (let i = 0; i < chatEndRatings.length; i++) {
    // TODO: Change chat ratings with jQuery
    chatEndRatings[i].style.display = 'none';
  }
}

function swapNewRating(parentNode, ratingNode, ratingNum, globalKey) {
  const newTierNode = makeRatingNode(ratingNum, globalKey);
  const previousTierNode = parentNode.querySelector('#previous-rating');
  if (previousTierNode !== null) {
    parentNode.removeChild(previousTierNode);
  }
  parentNode.insertBefore(newTierNode, ratingNode);
  ratingNode.style.display = 'none';
  globalRatings.set(globalKey, ratingNum);
}

function makeRatingNode(ratingNum, globalKey) {
  let childNodeText = document.createTextNode(`(${calculateTier(ratingNum)})`);
  if (globalKey === 'endRating') {
    childNodeText = document.createTextNode(calculateTier(ratingNum));
  }
  const childNode = document.createElement('span');
  childNode.setAttribute('id', 'previous-rating');
  childNode.style.color = 'hsla(0,0%,100%,.65)';
  if (globalKey === 'endRating') {
    childNode.style.color = '#000';
  }
  childNode.appendChild(childNodeText);
  return childNode;
}

function swapChangeNode(endRating, rantingChange, ratingNum, ratingChangeNum) {
  if (calculateTier(ratingNum) !== calculateTier(ratingNum - ratingChangeNum)) {
    const previousChangeNode = endRating.querySelector('#previous-rating-change');
    if (previousChangeNode !== null) {
      endRating.removeChild(previousChangeNode);
    }
    if (ratingChangeNum > 0) {
      let changeNodeText = document.createTextNode('Promoted!');
      const childNode = document.createElement('span');
      childNode.setAttribute('id', 'previous-rating-change');
      childNode.style.color = '#85a94e';
      childNode.style.fontSize = '1.4rem';
      childNode.appendChild(changeNodeText);
      endRating.insertBefore(childNode, rantingChange);
    } else {
      let changeNodeText = document.createTextNode('Demoted.');
      const childNode = document.createElement('span');
      childNode.setAttribute('id', 'previous-rating-change');
      childNode.style.color = '#a7a6a2';
      childNode.style.fontSize = '1.4rem';
      childNode.appendChild(changeNodeText);
      endRating.insertBefore(childNode, rantingChange);
    }
  }
}

function calculateTier(ratingNum) {
  timeControl = getTimeControl();
  if (timeControl === 'blitz') {
    return useUSCF ? uscfNormalizedBlitzTier(ratingNum) : calculateBlitzTier(ratingNum);
  } else if (timeControl === 'rapid') {
    return useUSCF ? uscfNormalizedRapidTier(ratingNum) : calculateRapidTier(ratingNum);
  } else {
    return useUSCF ? uscfNormalizedRapidTier(ratingNum) : calculateDailyTier(ratingNum);
  }
}

function getTimeControl() {
  let timeControlNode = document.querySelector('span.time-selector-icon') || document.querySelector('span.tabs-icon')
  if (timeControlNode !== null) {
    if (timeControlNode.classList.contains('bullet') || timeControlNode.classList.contains('blitz')) {
      return 'blitz';
    } else if (timeControlNode.classList.contains('rapid')) {
      return 'rapid';
    } else {
      return 'daily';
    }
  }
  return 'blitz';
}

function calculateBlitzTier(ratingNum) {
  var randomRating = random(200,3000);
  if (ratingNum > -1) {
    return randomRating;
  } else {
    return '✨ Supreme Champion ✨';
  }
}

function calculateRapidTier(ratingNum) {
  var randomRating = random(200,3000);
  if (ratingNum > -1) {
    return randomRating;
  } else {
    return '✨ Supreme Champion ✨';
  }
}

function uscfNormalizedBlitzTier(ratingNum) {
  var randomRating = random(200,3000);
  if (ratingNum > -1) {
    return randomRating;
  } else {
    return '✨ Supreme Champion ✨';
  }
}

function uscfNormalizedRapidTier(ratingNum) {
  var randomRating = random(200,3000);
  if (ratingNum > -1) {
    return randomRating;
  } else {
    return '✨ Supreme Champion ✨';
  }
}

chrome.storage.sync.get(['useTier', 'useUSCF'], (items) => {
  if (items['useTier'] === undefined) {
    chrome.storage.sync.set({ 'useTier': true });
  }
  if (items['useUSCF'] === undefined) {
    chrome.storage.sync.set({ 'useUSCF': false });
  }
  if (items['useTier'] === false) {
    return;
  }
  if (items['useUSCF'] !== undefined) {
    useUSCF = items['useUSCF'];
  }
  var observer = new MutationObserver(function(mutations) {
    run();
  });

  observer.observe(document, { childList: true, subtree: true });
});

