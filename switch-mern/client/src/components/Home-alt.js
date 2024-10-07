// Assuming we have an array of post objects
const posts = [
    {
      title: "Post Title 1",
      price: 1000,
      content: "Post content 1",
      image_file: "image1.jpg"
    },
    {
      title: "Post Title 2",
      price: 2000,
      content: "Post content 2",
      image_file: "image2.jpg"
    }
    // Add more post objects as needed
  ];
  
  function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.className = 'post';
  
    const titleElement = document.createElement('h2');
    titleElement.textContent = post.title;
    postElement.appendChild(titleElement);
  
    const priceElement = document.createElement('p');
    priceElement.innerHTML = `<strong>Price: ₹ ${post.price}</strong>`;
    postElement.appendChild(priceElement);
  
    const contentElement = document.createElement('p');
    contentElement.textContent = post.content;
    postElement.appendChild(contentElement);
  
    if (post.image_file) {
      const imageElement = document.createElement('img');
      imageElement.src = post.image_file;
      imageElement.alt = post.title;
      postElement.appendChild(imageElement);
    }
  
    return postElement;
  }
  
  function renderPosts() {
    const contentContainer = document.getElementById('content');
    posts.forEach(post => {
      const postElement = createPostElement(post);
      contentContainer.appendChild(postElement);
    });
  }
  
  // Call this function when the DOM is loaded
  document.addEventListener('DOMContentLoaded', renderPosts);