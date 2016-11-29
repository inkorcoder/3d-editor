var LOG, log;

LOG = {
  content: document.querySelector('.log .content'),
  add: function(string) {
    var cache;
    cache = this.content.innerHTML;
    this.content.innerHTML = cache + "<br> " + string;
    this.content.scrollTop = this.content.scrollHeight;
  }
};

log = new Vue({
  el: '#log',
  data: {
    isActive: true
  }
});
