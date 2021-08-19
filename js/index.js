document.addEventListener("DOMContentLoaded", function() {
  const userObj = {"id":1, "username":"pouros"}
  
  const dbUrl = 'http://localhost:3000/books';
  const ulList = document.querySelector('ul#list');
  const showPanel = document.querySelector('div#show-panel');

  renderList();

  function renderList() {
    ulList.textContent = '';
    fetch(dbUrl)
      .then(res => res.json())
      .then(data => appendBooks(data))
      .catch(err => console.log(err));
  }

  function appendBooks(array) {
    array.forEach(book => {
      const li = document.createElement('li');
      li.textContent = book.title;
      li.addEventListener('click', () => renderPanel(book))
      ulList.appendChild(li);
    })
  }

  function renderPanel(book) {
    const { id, title, subtitle, description, author, img_url, users } = book;
    
    // Reset show panel
    showPanel.textContent = '';

    // Build new show panel
    const img = document.createElement('img');
    img.src = img_url;
    const h2 = document.createElement('h2');
    h2.textContent = title;
    const h3 = document.createElement('h3');
    h3.textContent = subtitle;
    const h4 = document.createElement('h4');
    h4.textContent = author;
    const p = document.createElement('p');
    p.textContent = description;
    const ul = document.createElement('ul');
    users.forEach(user => {
      const li = document.createElement('li');
      li.textContent = user.username;
      ul.appendChild(li);
    })
    const likeBtn = document.createElement('button');
    likeBtn.textContent = 'LIKE';
    likeBtn.addEventListener('click', () => toggleLike(book));


    // Append show panel
    showPanel.appendChild(img);
    showPanel.appendChild(h2);
    showPanel.appendChild(h3);;
    showPanel.appendChild(h4);
    showPanel.appendChild(p);
    showPanel.appendChild(ul)
    showPanel.appendChild(likeBtn);
  }

  function toggleLike(book) {
    console.log(book.users);

    // Find if user exists in current list
    const foundUser = book.users.findIndex(user => user.id === userObj.id);
    console.log(foundUser);
    let newUsers;
    if (foundUser >= 0) {
      console.log('User found, unliking.')
      newUsers = book.users.slice(0, foundUser).concat(book.users.slice(foundUser+1))
    } else {
      console.log('User not found, liking.')
      newUsers = [...book.users, userObj];
    }
    const likeConfig = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        "users": newUsers
      })
    }

    fetch(`${dbUrl}/${book.id}`, likeConfig)
      .then(res => res.json())
      .then(data => {
        renderPanel(data);
        renderList();
      })
      .catch(err => console.log(err))

    
  }
});
