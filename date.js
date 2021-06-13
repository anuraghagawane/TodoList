exports.date = function() {
  let today = new Date();
  let options = {
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  };

  return today.toLocaleDateString('en-us', options);
}


exports.day = function() {
  let today = new Date();
  let options = {
    weekday: 'long'
  };

  return today.toLocaleDateString('en-us', options);
}
