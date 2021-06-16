(function() {
  const onPressSuccess = () => {
    let btnsEl = document.querySelector('.vote-btns');
    let textEl = document.querySelector('.vote-thanks');

    btnsEl.classList.add("hide");
    textEl.classList.remove("hide");
  };

  const rateThePage = (like=false) => {
    const body = {
        resourceName: window.location.pathname.replace('.html', '/'),
        source: 'docs',
        dir: like ? 'up' : 'down'
    };

    fetch('https://front.moncc.io/hub/api/v1/vote/add', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
        }
      })
    .then(response => response.json())
    .then(onPressSuccess);
  };

  const onLikePress = () => rateThePage(true);
  const onDislikePress = () => rateThePage();

  let content = document.querySelector('.md-content');
  const voteStringEl = `<div class="vote-wrapper">
    <div class="vote-container">
      <span class="vote-title">Rate this page</span>
      <div class="vote-btns">
        <button class="vote-btn" id="vote-like">👍</button>
        <button class="vote-btn" id="vote-dislike">👎</button>
      </div>
    </div>
    <p class="vote-thanks hide">Thanks!</p>
</div>`;

  content.insertAdjacentHTML('beforeend', voteStringEl);

  let likeBtn = document.getElementById('vote-like');
  let dislikeBtn = document.getElementById('vote-dislike');

  likeBtn.addEventListener('click', onLikePress);
  dislikeBtn.addEventListener('click', onDislikePress);
})();