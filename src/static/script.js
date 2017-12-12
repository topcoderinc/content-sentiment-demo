function hideAllItems() {
  $('.list-group-item').addClass('super-hide');
}

function showParentGroup($item) {
  if(!$item.hasClass('list-group-item')) {
    $item = $item.parents('.list-group-item')
  }

  $item.removeClass('super-hide');
}

function updateStatus(text, type, $root) {
  $root = $root || $(document);
  updatePill($root.find('.status'), text, type);
}

function updatePill($el, text, type) {
  let $status = $el
    .text(text)
    .removeClass('badge-secondary badge-primary badge-danger')
    .addClass('badge-' + type);
  showParentGroup($status);
}

function addWords($el, negativeWords, positiveWords) {
  $el.text('');
  let wordCount = 0;
  if(!_.isUndefined(negativeWords)) {
    _.each(negativeWords, function(word) {
      $el.append('<span class="badge badge-danger">' + word + '</span> ');
    });
    wordCount += negativeWords.length;
  }
  if(!_.isUndefined(positiveWords)) {
    _.each(positiveWords, function(word) {
      $el.append('<span class="badge badge-success">' + word + '</span> ');
    });
    wordCount += positiveWords.length;
  }

  if(wordCount) {
    showParentGroup($el);
  }
}

function showLoadingStatus() {
  updateStatus('Loading…', 'secondary');
}

function showFailedStatus() {
  updateStatus('Failed', 'danger');
}

function updateReTextProfanity(data) {
  let $box = $('.profanity-re-text');
  if(_.isUndefined(data.profanity) || _.isUndefined(data.profanity.reText)) {
    updateStatus('Failed', 'danger', $box);
    return;
  }

  updateStatus('Analyzed', 'success', $box);
  let d = data.profanity.reText;
  updatePill($box.find('.is-profane'), d.isProfane ? 'Yes' : 'No', d.isProfane ? 'danger' : 'success');

  if(d.isProfane) {
    let $w = $box.find('.words');
    addWords($w, d.words);
  }

  if(d.clean.length) {
    showParentGroup(
      $box.find('.clean-text').text(d.clean)
    );
  }
}

function updateReTextSentiment(data) {
  let $box = $('.sentiment-re-text');
  if(_.isUndefined(data.sentiment) || _.isUndefined(data.sentiment.reText)) {
    updateStatus('Failed', 'danger', $box);
    return;
  }

  updateStatus('Analyzed', 'success', $box);

  let d = data.sentiment.reText;
  updatePill($box.find('.range'), d.range, d.range < 0 ? 'danger' : 'success');
  showParentGroup($box.find('.details'));

  addWords($box.find('.words'), d.details.negativeWords, d.details.positiveWords);
  updatePill($box.find('.min-score'), d.details.minScore, d.details.minScore < 0 ? 'danger' : 'success');
  updatePill($box.find('.max-score'), d.details.maxScore, d.details.maxScore < 0 ? 'danger' : 'success');
  updatePill($box.find('.mean-score'), d.details.meanScore, d.details.meanScore < 0 ? 'danger' : 'success');
}

function updateNodeSentiment(data) {
  let $box = $('.sentiment-node');
  if(_.isUndefined(data.sentiment) || _.isUndefined(data.sentiment.node)) {
    updateStatus('Failed', 'danger', $box);
    return;
  }

  updateStatus('Analyzed', 'success', $box);

  let d = data.sentiment.node;
  updatePill($box.find('.range'), d.range, d.range < 0 ? 'danger' : 'success');
  showParentGroup($box.find('.details'));

  addWords($box.find('.words'), d.details.negativeWords, d.details.positiveWords);
  updatePill($box.find('.score'), d.details.score, d.details.score < 0 ? 'danger' : 'success');
}

function getAnalysis(text) {
  let $btn = $('.btn-success');
  if($btn.is(':disabled')) {
    return;
  }
  $('.main-alert').remove();
  $('.btn-success').attr('disabled', true);
  hideAllItems();
  showLoadingStatus();
  $('.analysis').removeClass('super-hide');
  $.ajax({
    dataType: 'json',
    url: '/analyze',
    data: { text },
    success: function(data) {
      $('.btn-success').attr('disabled', false);
      updateReTextProfanity(data);
      updateReTextSentiment(data);
      updateNodeSentiment(data);
    }
  }).fail(function(data) {
    showFailedStatus();
    $('.btn-success').attr('disabled', false);
    let $error = $('<div class="main-alert alert alert-danger alert-dismissible fade show" role="alert"><strong>Oops!</strong> <span class="error-message"></span><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button</div>');
    if(!_.isUndefined(data.responseJSON) && !_.isUndefined(data.responseJSON.message) && !_.isEmpty(data.responseJSON.message)) {
      $error.find('.error-message').text(data.responseJSON.message);
    } else {
      $error.find('.error-message').text(data.statusText);
    }

    $('.jumbotron').after($error);
  });
}

function submitForm() {
  getAnalysis($('.comment-text').val());
}

$(document).ready(function() {
  $('.btn-success').on('click', submitForm);
  $('.comment-text').on('keypress', function(e) {
    if(e.which === 13) {
      submitForm();
    }
  });
});
