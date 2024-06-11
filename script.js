function showSidebar(){
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = 'flex';
}

function hideSidebar(){
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = 'none';
}


var lastFilteredCategory = null;

function filterCards(category) {
  var cards = document.getElementsByClassName('card');
  
  if (lastFilteredCategory === category) {
   
    for (var i = 0; i < cards.length; i++) {
      cards[i].style.display = 'block';
    }
    lastFilteredCategory = null;
  } else {
 
    for (var i = 0; i < cards.length; i++) {
      if (cards[i].dataset.category !== category) {
        cards[i].style.display = 'none';
      } else {
        cards[i].style.display = 'block';
      }
    }
    lastFilteredCategory = category;
  }
}

document.getElementById('filterButton').addEventListener('click', function() {
    var filterOptions = document.getElementById('filterOptions');
    if (filterOptions.style.display === 'none') {
      filterOptions.style.display = 'block';
    } else {
      filterOptions.style.display = 'none';
    }
  });
  
  var filterOptions = document.getElementsByClassName('filterOption');
  for (var i = 0; i < filterOptions.length; i++) {
    filterOptions[i].addEventListener('click', function() {
      filterCards(this.dataset.category);
    });
  }